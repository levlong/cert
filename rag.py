#!/usr/bin/env python3
"""RAG from scratch — bản Python của rag.js, chạy ở terminal, chỉ dùng thư viện chuẩn.

Pipeline giống hệt bản web: chunking → BM25 + TF-IDF char-trigram → Reciprocal Rank Fusion
→ trả lời trích xuất kèm trích dẫn + cảnh báo khi độ phủ từ khoá thấp. Không có LLM; dùng --prompt
để in prompt đã augment rồi dán vào chatbot bất kỳ.

Cách dùng:
    python rag.py "What is retrieval augmented generation?"
    python rag.py --pdf docs/ISTQB-CT-GenAI-Syllabus-v1.1.pdf "RAG khác fine-tuning thế nào?"
    python rag.py --pdf docs/… --prompt "LLMOps"      # in prompt để dán vào LLM
    python rag.py --pdf docs/…                        # không có câu hỏi → chế độ hỏi liên tục
Đọc PDF cần `pdftotext` (poppler) trên PATH, hoặc `pip install pypdf`.
"""
from __future__ import annotations

import argparse
import json
import math
import re
import shutil
import subprocess
import sys
import time
import unicodedata
from collections import Counter
from pathlib import Path

HERE = Path(__file__).resolve().parent
for _s in (sys.stdout, sys.stderr):  # console Windows mặc định cp1252 → ép UTF-8
    if hasattr(_s, "reconfigure"):
        _s.reconfigure(encoding="utf-8", errors="replace")

# ---------- 1. Chuẩn hoá & tokenize ----------
STOP = set(("vs versus a an the of to in on at by for with from as is are was were be been being it its this that these those "
            "and or not no but if then than so such into about over under between which what who whom whose how why when where "
            "do does did can could should would will shall may might must has have had also more most other some any each all "
            "la cua va cac nhung mot cho trong khi thi co duoc de voi nay do gi nao sao the nhu ve tu ra vao hay hoac cung boi "
            "neu ma bang den tai theo nen rang thi luc dang se da van con rat qua lam").split())
_MARKS = re.compile("[̀-ͯ]")
_SPLIT = re.compile(r"[^a-z0-9]+")
SENT = re.compile(r"(?<=[.!?])\s+|\n+")


def norm(s: str) -> str:
    s = _MARKS.sub("", unicodedata.normalize("NFD", s))
    return s.replace("đ", "d").replace("Đ", "d").lower()


def stem(w: str) -> str:
    if len(w) <= 4 or re.search(r"\d", w):
        return w
    w = re.sub(r"ies$", "y", w)
    w = re.sub(r"(ing|ed)$", "", w)
    return re.sub(r"([^s])s$", r"\1", w)


def words(s: str) -> list[str]:
    return [stem(w) for w in _SPLIT.split(norm(s)) if len(w) > 1 and w not in STOP]


def terms(s: str) -> list[str]:
    """unigram + bigram (bigram cho cụm như "prompt injection", "kiem thu" trọng số riêng)."""
    w = words(s)
    return w + [w[i] + "_" + w[i + 1] for i in range(len(w) - 1)]


def trigrams(s: str) -> Counter:
    m: Counter = Counter()
    for w in _SPLIT.split(norm(s)):
        if len(w) < 2:
            continue
        p = f" {w} "
        for i in range(len(p) - 2):
            m[p[i:i + 3]] += 1
    return m


def strip_html(h: str) -> str:
    h = re.sub(r"<[^>]+>", "", h).replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")
    return re.sub(r"\s+", " ", h).strip()


# ---------- Đọc data.js (object literal JS → JSON) ----------
def load_data_js(path: Path) -> dict:
    """Tokenizer nhỏ: chuỗi "…" giữ nguyên, key không ngoặc kép → "key", bỏ comment //, bỏ dấu phẩy thừa."""
    src = path.read_text(encoding="utf-8")
    out: dict = {}
    for m in re.finditer(r"const\s+(\w+)\s*=\s*", src):
        name, i = m.group(1), m.end()
        buf, depth, in_str = [], 0, False
        while i < len(src):
            c = src[i]
            if in_str:
                buf.append(c)
                if c == "\\":
                    buf.append(src[i + 1]); i += 2; continue
                if c == '"':
                    in_str = False
                i += 1; continue
            if c == '"':
                in_str = True; buf.append(c); i += 1; continue
            if src.startswith("//", i):
                i = src.index("\n", i); continue
            if c in "[{":
                depth += 1
            elif c in "]}":
                depth -= 1
                buf.append(c); i += 1
                if depth == 0:
                    break
                continue
            if c.isalpha() or c == "_":
                j = i
                while j < len(src) and (src[j].isalnum() or src[j] == "_"):
                    j += 1
                ident = src[i:j]
                k = j
                while k < len(src) and src[k].isspace():
                    k += 1
                buf.append(f'"{ident}"' if src[k:k + 1] == ":" else ident)  # key hay literal (true/false/null)
                i = j; continue
            buf.append(c); i += 1
        text = re.sub(r",(\s*[\]}])", r"\1", "".join(buf))
        out[name] = json.loads(text)
    return out


