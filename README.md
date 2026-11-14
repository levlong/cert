# CT-GenAI Study Lab

Web ôn thi ISTQB® Certified Tester – Testing with Generative AI (CT-GenAI) syllabus v1.1.

- Ghi chú lý thuyết theo từng Learning Objective (K1/K2/K3)
- 42 flashcard thuật ngữ
- 103 câu luyện tập có giải thích
- Thi thử 40 câu / 60–75 phút, phân bố theo trọng số chương
- Hỏi đáp syllabus bằng RAG tự viết (`rag.js`): BM25 + char-trigram, gộp RRF, trả lời kèm trích dẫn; nạp thêm PDF syllabus để tìm nguyên văn (xử lý hoàn toàn trong trình duyệt)
- Tiến độ lưu trong trình duyệt (localStorage)

Static site (`index.html` + `data.js` + `rag.js`), không cần build. Host trên GitHub Pages.
