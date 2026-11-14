// ===== ĐỀ THI THỬ CỐ ĐỊNH: nạp từ PDF, parse trong trình duyệt =====
// Repo KHÔNG chứa nội dung đề (bản quyền tác giả). Người dùng chọn file PDF "Đề thi thử ISTQB CT-GenAI v1.1 – Đề N
// (Giải thích chi tiết)"; pdf.js đọc text → parse thành {title, qs[]} → cache localStorage (ctgenai_exams).
// Định dạng PDF kỳ vọng (mỗi câu):  "N. câu hỏi…" / "N K2 1 điểm" / "a. … b. … c. … d. …" (1 hoặc nhiều dòng)
//                                    / "Đáp án đúng: x)" / "Giải thích: …" / "Syllabus v1.1: Mục x.y.z … | KL: …"
const ExamPDF = (() => {
  const KEY = "ctgenai_exams";
  const META = /^(\d+) (K\d) (\d) điểm$/;
  const QSTART = /^(\d{1,2})\. (.+)$/;

  function parse(pages, fileName) {
    const L = [];
    pages.forEach(p => p.lines.forEach(l => { l = l.replace(/\s+/g, " ").trim(); if (l) L.push(l); }));
    const t = L.find(l => /^Đề thi thử/.test(l)) || fileName.replace(/\.pdf$/i, "");
    const m = t.match(/Đề\s*(\d+)/g);
    const title = m ? m[m.length - 1].replace(/\s+/, " ") : t;
    const body = L.filter(l => !/^Đề thi thử ISTQB/.test(l) && !/istqbbaodau\.com/.test(l));
    const qs = [], warn = [];
    let ch = null;
    for (let i = 0; i < body.length; i++) {
      const mc = body[i].match(/^Chương (\d) /); if (mc) ch = +mc[1];
      const mq = body[i].match(QSTART); if (!mq) continue;
      let mi = -1; for (let j = i + 1; j < Math.min(i + 7, body.length); j++) if (META.test(body[j])) { mi = j; break; }
      if (mi < 0) continue;
      const n = +mq[1], meta = body[mi].match(META);
      let q = [mq[2], ...body.slice(i + 1, mi)].join(" ");
      i = mi + 1;
      const blk = [];
      while (i < body.length && !body[i].startsWith("Đáp án đúng")) blk.push(body[i++]);
      if (i >= body.length) { warn.push(`Câu ${n}: không thấy "Đáp án đúng"`); break; }
      const txt = blk.join(" ");
      const pos = []; let start = 0;
      for (const letter of "abcd") {
        const re = new RegExp("(?:^|\\s)" + letter + "\\. "), mm = re.exec(txt.slice(start));
        if (!mm) break; pos.push([start + mm.index, start + mm.index + mm[0].length]); start = pos[pos.length - 1][1];
      }
      if (pos.length !== 4) { warn.push(`Câu ${n}: không tách được 4 đáp án`); continue; }
      if (pos[0][0] > 0) q += " " + txt.slice(0, pos[0][0]).trim();
      const o = pos.map((p, k) => txt.slice(p[1], k < 3 ? pos[k + 1][0] : txt.length).trim());
      const ma = body[i].match(/Đáp án đúng: ([abcd])/); i++;
      if (!ma) { warn.push(`Câu ${n}: đáp án lạ`); continue; }
      const why = [];
      while (i < body.length && !body[i].startsWith("Syllabus v1.1")) why.push(body[i++]);
      const ref = (body[i] || "").replace("Syllabus v1.1: ", "");
      const lo = ref.match(/Mục (\d\.\d\.\d)/);
      qs.push({ n, ch, k: meta[2], pts: +meta[3], q: q.trim(), o, a: "abcd".indexOf(ma[1]),
        w: why.join(" ").replace(/^Giải thích: /, ""), lo: lo ? lo[1] : (ch ? ch + ".x.x" : "?"), ref });
    }
    return { title, qs, warn };
  }

  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function save(list) { try { localStorage.setItem(KEY, JSON.stringify(list)); return true; } catch (e) { return false; } }
  async function addFile(file, list) {
    const pages = await RAG.readPdf(file);
    const ex = parse(pages, file.name);
    if (ex.qs.length < 5) throw new Error(`${file.name}: chỉ đọc được ${ex.qs.length} câu — không đúng định dạng đề`);
    ex.id = ex.title; ex.pts = ex.qs.reduce((a, q) => a + q.pts, 0);
    const k = list.findIndex(e => e.id === ex.id);
    if (k >= 0) list[k] = ex; else list.push(ex);
    list.sort((a, b) => a.title.localeCompare(b.title, "vi"));
    return ex;
  }
  return { parse, load, save, addFile };
})();