# ---------- 2. Chunking ----------
def notes_corpus(data: dict) -> list[dict]:
    out = []
    for c in data["CHAPTERS"]:
        for s in c["sections"]:
            text = "\n".join(strip_html(p) for p in s["points"])
            if s.get("tip"):
                text += "\nMẹo thi: " + strip_html(s["tip"])
            out.append({"src": "notes", "ref": s["id"], "title": s["title"], "text": text})
    for term, en, vi in data["GLOSSARY"]:
        out.append({"src": "glossary", "ref": "Glossary", "title": term, "text": f"{term}: {en}\n{vi}"})
    return out


HEAD = re.compile(r"^(\d+\.\d+(?:\.\d+)?)\s+([A-Z][^.]{3,})$")
DOTS = re.compile(r"\.{5,}")


def chunk_pages(pages: list[dict], max_w: int = 170, overlap: int = 40) -> list[dict]:
    """pages = [{n, lines}] → bỏ header/footer lặp & trang mục lục → cắt theo heading → cửa sổ max_w từ, chồng overlap."""
    key = lambda l: re.sub(r"\d+", "#", l).strip()
    freq: Counter = Counter()
    for p in pages:
        freq.update(set(key(l) for l in p["lines"]))
    boiler = lambda k: bool(k) and freq[k] > len(pages) * 0.3
    secs, cur = [], {"ref": "0", "title": "Front matter", "page": 1, "w": []}
    for p in pages:
        if sum(1 for l in p["lines"] if HEAD.match(re.sub(r"\s+", " ", l).strip()) or DOTS.search(l)) >= 8:
            continue  # trang mục lục
        for l in p["lines"]:
            l = re.sub(r"\s+", " ", l).strip()
            if not l or boiler(key(l)) or DOTS.search(l):
                continue
            h = HEAD.match(l)
            if h:
                secs.append(cur)
                cur = {"ref": h.group(1), "title": re.sub(r"\s+\d+$", "", h.group(2)), "page": p["n"], "w": []}
                continue
            cur["w"].extend((x, p["n"]) for x in l.split(" "))
    secs.append(cur)
    out = []
    for s in secs:
        w = s["w"]
        if len(w) < 15:
            continue
        i = 0
        while True:
            part = w[i:i + max_w]
            out.append({"src": "pdf", "ref": s["ref"], "title": s["title"], "page": part[0][1],
                        "text": " ".join(x for x, _ in part)})
            if i + max_w >= len(w):
                break
            i += max_w - overlap
    return out


def read_pdf(path: Path) -> list[dict]:
    if shutil.which("pdftotext"):
        txt = subprocess.run(["pdftotext", str(path), "-"], capture_output=True, check=True).stdout.decode("utf-8", "replace")
        return [{"n": i + 1, "lines": t.split("\n")} for i, t in enumerate(txt.split("\f")) if t.strip()]
    try:
        from pypdf import PdfReader  # type: ignore
    except ImportError:
        sys.exit("Cần `pdftotext` (poppler) trên PATH hoặc `pip install pypdf` để đọc PDF.")
    return [{"n": i + 1, "lines": (pg.extract_text() or "").split("\n")} for i, pg in enumerate(PdfReader(str(path)).pages)]


