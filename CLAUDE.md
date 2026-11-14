# CT-GenAI Study Lab

Web tĩnh ôn thi ISTQB® Certified Tester – Testing with Generative AI (CT-GenAI), syllabus **v1.1** (27/04/2026).
Không có build step, không dependency. Mở `index.html` là chạy (riêng tab Hỏi đáp cần chạy qua HTTP nếu nạp PDF; `pdf.js` chỉ tải lazy từ cdnjs khi người dùng chọn file).

## Cấu trúc
- `index.html` — toàn bộ UI + logic (vanilla JS, 1 file). Load `data.js` qua `<script src>`.
- `data.js` — nội dung học, 3 mảng:
  - `CHAPTERS[]` → `{n,title,vi,mins,keywords[],sections[{id,title,lo,k,points[],tip}]}`; `points` là HTML (dùng `<b>`, `<u>`), tiếng Việt giữ thuật ngữ tiếng Anh.
  - `GLOSSARY[]` → `[term, definitionEN, giảiThíchVI]`.
  - `QUIZ[]` → `{ch, lo:"2.2.5", k:"K1|K2|K3", q, o:[4 đáp án], a:index đúng, w:giải thích VI}`. Câu hỏi viết **tiếng Anh** (đề thật tiếng Anh), giải thích tiếng Việt. App tự xáo thứ tự đáp án khi load nên không cần cân bằng vị trí `a`.
- `rag.js` — engine RAG tự viết cho tab **Hỏi đáp** (object `RAG`): chunking → BM25 + TF-IDF char-trigram → Reciprocal Rank Fusion → trả lời trích xuất kèm trích dẫn + cảnh báo khi độ phủ từ khoá < 60%. Không có LLM; nút "Copy prompt" dựng prompt đã augment.
  - Corpus mặc định: `CHAPTERS` + `GLOSSARY` (ghi chú tự viết). PDF syllabus **không** commit (bản quyền ISTQB, `docs/` bị gitignore); người dùng tự nạp PDF, được parse trong trình duyệt và cache ở `localStorage` key `ctgenai_rag_pdf`.
- Tiến độ lưu `localStorage` key `ctgenai_v1`.

## Quy ước khi thêm câu hỏi
- `lo` phải trùng một `sections[].id` có trong `CHAPTERS`, nếu không câu đó không gắn được vào mục học.
- Bám sát nội dung syllabus, không bịa khái niệm ngoài syllabus. K3 nên là scenario (đề cho tình huống, chọn kỹ thuật/hành động).
- Kiểm tra nhanh: `node -e "const vm=require('vm');const c={};vm.createContext(c);vm.runInContext(require('fs').readFileSync('data.js','utf8')+';this.Q=QUIZ',c);c.Q.forEach(q=>{if(q.o.length!==4||q.a<0||q.a>3)console.log('BAD',q.q)});console.log(c.Q.length,'questions OK')"`

## Thi thử
Phân bố 40 câu theo `DIST={1:6,2:14,3:9,4:6,5:5}` trong `index.html` (theo trọng số phút giảng dạy của syllabus). Đạt ≥ 65%.

## Deploy
GitHub Pages: push lên repo public, Settings → Pages → branch `main`, folder `/ (root)`. Có `.nojekyll`.
