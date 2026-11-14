// ===== RAG FROM SCRATCH: chunking → indexing → retrieval → augmentation → generation =====
// Không dùng thư viện. Retrieval lai: BM25 (sparse, theo từ) + TF-IDF char-trigram (bắt được biến thể/lỗi chính tả),
// gộp bằng Reciprocal Rank Fusion. "Generation" là trích xuất (extractive) từ các chunk tìm được, kèm trích dẫn;
// nút "Copy prompt" dựng sẵn prompt đã augment để dán vào chatbot bất kỳ.
const RAG = (() => {
  // ---------- 1. Chuẩn hoá & tokenize ----------
  const STOP = new Set(("vs versus a an the of to in on at by for with from as is are was were be been being it its this that these those " +
    "and or not no but if then than so such into about over under between which what who whom whose how why when where " +
    "do does did can could should would will shall may might must has have had also more most other some any each all " +
    "la cua va cac nhung mot cho trong khi thi co duoc de voi nay do gi nao sao the nhu ve tu ra vao hay hoac cung boi " +
    "neu ma bang den tai theo nen rang thi luc dang se da van con rat qua lam").split(" "));
  const norm = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[đĐ]/g, "d").toLowerCase();
  const stem = w => w.length <= 4 || /\d/.test(w) ? w
    : w.replace(/ies$/, "y").replace(/(ing|ed)$/, "").replace(/([^s])s$/, "$1");
  function words(s) { return norm(s).split(/[^a-z0-9]+/).filter(w => w.length > 1 && !STOP.has(w)).map(stem); }
  // term = unigram + bigram (bigram giúp cụm như "prompt injection", "kiem thu" có trọng số riêng)
  function terms(s) { const w = words(s), t = w.slice(); for (let i = 0; i + 1 < w.length; i++) t.push(w[i] + "_" + w[i + 1]); return t; }
  function trigrams(s) {
    const m = new Map();
    for (const w of norm(s).split(/[^a-z0-9]+/)) { if (w.length < 2) continue; const p = " " + w + " "; for (let i = 0; i + 3 <= p.length; i++) { const g = p.substr(i, 3); m.set(g, (m.get(g) || 0) + 1); } }
    return m;
  }
  const strip = h => h.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();

  // ---------- 2. Chunking ----------
  // Corpus mặc định: ghi chú trong data.js (mỗi mục học = 1 chunk, mỗi thuật ngữ = 1 chunk).
  function notesCorpus() {
    const out = [];
    CHAPTERS.forEach(c => c.sections.forEach(s => out.push({
      src: "notes", ref: s.id, title: s.title, text: s.points.map(strip).join("\n") + (s.tip ? "\nMẹo thi: " + strip(s.tip) : "")
    })));
    GLOSSARY.forEach(g => out.push({ src: "glossary", ref: "Glossary", title: g[0], text: g[0] + ": " + g[1] + "\n" + g[2] }));
    return out;
  }
  // PDF: dòng → bỏ header/footer lặp → cắt theo heading "x.y(.z) Title" → cửa sổ ~170 từ, chồng lấn 40 từ.
  function chunkPages(pages, maxW = 170, overlap = 40) {
    const key = l => l.replace(/\d+/g, "#").trim();
    const freq = new Map();
    pages.forEach(p => new Set(p.lines.map(key)).forEach(k => freq.set(k, (freq.get(k) || 0) + 1)));
    const boiler = k => k.length && freq.get(k) > pages.length * 0.3;
    const secs = []; let cur = { ref: "0", title: "Front matter", page: 1, w: [] };
    const HEAD = /^(\d+\.\d+(?:\.\d+)?)\s+([A-Z][^.]{3,})$/;
    for (const p of pages) {
      // trang mục lục: rất nhiều dòng trông như heading → bỏ cả trang
      if (p.lines.filter(l => HEAD.test(l.replace(/\s+/g, " ").trim()) || /\.{5,}/.test(l)).length >= 8) continue;
      for (let l of p.lines) {
      l = l.replace(/\s+/g, " ").trim();
      if (!l || boiler(key(l)) || /\.{5,}/.test(l)) continue;           // bỏ header/footer & dòng mục lục
      const h = l.match(HEAD);
      if (h) { secs.push(cur); cur = { ref: h[1], title: h[2].replace(/\s+\d+$/, ""), page: p.n, w: [] }; continue; }
      cur.w.push(...l.split(" ").map(x => ({ x, pg: p.n })));
    } }
    secs.push(cur);
    const out = [];
    for (const s of secs) {
      if (s.w.length < 15) continue;
      for (let i = 0; i < s.w.length; i += maxW - overlap) {
        const part = s.w.slice(i, i + maxW);
        out.push({ src: "pdf", ref: s.ref, title: s.title, page: part[0].pg, text: part.map(o => o.x).join(" ") });
        if (i + maxW >= s.w.length) break;
      }
    }
    return out;
  }

  // ---------- 3. Indexing ----------
  let IDX = null;
  function build(chunks) {
    const t0 = performance.now(), N = chunks.length, df = new Map(), gdf = new Map();
    const docs = chunks.map(c => {
      const full = c.title + " " + c.text, tl = terms(full), tf = new Map();
      tl.forEach(t => tf.set(t, (tf.get(t) || 0) + 1));
      tf.forEach((_, t) => df.set(t, (df.get(t) || 0) + 1));
      const tg = trigrams(full); tg.forEach((_, g) => gdf.set(g, (gdf.get(g) || 0) + 1));
      return { c, tf, len: tl.length, tg };
    });
    const avgdl = docs.reduce((a, d) => a + d.len, 0) / (N || 1);
    const idf = t => Math.log(1 + (N - (df.get(t) || 0) + 0.5) / ((df.get(t) || 0) + 0.5));
    const gidf = g => Math.log((N + 1) / ((gdf.get(g) || 0) + 1)) + 1;
    docs.forEach(d => { // vector trigram TF-IDF đã chuẩn hoá L2
      let n = 0; const v = new Map(); d.tg.forEach((f, g) => { const x = (1 + Math.log(f)) * gidf(g); v.set(g, x); n += x * x; });
      n = Math.sqrt(n) || 1; v.forEach((x, g) => v.set(g, x / n)); d.vec = v; delete d.tg;
    });
    IDX = { docs, N, avgdl, idf, gidf, vocab: df.size, ms: performance.now() - t0 };
    return IDX;
  }

  // ---------- 4. Retrieval ----------
  function bm25(qt, k1 = 1.2, b = 0.75) {
    return IDX.docs.map((d, i) => {
      let s = 0;
      for (const t of qt) { const f = d.tf.get(t); if (f) s += IDX.idf(t) * f * (k1 + 1) / (f + k1 * (1 - b + b * d.len / IDX.avgdl)); }
      return { i, s };
    });
  }
  function cosine(q) {
    let n = 0; const v = new Map(); trigrams(q).forEach((f, g) => { const x = (1 + Math.log(f)) * IDX.gidf(g); v.set(g, x); n += x * x; });
    n = Math.sqrt(n) || 1;
    return IDX.docs.map((d, i) => { let s = 0; v.forEach((x, g) => { const y = d.vec.get(g); if (y) s += x / n * y; }); return { i, s }; });
  }
  function search(q, k = 5) {
    const t0 = performance.now(), qt = [...new Set(terms(q))];
    const rank = arr => { const r = new Map(); arr.filter(o => o.s > 0).sort((a, b) => b.s - a.s).forEach((o, j) => r.set(o.i, { rank: j + 1, s: o.s })); return r; };
    const rb = rank(bm25(qt)), rc = rank(cosine(q));
    const fused = IDX.docs.map((_, i) => {
      const a = rb.get(i), c = rc.get(i);
      return { i, rrf: (a ? 1 / (60 + a.rank) : 0) + (c ? 1 / (60 + c.rank) : 0), bm: a, cs: c };
    }).filter(o => o.rrf > 0).sort((a, b) => b.rrf - a.rrf).slice(0, k);
    const hits = fused.map(o => ({ ...IDX.docs[o.i].c, di: o.i, rrf: o.rrf, bm: o.bm, cs: o.cs,
      matched: qt.filter(t => !t.includes("_") && IDX.docs[o.i].tf.has(t)) }));
    return { q, qt, hits, ms: performance.now() - t0 };
  }

  // ---------- 5. Augment + Generate (extractive) ----------
  // Trả về câu trích xuất + độ phủ: phần (theo idf) các từ khoá của câu hỏi có xuất hiện trong top chunk.
  // Độ phủ thấp → báo "không đủ ngữ cảnh" thay vì bịa (chống hallucination ở bước generate).
  const SENT = /(?<=[.!?])\s+|\n+/;
  function answer(res, nSent = 4) {
    const qw = new Set(words(res.q)), top = res.hits.slice(0, 3), cand = [];
    let tot = 0, got = 0; const missing = [];
    qw.forEach(w => { const x = IDX.idf(w); tot += x; if (top.some(h => IDX.docs[h.di].tf.has(w))) got += x; else missing.push(w); });
    top.forEach((h, hi) => {
      h.text.split(SENT).forEach(sent => {
        const w = words(sent); if (w.length < 4) return;
        if (h.src === "pdf" && /^[a-z]/.test(sent.trim())) return; // mảnh câu bị cắt ở đầu cửa sổ chunk
        let s = 0; new Set(w).forEach(x => { if (qw.has(x)) s += IDX.idf(x); });
        if (s > 0) cand.push({ sent: sent.trim(), s: s / Math.sqrt(w.length) * (1 - hi * 0.15), cite: hi + 1 });
      });
    });
    const seen = new Set();
    let sents = cand.sort((a, b) => b.s - a.s).filter(c => !seen.has(c.sent) && seen.add(c.sent)).slice(0, nSent);
    if (!sents.length && top.length) sents = top[0].text.split(SENT).slice(0, 2).map(x => ({ sent: x.trim(), cite: 1 }));
    return { sents, coverage: tot ? got / tot : 0, missing };
  }
  function prompt(res) {
    const ctx = res.hits.map((h, j) => `[${j + 1}] (${h.src === "pdf" ? "Syllabus §" + h.ref + ", p." + h.page : h.src === "glossary" ? "Glossary: " + h.title : "Ghi chú §" + h.ref}) ${h.title}\n${h.text}`).join("\n\n");
    return `You are a tutor for the ISTQB CT-GenAI v1.1 exam.\nAnswer the question using ONLY the context below. Cite sources as [n]. ` +
      `If the context is insufficient, say so instead of guessing.\nTrả lời bằng tiếng Việt, giữ nguyên thuật ngữ tiếng Anh.\n\n### Context\n${ctx}\n\n### Question\n${res.q}`;
  }

  // ---------- PDF loader (pdf.js chỉ tải khi người dùng chọn file) ----------
  const PDFJS = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/";
  function loadPdfJs() {
    if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
    return new Promise((ok, no) => {
      const s = document.createElement("script"); s.src = PDFJS + "pdf.min.js";
      s.onload = () => { pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS + "pdf.worker.min.js"; ok(pdfjsLib); };
      s.onerror = () => no(new Error("Không tải được pdf.js")); document.head.appendChild(s);
    });
  }
  async function readPdf(file, onProg) {
    const lib = await loadPdfJs(), doc = await lib.getDocument({ data: await file.arrayBuffer() }).promise, pages = [];
    for (let n = 1; n <= doc.numPages; n++) {
      const tc = await (await doc.getPage(n)).getTextContent(); let line = "", lines = [];
      tc.items.forEach(it => { line += it.str; if (it.hasEOL) { lines.push(line); line = ""; } });
      if (line) lines.push(line);
      pages.push({ n, lines }); onProg && onProg(n, doc.numPages);
    }
    return pages;
  }

  return { notesCorpus, chunkPages, build, search, answer, prompt, readPdf, get idx() { return IDX; } };
})();