# ---------- 3. Indexing + 4. Retrieval ----------
class Index:
    def __init__(self, chunks: list[dict]):
        t0 = time.perf_counter()
        self.chunks, self.N = chunks, len(chunks)
        self.tf, self.len, self.vec = [], [], []
        df: Counter = Counter()
        gdf: Counter = Counter()
        tgs = []
        for c in chunks:
            full = c["title"] + " " + c["text"]
            tl = terms(full)
            tf = Counter(tl)
            df.update(tf.keys())
            tg = trigrams(full)
            gdf.update(tg.keys())
            self.tf.append(tf); self.len.append(len(tl)); tgs.append(tg)
        self.avgdl = sum(self.len) / (self.N or 1)
        self.df, self.gdf, self.vocab = df, gdf, len(df)
        for tg in tgs:  # vector trigram TF-IDF chuẩn hoá L2
            v = {g: (1 + math.log(f)) * self.gidf(g) for g, f in tg.items()}
            n = math.sqrt(sum(x * x for x in v.values())) or 1
            self.vec.append({g: x / n for g, x in v.items()})
        self.ms = (time.perf_counter() - t0) * 1000

    def idf(self, t: str) -> float:
        d = self.df.get(t, 0)
        return math.log(1 + (self.N - d + 0.5) / (d + 0.5))

    def gidf(self, g: str) -> float:
        return math.log((self.N + 1) / (self.gdf.get(g, 0) + 1)) + 1

    def bm25(self, qt: list[str], k1: float = 1.2, b: float = 0.75) -> list[float]:
        out = []
        for tf, dl in zip(self.tf, self.len):
            s = 0.0
            for t in qt:
                f = tf.get(t)
                if f:
                    s += self.idf(t) * f * (k1 + 1) / (f + k1 * (1 - b + b * dl / self.avgdl))
            out.append(s)
        return out

    def cosine(self, q: str) -> list[float]:
        v = {g: (1 + math.log(f)) * self.gidf(g) for g, f in trigrams(q).items()}
        n = math.sqrt(sum(x * x for x in v.values())) or 1
        return [sum(x / n * dv[g] for g, x in v.items() if g in dv) for dv in self.vec]

    def search(self, q: str, k: int = 5) -> dict:
        t0 = time.perf_counter()
        qt = list(dict.fromkeys(terms(q)))

        def rank(scores):
            order = sorted((i for i, s in enumerate(scores) if s > 0), key=lambda i: -scores[i])
            return {i: (r + 1, scores[i]) for r, i in enumerate(order)}

        rb, rc = rank(self.bm25(qt)), rank(self.cosine(q))
        fused = []
        for i in range(self.N):
            a, c = rb.get(i), rc.get(i)
            rrf = (1 / (60 + a[0]) if a else 0) + (1 / (60 + c[0]) if c else 0)
            if rrf > 0:
                fused.append((i, rrf, a, c))
        fused.sort(key=lambda o: -o[1])
        hits = [dict(self.chunks[i], di=i, rrf=rrf, bm=a, cs=c,
                     matched=[t for t in qt if "_" not in t and t in self.tf[i]]) for i, rrf, a, c in fused[:k]]
        return {"q": q, "qt": qt, "hits": hits, "ms": (time.perf_counter() - t0) * 1000}

    # ---------- 5. Augment + Generate (extractive) ----------
    def answer(self, res: dict, n_sent: int = 4) -> dict:
        qw = set(words(res["q"]))
        top = res["hits"][:3]
        tot = got = 0.0
        missing = []
        for w in qw:
            x = self.idf(w); tot += x
            if any(w in self.tf[h["di"]] for h in top):
                got += x
            else:
                missing.append(w)
        cand = []
        for hi, h in enumerate(top):
            for sent in SENT.split(h["text"]):
                w = words(sent)
                if len(w) < 4 or (h["src"] == "pdf" and re.match(r"[a-z]", sent.strip())):
                    continue
                s = sum(self.idf(x) for x in set(w) if x in qw)
                if s > 0:
                    cand.append((s / math.sqrt(len(w)) * (1 - hi * 0.15), sent.strip(), hi + 1))
        seen, sents = set(), []
        for s, sent, cite in sorted(cand, key=lambda c: -c[0]):
            if sent not in seen:
                seen.add(sent); sents.append({"sent": sent, "cite": cite})
            if len(sents) >= n_sent:
                break
        if not sents and top:
            sents = [{"sent": x.strip(), "cite": 1} for x in SENT.split(top[0]["text"])[:2]]
        return {"sents": sents, "coverage": got / tot if tot else 0.0, "missing": missing}


def label(h: dict) -> str:
    if h["src"] == "pdf":
        return f"Syllabus §{h['ref']} · tr.{h['page']}"
    return "Glossary" if h["src"] == "glossary" else f"Ghi chú §{h['ref']}"


