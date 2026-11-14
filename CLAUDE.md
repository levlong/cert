# CT-GenAI Study Lab

Web tĩnh ôn thi ISTQB® Certified Tester – Testing with Generative AI (CT-GenAI), syllabus **v1.1** (27/04/2026).
Không có build step, không dependency. Mở `index.html` là chạy (riêng tab Hỏi đáp cần chạy qua HTTP nếu nạp PDF; `pdf.js` chỉ tải lazy từ cdnjs khi người dùng chọn file).

## Cấu trúc
- `index.html` — toàn bộ UI + logic (vanilla JS, 1 file). Load `data.js` qua `<script src>`.
- `data.js` — nội dung học, 3 mảng:
  - `CHAPTERS[]` → `{n,title,vi,mins,keywords[],sections[{id,title,lo,k,points[],tip}]}`; `points` là HTML (dùng `<b>`, `<u>`), tiếng Việt giữ thuật ngữ tiếng Anh.
  - `GLOSSARY[]` → `[term, definitionEN, giảiThíchVI]`.
  - `QUIZ[]` → `{ch, lo:"2.2.5", k:"K1|K2|K3", q, o:[4 đáp án], a:index đúng, w:giải thích VI}`. Câu hỏi viết **tiếng Anh** (đề thật tiếng Anh), giải thích tiếng Việt. App tự xáo thứ tự đáp án khi load nên không cần cân bằng vị trí `a`.
- `exams.js` — object `ExamPDF`: parse PDF đề thi thử (dạng "Đề thi thử ISTQB CT-GenAI v1.1 – Đề N (Giải thích chi tiết)", tác giả Nhựt Võ – istqbbaodau.com) thành `{title,pts,qs:[{n,ch,lo,k,pts,q,o,a,w,ref}],warn[]}` ngay trong trình duyệt (dùng `RAG.readPdf`), cache `localStorage` key `ctgenai_exams`. Repo **không chứa nội dung đề** (bản quyền tác giả; PDF nằm trong `docs/test/` bị gitignore). **Không xáo** thứ tự câu/đáp án của đề cố định vì giải thích tham chiếu (a)/(b)/(c)/(d); `w` là text thô, render qua `esc()`.
- `rag.js` — engine RAG tự viết cho tab **Hỏi đáp** (object `RAG`): chunking → BM25 + TF-IDF char-trigram → Reciprocal Rank Fusion → trả lời trích xuất kèm trích dẫn + cảnh báo khi độ phủ từ khoá < 60%. Không có LLM; nút "Copy prompt" dựng prompt đã augment.
  - Corpus mặc định: `CHAPTERS` + `GLOSSARY` (ghi chú tự viết). PDF syllabus **không** commit (bản quyền ISTQB, `docs/` bị gitignore); người dùng tự nạp PDF, được parse trong trình duyệt và cache ở `localStorage` key `ctgenai_rag_pdf`.
- `rag.py` — bản Python CLI của `rag.js` (cùng thuật toán, cùng kết quả; stdlib only). Tự parse `data.js` bằng tokenizer nhỏ (chỉ hỗ trợ chuỗi `"…"`, key không ngoặc kép, comment `//`). Khi sửa thuật toán ở một bên, sửa bên kia cho khớp.
- Tiến độ lưu `localStorage` key `ctgenai_v1`.

## Quy ước khi thêm câu hỏi
- `lo` phải trùng một `sections[].id` có trong `CHAPTERS`, nếu không câu đó không gắn được vào mục học.
- Bám sát nội dung syllabus, không bịa khái niệm ngoài syllabus. K3 nên là scenario (đề cho tình huống, chọn kỹ thuật/hành động).
- Kiểm tra nhanh: `node -e "const vm=require('vm');const c={};vm.createContext(c);vm.runInContext(require('fs').readFileSync('data.js','utf8')+';this.Q=QUIZ',c);c.Q.forEach(q=>{if(q.o.length!==4||q.a<0||q.a>3)console.log('BAD',q.q)});console.log(c.Q.length,'questions OK')"`

## Thi thử
Chế độ ngẫu nhiên: 40 câu theo `DIST={1:6,2:14,3:9,4:6,5:5}` trong `index.html` (theo trọng số phút giảng dạy của syllabus). Chế độ đề cố định: `EXAMS` (nạp từ PDF, xem `exams.js`). Chấm theo điểm (`pts`, mặc định 1), đạt ≥ 65%; kết quả lưu `S.exams[]` kèm `exam` (0 = ngẫu nhiên). Câu của đề cố định không ghi vào `S.stats` (không vào tab Câu sai).

## Deploy
GitHub Pages: push lên repo public, Settings → Pages → branch `main`, folder `/ (root)`. Có `.nojekyll`.