def build_prompt(res: dict) -> str:
    ctx = "\n\n".join(
        f"[{j + 1}] ({'Syllabus §' + h['ref'] + ', p.' + str(h['page']) if h['src'] == 'pdf' else 'Glossary: ' + h['title'] if h['src'] == 'glossary' else 'Ghi chú §' + h['ref']}) {h['title']}\n{h['text']}"
        for j, h in enumerate(res["hits"]))
    return ("You are a tutor for the ISTQB CT-GenAI v1.1 exam.\nAnswer the question using ONLY the context below. Cite sources as [n]. "
            "If the context is insufficient, say so instead of guessing.\nTrả lời bằng tiếng Việt, giữ nguyên thuật ngữ tiếng Anh.\n\n"
            f"### Context\n{ctx}\n\n### Question\n{res['q']}")


# ---------- CLI ----------
def ask(ix: Index, q: str, k: int, as_json: bool, show_prompt: bool, full: bool) -> None:
    res = ix.search(q, k)
    ans = ix.answer(res)
    if as_json:
        print(json.dumps({"query": q, "terms": res["qt"], "ms": res["ms"], "coverage": ans["coverage"], "missing": ans["missing"],
                          "answer": ans["sents"], "hits": [{k: v for k, v in h.items() if k != "di"} for h in res["hits"]]},
                         ensure_ascii=False, indent=2))
        return
    if show_prompt:
        print(build_prompt(res)); return
    print(f"\nquery → {len([t for t in res['qt'] if '_' not in t])} terms · top {len(res['hits'])} · độ phủ {ans['coverage']:.0%} · {res['ms']:.1f} ms")
    if not res["hits"]:
        print("Không tìm thấy đoạn nào liên quan. Thử dùng thuật ngữ tiếng Anh trong syllabus."); return
    if ans["coverage"] < 0.6:
        miss = ", ".join(ans["missing"]) or "đủ từ khoá"
        print(f"⚠ Độ phủ thấp: không thấy {miss} trong các đoạn tìm được — có thể syllabus không đề cập.")
    print("\nTRẢ LỜI (trích từ nguồn):")
    for s in ans["sents"]:
        print(f"  • {s['sent']} [{s['cite']}]")
    print("\nNGỮ CẢNH:")
    for j, h in enumerate(res["hits"], 1):
        bm = f"#{h['bm'][0]}" if h["bm"] else "–"
        cs = f"#{h['cs'][0]}" if h["cs"] else "–"
        print(f"  [{j}] {label(h)} — {h['title']}   (BM25 {bm} · trigram {cs} · RRF {h['rrf']:.4f})")
        txt = h["text"].replace("\n", " ")
        print("      " + (txt if full else (txt[:220] + ("…" if len(txt) > 220 else ""))))


def main() -> None:
    ap = argparse.ArgumentParser(description="Hỏi đáp syllabus CT-GenAI bằng RAG tự viết (bản Python của rag.js).")
    ap.add_argument("question", nargs="?", help="câu hỏi; bỏ trống để vào chế độ hỏi liên tục")
    ap.add_argument("--pdf", type=Path, help="PDF syllabus để tìm cả nguyên văn (không commit vào repo)")
    ap.add_argument("--data", type=Path, default=HERE / "data.js", help="đường dẫn data.js (mặc định cạnh script)")
    ap.add_argument("-k", type=int, default=5, help="số đoạn lấy về (mặc định 5)")
    ap.add_argument("--prompt", action="store_true", help="chỉ in prompt đã augment để dán vào LLM")
    ap.add_argument("--json", action="store_true", help="xuất JSON")
    ap.add_argument("--full", action="store_true", help="in đầy đủ text các đoạn")
    a = ap.parse_args()

    chunks = notes_corpus(load_data_js(a.data))
    n_notes = len(chunks)
    if a.pdf:
        chunks += chunk_pages(read_pdf(a.pdf))
    ix = Index(chunks)
    if not a.json:
        print(f"Index: {ix.N} chunks ({ix.N - n_notes} từ PDF + {n_notes} ghi chú/glossary) · {ix.vocab:,} terms · {ix.ms:.0f} ms", file=sys.stderr)
    if a.question:
        ask(ix, a.question, a.k, a.json, a.prompt, a.full); return
    try:
        while True:
            q = input("\n? ").strip()
            if q:
                ask(ix, q, a.k, a.json, a.prompt, a.full)
    except (EOFError, KeyboardInterrupt):
        print()


if __name__ == "__main__":
    main()
