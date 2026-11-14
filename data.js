// ===== CONTENT DATA: ISTQB CT-GenAI v1.1 =====
const CHAPTERS = [
{ n:1, title:"Introduction to Generative AI for Software Testing", mins:100, vi:"Nhập môn GenAI cho kiểm thử",
  keywords:["AI chatbot","context window","deep learning","embedding","feature","foundation LLM","generative AI","generative pre-trained transformer","instruction-tuned LLM","large language model","machine learning","multimodal model","reasoning LLM","symbolic AI","tokenization","transformer"],
  sections:[
  { id:"1.1.1", title:"AI Spectrum: Symbolic AI, Classical ML, Deep Learning, GenAI", lo:"GenAI-1.1.1", k:"K1",
    points:[
      "<b>Symbolic AI</b>: hệ thống <b>rule-based</b> – biểu diễn tri thức bằng ký hiệu (symbols) và luật logic, bắt chước ra quyết định của người.",
      "<b>Classical ML</b>: <b>data-driven</b> – cần data preparation, <b>feature selection</b>, model training. Dùng cho phân loại defect, dự đoán lỗi.",
      "<b>Deep learning</b>: dùng <b>neural networks</b> tự học feature từ dữ liệu lớn/phức tạp (ảnh, video, audio, text) – không cần người định nghĩa feature thủ công (nhưng vẫn cần người annotate, tune, validate).",
      "<b>Generative AI</b>: dùng kỹ thuật deep learning để <b>tạo nội dung mới</b> (text, ảnh, code) bằng cách học và bắt chước pattern trong training data.",
      "<b>Lợi thế chính của GenAI cho testing</b>: dùng <b>pre-trained models</b> áp dụng thẳng vào test task, <u>không cần training phase bổ sung</u> – nhưng kèm rủi ro (Ch.3)."
    ],
    tip:"K1 = nhớ. Thi hay hỏi 'loại AI nào dùng rule-based?' hoặc 'lợi thế chính của GenAI là gì?'. Nhớ chuỗi: Symbolic (rules) → ML (features) → DL (neural nets) → GenAI (tạo mới)."
  },
  { id:"1.1.2", title:"Basics of Generative AI and LLMs", lo:"GenAI-1.1.2", k:"K2",
    points:[
      "LLM dựa trên <b>Generative Pre-trained Transformer (GPT)</b>, train trên dataset rất lớn (sách, bài báo, web).",
      "<b>SLM (Small Language Model)</b>: model nhỏ gọn, <b>ít tham số hơn</b>, giải pháp nhẹ và tập trung.",
      "<b>Tokenization</b>: chia text thành <b>token</b> (ký tự, sub-word hoặc từ). LLM tokenize input trước khi xử lý.",
      "<b>Embedding</b>: biểu diễn số (vector nhiều chiều) của token, mã hoá quan hệ ngữ nghĩa/cú pháp/ngữ cảnh. Token <b>nghĩa giống nhau → vector gần nhau</b>.",
      "<b>Transformer</b>: kiến trúc neural network xử lý ngữ cảnh chuỗi text dài, học quan hệ giữa các token. Khi <b>inference</b>, LLM <b>dự đoán token tiếp theo</b>.",
      "Output là <b>statistically plausible</b> (hợp lý về thống kê) – <b>plausible ≠ correct</b>.",
      "<b>Non-deterministic</b>: cùng input có thể ra output khác nhau, do bản chất <b>xác suất của inference</b> + <b>hyperparameter settings</b>.",
      "<b>Context window</b>: lượng text (tính bằng token) model xét khi sinh output. Lớn hơn → giữ mạch lạc với đoạn dài (vd. log test lớn) <b>nhưng</b> tăng độ phức tạp tính toán & thời gian xử lý."
    ],
    tip:"Phân biệt rõ tokenization (chia nhỏ) vs embedding (biến thành vector). Câu hỏi về context window luôn có trade-off: coherence ↑ nhưng compute ↑."
  },
  { id:"1.1.3", title:"Foundation, Instruction-Tuned and Reasoning LLMs", lo:"GenAI-1.1.3", k:"K2",
    points:[
      "<b>Foundation LLM</b> (= Base LLM): general-purpose, train trên dữ liệu đa dạng (text, code, ảnh…). Mạnh, linh hoạt nhưng <b>thường cần adapt thêm</b> cho task cụ thể.",
      "<b>Instruction-tuned LLM</b>: fine-tune từ foundation bằng dataset <b>cặp prompt – expected response</b>. Tối ưu task adherence, instruction following, response coherence. Còn gọi là <b>non-reasoning</b>.",
      "<b>Reasoning LLM</b>: mở rộng instruction-tuned, nhấn mạnh <b>logical inference, multi-step problem-solving, chain-of-thought</b>. Hợp với task <b>high-cognitive-load</b>, kỹ thuật.",
      "Trong testing dùng cả instruction-tuned và reasoning; chọn theo <b>độ phức tạp & nhu cầu suy luận</b> của task."
    ],
    tip:"Chuỗi tiến hoá: Foundation → Instruction-tuned → Reasoning. Hỏi 'task prioritization phức tạp nhiều ràng buộc nên dùng model nào?' → Reasoning LLM."
  },
  { id:"1.1.4", title:"Multimodal LLMs and Vision-Language Models", lo:"GenAI-1.1.4", k:"K2",
    points:[
      "<b>Multimodal LLM</b>: mở rộng transformer để xử lý nhiều modality (text, ảnh, âm thanh, video). Tokenization được <b>điều chỉnh theo từng loại dữ liệu</b> – ảnh được chuyển thành embedding qua vision-language model.",
      "<b>Vision-language model (VLM)</b>: tập con của multimodal, kết hợp <b>visual + textual</b>: image captioning, visual question answering, kiểm tra nhất quán giữa text và ảnh.",
      "Ứng dụng testing: phân tích <b>screenshot, GUI wireframe</b> cùng defect report/user story → phát hiện <b>khác biệt giữa expected result và giao diện thực tế</b>; sinh test case giàu ngữ cảnh (text + visual cue) → tăng coverage."
    ],
    tip:"HO-1.1.4: prompt dùng cả text + ảnh. Câu hỏi hay: 'LLM augmented with VLM giúp gì?' → so sánh screenshot với expected, sinh test case từ wireframe."
  },
  { id:"1.2.1", title:"Key LLM Capabilities for Test Tasks", lo:"GenAI-1.2.1", k:"K2",
    points:[
      "LLM đọc hiểu requirements, spec, screenshot, code, test case, defect report → hỗ trợ xuyên suốt test process.",
      "<b>Requirements analysis & improvement</b>: tìm ambiguity, inconsistency, thiếu thông tin; sinh câu hỏi làm rõ với stakeholder.",
      "<b>Test case creation support</b>: sinh test case, gợi ý test objective từ requirement/user story.",
      "<b>Test oracle generation</b>: sinh <b>expected results</b>.",
      "<b>Test data generation</b>: dataset, boundary values, tổ hợp dữ liệu.",
      "<b>Test automation support</b>: sinh test script từ mô tả test case; cải thiện script sẵn có.",
      "<b>Test result analysis</b>: tóm tắt, phân loại anomaly theo severity/priority.",
      "<b>Testware creation</b>: test plan, test report, defect report và cập nhật theo dự án."
    ],
    tip:"7 capability – nhớ theo luồng test process: Requirement → Test case → Oracle → Data → Automation → Result analysis → Testware docs."
  },
  { id:"1.2.2", title:"AI Chatbots vs LLM-Powered Testing Applications", lo:"GenAI-1.2.2", k:"K2",
    points:[
      "Hai cách tương tác bổ trợ nhau: <b>AI chatbot</b> và <b>LLM-powered application</b> tích hợp trong test tool.",
      "<b>AI Chatbot</b>: giao diện hội thoại, phản hồi tức thì; refine qua <b>prompt chaining</b>; hợp với routine task, exploratory testing, onboarding tester mới, làm rõ khái niệm. Dễ dùng kể cả non-technical stakeholder.",
      "<b>LLM-powered testing application</b>: tích hợp LLM qua <b>API</b> cho task <b>well-defined, thường tự động</b>; <b>customization & scalability</b> cao hơn; nhúng GenAI vào test framework sẵn có; có thể tạo <b>AI agent</b> cho vai trò test cụ thể (Ch.4).",
      "Dù dùng cách nào, thành công phụ thuộc <b>prompt engineering</b> tốt (Ch.2)."
    ],
    tip:"Từ khoá phân biệt: chatbot = conversational, fast feedback, flexible; application = API, automated, scalable, customizable."
  }
]},
{ n:2, title:"Prompt Engineering for Effective Software Testing", mins:365, vi:"Prompt engineering cho kiểm thử",
  keywords:["acceptance criteria","test script","test case","test condition","test data","test design","test report","few-shot prompting","meta prompting","natural language processing","one-shot prompting","prompt","prompt chaining","prompt engineering","system prompt","user prompt","zero-shot prompting"],
  sections:[
  { id:"2.1.1", title:"Structure of Prompts (6 components)", lo:"GenAI-2.1.1", k:"K2",
    points:[
      "<b>Role</b>: persona/góc nhìn LLM nhập vai (tester, test manager, automation engineer) → định tone & trách nhiệm.",
      "<b>Context</b>: thông tin nền để xác định test condition – test object, chức năng cần test, bối cảnh liên quan.",
      "<b>Instruction</b>: chỉ thị task cụ thể – rõ ràng, <b>mệnh lệnh, ngắn gọn</b>; gồm mô tả task + yêu cầu.",
      "<b>Input data</b>: dữ liệu cần để làm task – user story, acceptance criteria, screenshot, code, test case có sẵn, ví dụ output.",
      "<b>Constraints</b>: giới hạn/lưu ý đặc biệt; chỉ rõ <b>cách áp dụng instruction lên input data</b>.",
      "<b>Output format</b>: định dạng, cấu trúc, đặc tính kết quả mong đợi.",
      "Cấu trúc này <b>kết hợp với prompting technique</b> (2.1.2) tuỳ task & LLM."
    ],
    tip:"Thuộc lòng 6 thành phần: <b>R-C-I-I-C-O</b> (Role, Context, Instruction, Input data, Constraints, Output format). Thi cho 1 đoạn prompt, hỏi câu đó thuộc thành phần nào."
  },
  { id:"2.1.2", title:"Core Prompting Techniques", lo:"GenAI-2.1.2", k:"K2",
    points:[
      "3 kỹ thuật cốt lõi (Schulhoff 2024) dùng kèm cấu trúc 6 thành phần:",
      "<b>Prompt chaining</b>: chia task thành <b>chuỗi bước trung gian</b> (nhiều prompt); kết quả mỗi bước được <b>kiểm tra (thủ công/tự động) & refine</b> trước bước tiếp. Tăng accuracy; hợp task phức tạp cần decompose; cho phép tương tác động.",
      "<b>Few-shot prompting</b>: đưa <b>ví dụ</b> vào prompt. <b>Zero-shot</b> = 0 ví dụ (dựa kiến thức sẵn có); <b>One-shot</b> = 1 ví dụ; <b>Few-shot</b> = >1 ví dụ. Hợp task có pattern/format cụ thể, đảm bảo kết quả nhất quán.",
      "<b>Meta prompting</b>: tận dụng khả năng LLM <b>tự sinh/refine prompt</b>; tester đánh giá & tinh chỉnh theo vòng lặp. Giảm công sức thiết kế prompt; khi tester không chắc cách viết prompt → <b>co-create / pairing</b> với LLM (giống pair programming, pair testing).",
      "Có thể <b>kết hợp</b> nhiều kỹ thuật cho một use case (2.2.5)."
    ],
    tip:"Dấu hiệu nhận biết: nhiều bước + check giữa chừng = chaining; có ví dụ mẫu = few-shot; nhờ AI viết prompt = meta."
  },
  { id:"2.1.3", title:"System Prompt vs User Prompt", lo:"GenAI-2.1.3", k:"K2",
    points:[
      "<b>System prompt</b>: do <b>developer/tester</b> định nghĩa; định hướng hành vi tổng thể, personality, operational parameters (tone formal, ngắn gọn, luật domain, tránh hành vi nào). Thường <b>ẩn/không sửa được</b> với user. <b>Cố định suốt phiên</b>. Có thể chứa <b>role, context, constraints</b> của structured prompt.",
      "VD system prompt: 'You are a professional software testing assistant. Always respond clearly, use formal language, focus on ISTQB-aligned practices…'",
      "<b>User prompt</b>: input/câu hỏi thực tế của user; <b>thay đổi mỗi lượt</b>; hiển thị trực tiếp; tạo ngữ cảnh tức thời cho mỗi response.",
      "Cách dùng điển hình: set system prompt 1 lần đầu phiên, sau đó gửi các user prompt. LLM trả lời dựa trên <b>cả hai</b>.",
      "System prompt nên rõ về role & constraints; user prompt nên tập trung, có instruction rõ + context + output format."
    ],
    tip:"System = ai set? developer/tester; đổi không? không; thấy không? thường không. User = ngược lại."
  },
  { id:"2.2.1", title:"Test Analysis with GenAI", lo:"GenAI-2.2.1", k:"K3",
    points:[
      "Input: requirements, user stories, technical spec, GUI wireframe. Output: work product của test analysis (vd. <b>prioritized test conditions / acceptance criteria</b>).",
      "<b>Identify potential defects in test basis</b>: inconsistency, ambiguity, thông tin thiếu; so với pattern requirement tương tự/defect report cũ.",
      "<b>Generate test conditions</b> từ requirement/user story: dùng NLP chuyển thành phát biểu đo được, test được.",
      "<b>Prioritize test conditions by risk</b>: dựa risk likelihood & impact, regulatory compliance, user-facing feature (login, payment), historical defect data.",
      "<b>Support coverage analysis</b>: map requirement ↔ test condition để tìm gap.",
      "<b>Suggest test techniques</b>: BVA, equivalence partitioning… theo loại requirement.",
      "<b>Chất lượng input quyết định chất lượng output.</b>"
    ],
    tip:"K3 = áp dụng. Đề cho scenario (user story + mục tiêu) và hỏi prompt/kỹ thuật nào phù hợp. HO-2.2.1b: chain = ambiguity → testability → completeness, có human verification mỗi bước."
  },
  { id:"2.2.2", title:"Test Design & Test Implementation with GenAI", lo:"GenAI-2.2.2", k:"K3",
    points:[
      "Test design = elaborate test conditions → test cases & testware; test implementation = tạo/acquire testware để chạy test (theo CTFL).",
      "<b>Test case generation</b>: draft test case từ functional/non-functional requirement – precondition, input, expected result, coverage criteria.",
      "<b>Test data synthesis</b>: dữ liệu tổng hợp <b>giống production nhưng bảo vệ privacy</b>, bao phủ extreme situation; dùng cho functional & non-functional.",
      "<b>Automated test script generation</b>: từ structured test case → manual procedure hoặc script tương thích framework automation; cập nhật khi requirement đổi.",
      "<b>Test execution scheduling & prioritization</b>: phân tích phụ thuộc giữa test case, tối ưu lịch theo priority, risk, resource, objective.",
      "HO: 2.2.2a chaining + structured + meta (sinh TC → bảng coverage → meta-prompt cho E2E); 2.2.2b few-shot sinh <b>Gherkin</b> (Given-When-Then); 2.2.2c chaining để prioritize test suite có risk & dependency (multi-criteria reasoning, phải verify thủ công)."
    ],
    tip:"Gherkin / format cố định → few-shot. Prioritization nhiều tiêu chí → chaining + kiểm tra reasoning error."
  },
  { id:"2.2.3", title:"Automated Regression Testing with GenAI", lo:"GenAI-2.2.3", k:"K3",
    points:[
      "Regression suite phình to mỗi release → ứng viên automation, đặc biệt trong <b>CI/CD</b>. GenAI hỗ trợ tạo, bảo trì, tối ưu; <b>impact analysis</b> theo thay đổi code.",
      "<b>Keyword-driven automation</b>: LLM map keyword định sẵn ↔ test case, sinh script.",
      "<b>Impact analysis & test optimization</b>: phân tích code change → vùng rủi ro cao → regression có mục tiêu.",
      "<b>Self-healing / adaptive tests</b>: tự điều chỉnh script khi UI/API đổi nhỏ (dynamic locators, endpoint, format request/response, authentication) → suite ổn định.",
      "<b>Automated test reporting & insights</b>: báo cáo kịp thời, dashboard xu hướng, dự đoán điểm fail.",
      "<b>Enhanced defect reporting & RCA</b>: tự tổng hợp defect report với log, screenshot, env data.",
      "<b>Cảnh báo</b>: GenAI có thể sai → output phải được kiểm tra tuỳ mức risk (Ch.3)."
    ],
    tip:"HO-2.2.3a: few-shot cho keyword-driven script + system prompt tạo AI assistant debug. HO-2.2.3b: structured prompt phân tích test report (cluster defect, known anomalies list, cross-check)."
  },
  { id:"2.2.4", title:"Test Monitoring & Test Control with GenAI", lo:"GenAI-2.2.4", k:"K3",
    points:[
      "Test monitoring cần lấy lượng lớn dữ liệu (đôi khi unstructured) từ test management tool → GenAI phân tích & tổng hợp.",
      "<b>Test monitoring & metrics analysis</b>: tự động hoá monitoring, phân tích xu hướng, dự đoán risk, cảnh báo lệch kế hoạch.",
      "<b>Test control</b>: gợi ý reprioritize test, điều chỉnh lịch, phân bổ lại resource.",
      "<b>Test completion insights</b>: sinh test completion report, lessons learned.",
      "<b>Metrics visualization & reporting</b>: dashboard động + tóm tắt ngôn ngữ tự nhiên cho stakeholder."
    ],
    tip:"Monitoring = nhìn & đo; Control = hành động điều chỉnh. Câu hỏi 'reallocate resources' → test control."
  },
  { id:"2.2.5", title:"Choosing Prompting Techniques", lo:"GenAI-2.2.5", k:"K3",
    points:[
      "<b>Prompt chaining</b> → task <b>phức tạp cần precision & human verification mỗi bước</b>: test analysis, test design, test automation – từng bước được kiểm tra đúng chức năng.",
      "<b>Few-shot</b> → task <b>lặp lại hoặc output format cụ thể/ràng buộc</b>: Gherkin scenario, keyword-driven testing, test report theo format.",
      "<b>Meta prompting</b> → task <b>linh hoạt, mới, chưa biết viết prompt</b>: mô tả mục tiêu chung để LLM tạo prompt; test report analysis, anomaly detection.",
      "<b>Kết hợp</b>: meta prompting tạo prompt ban đầu → prompt đó chứa ví dụ cần adapt (few-shot) → chia nhỏ để validate bước trung gian (chaining)."
    ],
    tip:"Đây là LO K3 được hỏi nhiều: đề mô tả task, mày chọn kỹ thuật. Precision+verify = chaining; repetitive/format = few-shot; new/flexible = meta."
  },
  { id:"2.3.1", title:"Metrics for Evaluating GenAI Results", lo:"GenAI-2.3.1", k:"K2",
    points:[
      "<b>Accuracy</b>: độ đúng tổng thể so với expert-written TC / requirement / chuẩn. VD: mức độ TC sinh ra <b>cover tất cả requirement</b>.",
      "<b>Precision</b>: độ đúng so với <b>một mục tiêu cụ thể</b>. VD: TC sinh ra <b>xác định đúng anomaly</b>.",
      "<b>Recall</b>: khả năng tìm <b>tất cả instance liên quan</b>. VD: TC cover <b>valid & invalid equivalence partition</b>.",
      "<b>Relevance & Contextual Fit</b>: output phù hợp ngữ cảnh. VD: TC nhất quán với test basis, tích hợp <b>domain-specific requirement</b>.",
      "<b>Diversity</b>: bao phủ nhiều input/scenario, tránh lặp. VD: TC cover <b>nhiều hành vi user, edge case</b>.",
      "<b>Execution Success Rate</b>: tỉ lệ artefact <b>chạy được ngay (as is)</b> trong môi trường test. VD: bao nhiêu script chạy <b>không lỗi syntax</b>.",
      "<b>Time Efficiency</b>: thời gian tiết kiệm so với làm tay.",
      "Có thể thêm <b>task-specific metrics</b>. Đánh giá thủ công hoặc tự động (so với reference). Vì <b>non-deterministic</b> → metric phải dựa trên <b>dữ liệu đủ ý nghĩa thống kê</b>."
    ],
    tip:"7 metric – thi cho ví dụ hỏi tên metric. Dễ nhầm: Accuracy (tổng thể/all requirements) vs Precision (mục tiêu cụ thể/đúng anomaly) vs Recall (tìm đủ/all partitions)."
  },
  { id:"2.3.2", title:"Evaluating & Iteratively Refining Prompts", lo:"GenAI-2.3.2", k:"K2",
    points:[
      "<b>Iterative prompt modification</b>: từ base prompt, sửa dần theo kết quả thực (thêm context, chỉnh thuật ngữ).",
      "<b>A/B testing of prompts</b>: nhiều phiên bản prompt, so sánh bằng <b>predefined metrics</b> → chọn phrasing/structure tốt nhất.",
      "<b>Output analysis</b>: soi lỗi/inconsistency của output so với test basis → hiểu loại lỗi để sửa prompt.",
      "<b>Integrate user feedback</b>: thu ý kiến tester về usefulness, clarity, mức chi tiết.",
      "<b>Adjust prompt length & specificity</b>: thêm context có khi tốt hơn; có khi prompt ngắn generalize tốt hơn.",
      "Tổ chức <b>prompt evaluation & optimization session</b>; chia sẻ practice, <b>prompt libraries</b> trong team → chuẩn hoá, văn hoá học hỏi."
    ],
    tip:"HO-2.3.2: A/B testing + human verification qua nhiều vòng, đo bằng metric 2.3.1."
  }
]},
{ n:3, title:"Managing Risks of Generative AI in Software Testing", mins:160, vi:"Quản lý rủi ro khi dùng GenAI",
  keywords:["security","vulnerability","data privacy","hallucination","temperature","reasoning error","bias","context manipulation"],
  sections:[
  { id:"3.1.1", title:"Hallucinations, Reasoning Errors and Biases – định nghĩa", lo:"GenAI-3.1.1", k:"K1",
    points:[
      "<b>Hallucination</b>: output <b>sai sự thật hoặc không liên quan</b> task. Trong testing: TC hư cấu/không liên quan, script sai/không chạy, TC verify <b>acceptance criteria không tồn tại</b>.",
      "<b>Reasoning error</b>: LLM <b>hiểu sai cấu trúc logic</b> (nhân-quả, điều kiện, giải quyết từng bước) → kết luận sai. LLM không reasoning thật, chỉ <b>pattern matching</b> (Mirzadeh 2024). VD task dễ lỗi: <b>test planning, test case prioritization</b>, ước lượng effort.",
      "<b>Bias</b>: bắt nguồn từ <b>training data</b> → thiên về loại thông tin/cách tiếp cận nào đó. VD: train chủ yếu tiếng Anh → thiếu góc nhìn phi-Anh ngữ; ảnh hưởng khi sinh test data, refine acceptance criteria.",
      "Nguyên nhân chung: bản chất training data + giới hạn transformer. Non-determinism khiến lỗi 'có vẻ hết' rồi lại xuất hiện."
    ],
    tip:"Hallucination = bịa/sai fact; Reasoning error = logic sai; Bias = lệch do data. Đừng nhầm hallucination với reasoning error khi đề là bài toán prioritization/estimation."
  },
  { id:"3.1.2", title:"Identify Hallucinations, Reasoning Errors, Biases in LLM Output", lo:"GenAI-3.1.2", k:"K3",
    points:[
      "<b>Hallucination detection</b>: <b>Cross-verification</b> (so với documentation, requirement, hành vi hệ thống đã biết – có thể tự động); <b>Domain expertise consultation</b> (SME xác nhận); <b>Consistency checks</b> (output nhất quán với nhau & với thông tin đã biết).",
      "<b>Reasoning error detection</b>: <b>Logical validation</b> (đánh giá luồng logic, coherence qua review; case phức tạp cần người); <b>Output testing</b> (chạy TC/script sinh ra trên test object để xác minh).",
      "<b>Bias detection</b>: review xem testware (code, synthetic data) có <b>đại diện công bằng</b> cho test strategy & coverage requirement; đánh giá bias theo loại test, vd. <b>non-functional test bị thiếu</b> trong output.",
      "Mức độ áp dụng phụ thuộc <b>risk level ước tính</b> của task."
    ],
    tip:"K3: đề cho output LLM, hỏi đây là lỗi gì / dùng cách nào phát hiện. Test data toàn tên Mỹ cho app toàn cầu = bias; TC cho tính năng không có trong story = hallucination; prioritize sai dependency = reasoning error."
  },
  { id:"3.1.3", title:"Mitigation of Hallucinations, Reasoning Errors, Biases", lo:"GenAI-3.1.3", k:"K2",
    points:[
      "Lỗi dễ xảy ra khi prompt thiết kế kém (Ch.2) hoặc <b>thiếu contextual input data</b>.",
      "<b>Provide complete context</b>: prompt đủ thông tin (6 thành phần).",
      "<b>Divide prompts into manageable segments</b>: prompt chaining, verify từng output → phát hiện reasoning error sớm.",
      "<b>Use clear, interpretable data formats</b>: tránh format mơ hồ.",
      "<b>Select the appropriate GenAI model</b>: LLM được train cho task đó (5.1.3).",
      "<b>Compare results across models</b>: chạy prompt trên nhiều LLM, so sánh.",
      "Ch.4 bổ sung 2 kỹ thuật: <b>RAG</b> và <b>Fine-tuning</b>."
    ],
    tip:"5 mitigation: Context đủ – Chia nhỏ – Format rõ – Chọn model đúng – So sánh nhiều model."
  },
  { id:"3.1.4", title:"Mitigation of Non-Deterministic Behavior", lo:"GenAI-3.1.4", k:"K1",
    points:[
      "Non-determinism do <b>probabilistic sampling</b> khi inference; output dài → variability càng cao. Không thể reproducibility 100%.",
      "<b>Lower temperature</b>: thu hẹp phân phối xác suất → ít ngẫu nhiên, output nhất quán hơn; <b>đánh đổi</b>: giảm creativity/diversity, output lặp hoặc quá deterministic.",
      "<b>Set random seed</b>: cùng chuỗi pseudo-random → cải thiện reproducibility (nếu implementation hỗ trợ).",
      "Kết hợp <b>tự động hoá một phần output verification</b> để đánh giá có cấu trúc, nhất quán."
    ],
    tip:"2 cách: temperature ↓ và seed. Nhớ trade-off của temperature thấp."
  },
  { id:"3.2.1", title:"Data Privacy & Security Risks", lo:"GenAI-3.2.1", k:"K2",
    points:[
      "GenAI xử lý nhiều dữ liệu có thể chứa thông tin nhạy cảm/PII.",
      "<b>Unintentional data exposure</b>: output vô tình lộ thông tin nhạy cảm.",
      "<b>Lack of control over data usage</b>: tool lưu/xử lý dữ liệu không có consent/kiểm soát → misuse, truy cập trái phép.",
      "<b>Compliance risks</b>: vi phạm quy định bảo vệ dữ liệu như <b>GDPR (EU 2016/679)</b> → tranh chấp pháp lý.",
      "Security risk riêng: LLM-powered test infrastructure dễ bị tấn công (data breach, unauthorized access); kẻ xấu khai thác lỗ hổng (manipulative attacks) để đổi hành vi/trích xuất thông tin; <b>malicious input data</b> làm sai lệch LLM."
    ],
    tip:"3 privacy concern: Exposure – Lack of control – Compliance (GDPR)."
  },
  { id:"3.2.2", title:"Attack Vectors in GenAI Test Processes & Tools", lo:"GenAI-3.2.2", k:"K2",
    points:[
      "<b>Context manipulation</b>: request thiết kế để <b>trích xuất training data bí mật</b>. VD: prompt dài <b>vượt context window</b> để 'overload' bộ nhớ → lộ snippet training data.",
      "<b>Request manipulation</b>: đưa dữ liệu <b>phá output</b>. VD: ảnh 'dụ' AI sang ngữ cảnh khác → hallucination về acceptance criteria.",
      "<b>Data poisoning</b>: <b>thao túng training data</b>. VD: đưa đánh giá giả khi rating kết quả test report AI sinh ra.",
      "<b>Malicious code generation</b>: thao túng LLM sinh <b>backdoor</b> (external command call). VD: code mở kênh liên lạc tới IP độc hại."
    ],
    tip:"4 attack vector + ví dụ – thi cho ví dụ hỏi tên vector. 'Vượt context window' = context manipulation; 'fake rating' = data poisoning."
  },
  { id:"3.2.3", title:"Mitigation Strategies – Privacy & Security", lo:"GenAI-3.2.3", k:"K2",
    points:[
      "GDPR không cấm GenAI nhưng đặt safeguard về <b>lawfulness, purpose limitation</b> khi thu thập/xử lý/lưu dữ liệu.",
      "Biện pháp bảo vệ dữ liệu: <b>Data minimization</b> (chỉ dùng lượng dữ liệu không nhạy cảm cần thiết); <b>Anonymization & pseudonymization</b> (mask/thay thế); <b>Secure storage & transmission</b> (encryption, access control); <b>Resources training</b> (chương trình đào tạo & policy dùng GenAI có trách nhiệm).",
      "Biện pháp bổ sung: <b>Systematic review of generated output</b> (human evaluation); <b>Evaluation by comparison with another LLM</b>; <b>Choice of secure operational environment</b> (commercial secure offering / secure cloud / on-premise tuỳ mức bảo mật); <b>Regular security audits & vulnerability assessments</b>; <b>Stay updated</b> với security best practice.",
      "Nên có <b>Security Engineer, Legal counsel, CTO, CISO</b> tham gia. Các biện pháp bổ trợ nhau – cần kết hợp."
    ],
    tip:"Nhớ 3 lựa chọn môi trường theo mức bảo mật tăng dần: commercial secure offering → secure cloud → in-house infrastructure."
  },
  { id:"3.3.1", title:"Energy Consumption & CO₂ Emissions", lo:"GenAI-3.3.1", k:"K2",
    points:[
      "Train & chạy LLM cần nhiều tài nguyên tính toán chuyên dụng (Luccioni 2024a); LLM dạng web service tăng tải lên thiết bị, mạng, data center.",
      "Năng lượng phụ thuộc <b>độ phức tạp task</b> và <b>tài nguyên tính toán</b> cần. VD: <b>sinh 1 ảnh ≈ sạc đầy 1 smartphone</b>; sinh text chỉ tốn vài % pin (Heikkilä 2023).",
      "Khó đo chính xác (Luccioni 2024b) nhưng tích luỹ hàng triệu user → CO₂ đáng kể (Berthelot 2024).",
      "Best practice: <b>hạn chế tương tác model không cần thiết</b>; chọn model <b>right-sized</b> (5.2.1)."
    ],
    tip:"HO-3.3.1 dùng simulator tính năng lượng/CO₂. Nhớ so sánh ảnh vs text."
  },
  { id:"3.4.1", title:"AI Regulations, Standards & Frameworks", lo:"GenAI-3.4.1", k:"K1",
    points:[
      "<b>ISO/IEC 42001:2023</b> – <b>Standard</b> – AI <b>Management System</b>: yêu cầu quản lý hệ thống AI trong tổ chức → GenAI trong testing theo practice khuyến nghị, nhất quán, tin cậy.",
      "<b>ISO/IEC 23053:2022</b> – <b>Standard</b> – <b>Framework for AI Systems Using ML</b>: quy trình vòng đời AI, nhấn mạnh safety & transparency → khung cho data quality, transparency, safety.",
      "<b>EU AI Act</b> – <b>Regulation</b> (luật): khung pháp lý, <b>phân loại ứng dụng theo mức rủi ro</b> → bắt buộc transparency, accountability, bias mitigation.",
      "<b>NIST AI Risk Management Framework (US)</b> – <b>Framework</b>: hướng dẫn quản lý rủi ro AI – fairness, transparency, security → ngăn kết quả test thiên lệch.",
      "Phải cập nhật liên tục vì regulation/standard thay đổi."
    ],
    tip:"Nhớ loại: 42001 & 23053 = Standard; EU AI Act = Regulation; NIST = Framework. 42001 = management system; 23053 = ML lifecycle framework."
  }
]},
{ n:4, title:"LLM-Powered Test Infrastructure for Software Testing", mins:110, vi:"Hạ tầng kiểm thử dùng LLM",
  keywords:["test infrastructure","fine-tuning","LLM-powered agent","Large Language Model Operations","retrieval-augmented generation","vector database"],
  sections:[
  { id:"4.1.1", title:"Key Architectural Components", lo:"GenAI-4.1.1", k:"K2",
    points:[
      "LLM-powered test infrastructure = hệ thống tích hợp LLM vào test process để tăng automation, reasoning, decision-making. Khác chatbot (hội thoại), test tool xử lý query test, phân tích requirement, sinh TC, đánh giá output.",
      "Kiến trúc đa thành phần: <b>Front-end</b> (UI tester nhập query); <b>Back-end</b> (xử lý input, <b>authentication, data retrieval, prompt preparation</b>, giao tiếp LLM); <b>LLM</b> (dịch vụ bên thứ 3 qua API hoặc model in-house); <b>External data sources</b>.",
      "Vượt client-server truyền thống: (1) LLM là <b>smart processing component</b> diễn giải & suy luận trên testware; (2) sinh insight <b>động từ context</b> (khác rule-based chatbot script sẵn); (3) back-end tích hợp nhiều nguồn: <b>Relational DB</b> (structured: test case) & <b>Vector DB</b> (semantic retrieval bằng embedding); (4) back-end <b>post-processing</b> output LLM cho khớp test condition trước khi đưa ra front-end."
    ],
    tip:"Hỏi 'thành phần nào chuẩn bị prompt & xác thực?' → back-end. 'Lưu embedding để tìm theo ngữ nghĩa?' → vector database."
  },
  { id:"4.1.2", title:"Retrieval-Augmented Generation (RAG)", lo:"GenAI-4.1.2", k:"K2",
    points:[
      "RAG bổ sung nguồn dữ liệu ngoài vào quá trình sinh response (Zhao 2024) → tăng relevance & accuracy; response được <b>grounded</b> vào dữ liệu truy xuất.",
      "<b>Preprocessing</b>: chia tài liệu lớn thành <b>chunk (~256–512 token)</b> → clean, xử lý → encode thành <b>embedding</b> bằng pre-trained model → lưu <b>vector database</b>.",
      "<b>Runtime (2 bước)</b>: (1) <b>Retrieval</b>: encode query, truy xuất chunk liên quan theo <b>semantic similarity</b> giữa embedding của prompt và chunk; (2) <b>Generation</b>: đưa chunk vào LLM → response kết hợp kiến thức sẵn có + dữ liệu mới.",
      "Trong testing: truy cập dữ liệu doanh nghiệp (DB, documentation, repository) <b>real time</b> → test analysis/design khớp với <b>spec/requirement/test data mới nhất</b>."
    ],
    tip:"Thứ tự: chunk → embed → vector DB → (query) retrieve → generate. HO-4.1.2 so sánh output có/không RAG."
  },
  { id:"4.1.3", title:"LLM-Powered Agents in Automating Test Processes", lo:"GenAI-4.1.3", k:"K2",
    points:[
      "Agent (Wang 2024) = ứng dụng GenAI chuyên biệt, xử lý <b>bán tự động/tự động</b> task định sẵn; dựa LLM để hiểu & sinh ngôn ngữ + xử lý instruction, retrieve context, <b>hành động</b>.",
      "Khác chatbot: agent <b>'act'</b> bằng cách gọi tập function định sẵn = <b>'tools'</b> → tương tác/điều khiển hệ thống ngoài.",
      "Mức tự chủ: <b>Autonomous</b> (độc lập, can thiệp tối thiểu; rule định sẵn, RL, adaptive feedback loop) vs <b>Semi-autonomous</b> (có <b>giám sát định kỳ của người</b>).",
      "<b>Multi-agent</b>: nhiều agent vai trò chuyên biệt phối hợp = <b>orchestration</b>.",
      "Trong tool hiện đại: AI assistant tích hợp workflow, biến user story → test artefact qua analysis, design, implementation, execution, reporting → chuyển từ <b>script-based</b> sang <b>goal-driven, agent-based</b> automation.",
      "Vẫn mắc hallucination/reasoning error/bias → mitigate bằng <b>automated verification</b> kết quả agent hoặc dùng <b>semi-autonomous agent cho task critical</b>."
    ],
    tip:"Task critical → semi-autonomous (có người giám sát). 'Nhiều agent phối hợp' = orchestration."
  },
  { id:"4.2.1", title:"Fine-Tuning LLMs for Test Tasks", lo:"GenAI-4.2.1", k:"K2",
    points:[
      "Fine-tuning = <b>train thêm</b> pre-trained LM (LLM/SLM) trên <b>targeted dataset</b> → học kiến thức/sắc thái domain → chính xác & phù hợp use case hơn (Parthasarathy 2024).",
      "Hợp để trang bị <b>reasoning chuyên biệt</b> hoặc <b>vocabulary riêng</b> của domain. Fine-tune <b>SLM</b> → hiệu năng cao cho task cụ thể mà <b>ít tốn tài nguyên</b> hơn LLM.",
      "VD testing: train trên user story + test case của tổ chức → sinh TC theo <b>format & terminology riêng</b> của tổ chức.",
      "Thách thức: (1) dataset chất lượng cao, task-specific để tránh <b>bias/inaccurate</b>; (2) <b>Overfitting</b> (quá khớp training data → kém trên data mới); (3) <b>Opacity</b> (thiếu minh bạch cách model ra quyết định → khó debug/validate); (4) <b>Tài nguyên tính toán</b> lớn (với LLM)."
    ],
    tip:"Glossary: fine-tuning là supervised learning với labeled examples cập nhật weights. 4 thách thức: Data – Overfitting – Opacity – Compute."
  },
  { id:"4.2.2", title:"LLMOps", lo:"GenAI-4.2.2", k:"K2",
    points:[
      "<b>LLMOps</b> = tập practice, tool, process để streamline <b>development, deployment, maintenance</b> của LLM trong production (Sinha 2024).",
      "3 cách đưa GenAI vào test process (ảnh hưởng quyết định LLMOps): (1) <b>AI chatbot</b>: cân nhắc privacy/security & chi phí; LLM-as-a-Service nếu có đảm bảo, hoặc in-house với open-source LLM; (2) <b>Test tool có GenAI</b>: tương tự + đánh giá đảm bảo của <b>vendor</b>; cần cost-benefit & risk assessment; (3) <b>In-house development</b>: kiểm soát toàn diện privacy/security; hoạch định compute, storage, staff training; cần quy trình validate/maintain; đòi hỏi expertise.",
      "3 cách <b>không loại trừ nhau</b> – có thể dùng đồng thời cho task khác nhau; có thể thêm RAG, fine-tuning."
    ],
    tip:"In-house = kiểm soát nhiều nhất nhưng tốn expertise/tài nguyên nhất."
  }
]},
{ n:5, title:"Deploying and Integrating Generative AI in Test Organizations", mins:80, vi:"Triển khai GenAI trong tổ chức test",
  keywords:["shadow AI"],
  sections:[
  { id:"5.1.1", title:"Risks of Shadow AI", lo:"GenAI-5.1.1", k:"K1",
    points:[
      "<b>Shadow AI</b> = dùng GenAI tool trong tổ chức <b>không có phê duyệt/giám sát chính thức</b>.",
      "<b>Information security & data privacy weaknesses</b>: tool cá nhân thiếu bảo mật → data breach.",
      "<b>Compliance & regulatory issues</b>: tool chưa duyệt → không tuân thủ standard/regulation → hậu quả pháp lý.",
      "<b>Vague intellectual property</b>: license không rõ → tranh chấp IP, nhất là khi xử lý dữ liệu có bản quyền.",
      "Có strategy & bước triển khai GenAI giúp tránh shadow AI."
    ],
    tip:"3 risk: Security/Privacy – Compliance – IP."
  },
  { id:"5.1.2", title:"Key Aspects of a GenAI Strategy", lo:"GenAI-5.1.2", k:"K2",
    points:[
      "Định nghĩa <b>test objective đo được</b> cho GenAI: tăng productivity, rút ngắn test cycle, cải thiện chất lượng.",
      "<b>Chọn LLM đúng</b> (5.1.3), khớp objective, tương thích hạ tầng, scalability.",
      "<b>Data quality</b>: input chính xác, liên quan, được bảo vệ → kết quả tin được.",
      "<b>Training program</b> toàn diện (kỹ năng kỹ thuật + đạo đức); thu thập <b>metrics</b> đo hiệu quả (2.3.1).",
      "<b>Process guidelines</b>: luật dùng dữ liệu nhạy cảm, <b>transparency obligations</b> (cái gì do GenAI sinh), <b>quality gates</b> review testware sinh ra → tuân thủ regulation & đạo đức."
    ],
    tip:"Strategy = Objectives – Model – Data – Training & Metrics – Process guidelines."
  },
  { id:"5.1.3", title:"Selecting LLMs/SLMs for Test Tasks", lo:"GenAI-5.1.3", k:"K2",
    points:[
      "LLM/SLM khác nhau về functional capability (multimodal, reasoning), technical feature (context window), licensing (commercial vs open source). Ít benchmark chuyên cho test task (Wenhan 2024 – TESTEVAL).",
      "4 tiêu chí: <b>Model performance</b> (đo trên benchmark của tổ chức với metric 2.3.1); <b>Fine-tuning potential</b> (có thể/nên fine-tune với data domain không); <b>Recurring cost</b> (license + vận hành, vừa ngân sách); <b>Community & support</b> (cộng đồng tích cực, tài liệu tốt).",
      "HO-5.1.3: ước lượng recurring cost theo <b>số token input/output, prompt, tần suất task</b>; so sánh pricing ≥1 commercial & ≥1 open source."
    ],
    tip:"4 tiêu chí: Performance – Fine-tuning potential – Cost – Community/support."
  },
  { id:"5.1.4", title:"Phases when Adopting GenAI", lo:"GenAI-5.1.4", k:"K1",
    points:[
      "<b>1. Discovery</b>: awareness & capability building – training khái niệm GenAI, cấp quyền dùng LLM/SLM, thử use case ban đầu, xây confidence.",
      "<b>2. Initiation and usage definition</b>: xác định & ưu tiên use case thực tế; đánh giá LLM-powered test infrastructure; phát triển expertise; align với nhu cầu tổ chức.",
      "<b>3. Utilization and iteration</b>: tích hợp đầy đủ vào test process; monitoring liên tục; đo lường & quản lý transformation để bền vững, scale.",
      "Các phase có thể <b>chạy song song cho use case khác nhau</b> (vd. test report analysis đi trước, test automation còn sớm). Phải xử lý sớm lo ngại như <b>sợ mất việc</b>."
    ],
    tip:"D-I-U: Discovery → Initiation → Utilization. Không tuần tự cứng – song song theo use case."
  },
  { id:"5.2.1", title:"Essential Skills & Knowledge", lo:"GenAI-5.2.1", k:"K2",
    points:[
      "Thành thạo <b>prompt engineering</b>, hiểu <b>context window</b>, phát triển <b>test review methods</b>; kết hợp domain + test expertise với AI skills.",
      "Năng lực: đánh giá khả năng LLM, kỹ thuật refine prompt, <b>evaluation of AI-generated testware</b>; hiểu rủi ro & mitigation.",
      "Bảo mật: hiểu hệ quả khi chia sẻ testware với LLM; <b>data sanitization</b> (xoá/mask thông tin nhạy cảm, cá nhân, mật); prompt engineering bảo vệ privacy.",
      "Môi trường: tối ưu lựa chọn & cách dùng model, <b>right-sized model</b>, cân bằng lợi ích automation với chi phí & năng lượng."
    ],
    tip:"Skills = Prompting + Review/Evaluate + Risk awareness + Data sanitization + Environmental awareness."
  },
  { id:"5.2.2", title:"Building GenAI Capabilities in Test Teams", lo:"GenAI-5.2.2", k:"K1",
    points:[
      "<b>Hands-on approach</b>: thực hành nhiều LLM/SLM, <b>structured learning paths</b>, chia sẻ know-how nội bộ; guided exercises, peer learning, tích hợp dần vào công việc hàng ngày.",
      "Tiến từ prompt cơ bản → kỹ thuật tập trung (test-specific prompts). <b>Prompt pattern</b> = <b>template tái sử dụng</b> để viết prompt hiệu quả, output nhất quán.",
      "<b>Internal communities of practice</b>: họp định kỳ chia sẻ ứng dụng thành công, thách thức, best practice; chia sẻ <b>prompt pattern libraries</b>, lessons learned."
    ],
    tip:"Từ khoá: hands-on, learning paths, communities of practice, prompt pattern libraries."
  },
  { id:"5.2.3", title:"Evolving Test Processes & Responsibilities", lo:"GenAI-5.2.3", k:"K1",
    points:[
      "<b>Testers</b>: từ chuyên gia test design/execution → <b>AI-assisted test specialist</b>: kết hợp test technique với kỹ năng <b>hướng dẫn & verify</b> testware do AI sinh; thêm task: review output AI, <b>prompt refinement</b>, bảo trì <b>test-specific prompt libraries</b>.",
      "<b>Test managers</b>: thêm <b>AI-based test strategy</b>, <b>AI-based risk management</b>, monitoring & control AI-based test process; cân bằng người–AI; <b>AI governance framework</b>; đảm bảo team giữ cả năng lực test truyền thống + <b>AI literacy</b>; điều phối <b>hybrid team</b> người + GenAI agent."
    ],
    tip:"Tester = verify & refine prompt; Test manager = strategy, governance, hybrid teams."
  }
]}
];

const GLOSSARY = [
["AI chatbot","A conversational agent that uses LLMs to process queries and generate human-like text responses.","Tác nhân hội thoại dùng LLM để trả lời người dùng."],
["Context window","The span of text, measured in tokens, that a language model considers when generating responses.","Lượng text (token) model xét khi sinh output."],
["Deep learning","ML using neural networks with multiple layers.","ML dùng mạng nơ-ron nhiều lớp."],
["Embedding","A technique to represent tokens as dense vectors in a continuous space, capturing semantic, syntactic and contextual relationships.","Biểu diễn token thành vector dày đặc, mã hoá quan hệ ngữ nghĩa."],
["Feature","An individual measurable attribute of the input data used for training by an ML algorithm and for prediction by an ML model.","Thuộc tính đo được của input dùng để train/dự đoán."],
["Few-shot prompting","A technique where a model is given a few examples within the prompt to guide it in generating appropriate responses.","Đưa vài ví dụ vào prompt để định hướng output."],
["Fine-tuning","A supervised learning process using a dataset of labeled examples to update LLM weights and adapt them for specific tasks or domains.","Train thêm có giám sát để cập nhật trọng số LLM cho task/domain cụ thể."],
["Foundation LLM","General-purpose models pre-trained on a wide range of text data, capable of predicting the next word. Synonym: Base LLM.","Model đa dụng pre-train trên dữ liệu rộng (= Base LLM)."],
["Generative AI (GenAI)","An AI system that uses ML models to generate (new) intellectual content that resembles human-created content.","AI tạo nội dung mới giống người làm."],
["Generative pre-trained transformer (GPT)","A transformer-based deep learning model pre-trained on vast amounts of text data to understand and generate human-like text.","Model transformer pre-train trên text khổng lồ."],
["Hallucination","Wrong information created by an LLM.","Thông tin sai do LLM tạo ra."],
["Instruction-tuned LLM","A foundation LLM trained to follow instructions, often reinforced by feedback to encourage correct answers.","Foundation LLM được train để làm theo chỉ dẫn."],
["Large language model (LLM)","A computer program that uses very large collections of language data to understand and produce text in a way similar to humans.","Chương trình dùng dữ liệu ngôn ngữ rất lớn để hiểu & sinh text."],
["LLM-powered agent","An application that integrates LLM reasoning, decision-making, and memory, using tools to perform tasks.","Ứng dụng kết hợp reasoning, quyết định, bộ nhớ của LLM và dùng tool để hành động."],
["LLMOps","Practices and tools focused on deploying, monitoring, and maintaining LLMs in production environments.","Practice & tool để deploy, monitor, bảo trì LLM trong production."],
["Machine learning (ML)","The process using computational techniques to enable systems to learn from data or experience (ISO/IEC TR 29119-11).","Hệ thống học từ dữ liệu/kinh nghiệm."],
["Meta prompting","The crafting of higher-level instructions that generate specific prompts for exploring or automating capabilities.","Viết chỉ dẫn cấp cao để LLM tự sinh prompt cụ thể."],
["Multimodal model","GenAI models capable of processing and generating content across multiple data types, such as text, images, and audio.","Model xử lý/sinh nhiều loại dữ liệu (text, ảnh, audio)."],
["Natural language processing (NLP)","The processing of data encoded in natural language by computers to retrieve information and for knowledge representation.","Máy tính xử lý dữ liệu ngôn ngữ tự nhiên."],
["One-shot prompting","A prompt writing technique where the prompt contains one example to guide the LLM's response.","Prompt chứa đúng 1 ví dụ."],
["Prompt","A natural language input provided to elicit a specific response in GenAI and LLMs.","Input ngôn ngữ tự nhiên để lấy response."],
["Prompt chaining","A prompting technique that involves using the output of one prompt as the input for another, creating a sequence of prompts.","Dùng output của prompt này làm input prompt kế → chuỗi prompt."],
["Prompt engineering","The process of designing and refining input prompts to guide LLMs toward producing desired outputs.","Thiết kế & tinh chỉnh prompt để có output mong muốn."],
["Reasoning LLM","An LLM building upon instruction-tuned models by refining their ability to emulate human-like reasoning processes.","LLM mở rộng instruction-tuned, mô phỏng suy luận giống người."],
["Retrieval-augmented generation (RAG)","A technique combining LLM capabilities with a retriever to fetch relevant data for generating accurate, contextually relevant responses.","Kết hợp LLM với retriever lấy dữ liệu liên quan để sinh response chính xác."],
["Shadow AI","The use of GenAI tools or systems within an organization without formal approval or oversight.","Dùng GenAI trong tổ chức không được phê duyệt/giám sát."],
["Small language model (SLM)","Language models intentionally designed and trained to be small, balancing efficiency and task-specific language understanding.","Model nhỏ, cân bằng hiệu quả & hiểu ngôn ngữ cho task cụ thể."],
["Symbolic AI","An AI approach that uses symbols, rules, and structured knowledge to model reasoning.","AI dùng ký hiệu, luật, tri thức có cấu trúc."],
["System prompt","A predefined instruction set, typically hidden from users, that establishes context, tone, and boundaries for an LLM's responses throughout interactions.","Tập chỉ dẫn định sẵn, thường ẩn, định khung context/tone/giới hạn suốt phiên."],
["Temperature","A parameter that controls the randomness or creativity of an LLM's outputs.","Tham số điều khiển độ ngẫu nhiên/sáng tạo của output."],
["Tokenization","The process of breaking down text into smaller units for processing by language models.","Chia text thành đơn vị nhỏ (token)."],
["Transformer","A deep learning model architecture that utilizes self-attention mechanisms to capture long-range dependencies in input sequences.","Kiến trúc DL dùng self-attention bắt phụ thuộc xa trong chuỗi."],
["User prompt","An instruction or query entered by a user into an LLM that directs the model's response to fulfil specific tasks.","Chỉ dẫn/câu hỏi user nhập vào LLM."],
["Vector database","A database optimized for storing and querying high-dimensional vector representations of data.","CSDL tối ưu lưu & truy vấn vector nhiều chiều."],
["Vision-language model","A GenAI system that jointly processes visual and textual data to perform tasks by linking and generating content across both modalities.","Hệ GenAI xử lý đồng thời ảnh & text."],
["Zero-shot prompting","A prompt writing technique where the prompt contains no examples, relying on the model's pre-existing knowledge.","Prompt không có ví dụ, dựa kiến thức sẵn có của model."],
["Reasoning error","When an LLM misinterprets logical structures (cause-effect, conditional logic, step-by-step problem solving), leading to incorrect conclusions.","LLM hiểu sai cấu trúc logic → kết luận sai."],
["Bias (LLM)","Systematic tendency originating from training data that leads outputs to favor certain information, approaches or assumptions.","Thiên lệch bắt nguồn từ training data."],
["Context manipulation","Sending requests designed to extract confidential training data, e.g. exceeding the context window with long prompts.","Request thiết kế để trích xuất training data bí mật (vd. vượt context window)."],
["Data poisoning","Manipulating training data, e.g. providing fake evaluations when rating AI-generated results.","Thao túng training data (vd. đánh giá giả)."],
["Prompt pattern","A reusable template for crafting effective prompts to guide GenAI toward consistent and reliable outputs.","Template tái sử dụng để viết prompt hiệu quả."],
["Orchestration","Coordinated effort among multiple LLM-powered agents, each with specialized roles, to solve complex problems.","Phối hợp nhiều agent vai trò chuyên biệt."]
];

// ch, lo, k, q, opts, a(index), why (vi)
const QUIZ = [
{ch:1,lo:"1.1.1",k:"K1",q:"Which type of AI represents knowledge using symbols and logical rules to mimic human decision-making?",o:["Symbolic AI","Classical machine learning","Deep learning","Generative AI"],a:0,w:"Symbolic AI = rule-based, dùng symbols + logical rules. ML là data-driven; DL dùng neural network; GenAI tạo nội dung mới."},
{ch:1,lo:"1.1.1",k:"K1",q:"Which approach requires data preparation, feature selection and model training, and can be used for defect categorization?",o:["Symbolic AI","Classical machine learning","Generative AI","Vision-language model"],a:1,w:"Classical ML là data-driven với 3 bước: data preparation, feature selection, model training; ứng dụng: phân loại defect, dự đoán lỗi."},
{ch:1,lo:"1.1.1",k:"K1",q:"According to the syllabus, what is the KEY advantage of using GenAI for software testing compared to other AI types?",o:["It never produces incorrect output","It uses pre-trained models that can be applied directly to test tasks without an additional training phase","It requires manual feature definition for every task","It is fully deterministic"],a:1,w:"Lợi thế chính: pre-trained model dùng thẳng, không cần training phase riêng – nhưng đi kèm rủi ro (Ch.3)."},
{ch:1,lo:"1.1.2",k:"K2",q:"In an LLM, what is the purpose of embeddings?",o:["To break text into smaller units","To represent tokens as numerical vectors that capture semantic and contextual relationships","To limit the amount of text the model considers","To set the randomness of the output"],a:1,w:"Embedding = vector số của token; token nghĩa giống nhau nằm gần nhau. Chia text = tokenization; giới hạn text = context window; randomness = temperature."},
{ch:1,lo:"1.1.2",k:"K2",q:"A tester notices that the same prompt gives different test cases each time. What is the PRIMARY reason given in the syllabus?",o:["The context window is too small","The probabilistic nature of the inference mechanism and hyperparameter settings","The model was fine-tuned incorrectly","The prompt lacked a role component"],a:1,w:"Non-deterministic behavior do bản chất xác suất của inference + hyperparameter settings (vd. temperature)."},
{ch:1,lo:"1.1.2",k:"K2",q:"What is a trade-off of using a larger context window when analyzing large test logs?",o:["Lower accuracy of embeddings","Increased computational complexity and processing time","The model can no longer tokenize input","Reduced ability to maintain coherence"],a:1,w:"Context window lớn → giữ mạch lạc tốt hơn nhưng tăng độ phức tạp tính toán & thời gian xử lý."},
{ch:1,lo:"1.1.2",k:"K2",q:"Which statement about LLM output is emphasized by the syllabus?",o:["Output is always correct if the prompt is well-structured","Output is statistically plausible, but plausible is not necessarily correct","Output is deterministic at any temperature","Output never depends on training data"],a:1,w:"Transformer sinh text 'statistically plausible' dựa trên training data và prompt – nhưng plausible ≠ correct."},
{ch:1,lo:"1.1.3",k:"K2",q:"Which type of LLM is fine-tuned using datasets that pair prompts with expected responses to improve instruction following?",o:["Foundation LLM","Instruction-tuned LLM","Reasoning LLM","Small language model"],a:1,w:"Instruction-tuned LLM = foundation + fine-tune trên cặp prompt–response; tối ưu task adherence, instruction following."},
{ch:1,lo:"1.1.3",k:"K2",q:"A test manager needs an LLM for multi-step test case prioritization with many interdependent constraints. Which LLM category is BEST suited?",o:["Foundation LLM","Instruction-tuned (non-reasoning) LLM","Reasoning LLM","Vision-language model"],a:2,w:"Reasoning LLM nhấn mạnh logical inference, multi-step problem solving, chain-of-thought → hợp task high-cognitive-load."},
{ch:1,lo:"1.1.4",k:"K2",q:"How can an LLM augmented with a vision-language model support software testing?",o:["By executing test scripts on a physical device","By identifying discrepancies between expected results and actual visual elements on a screenshot","By replacing the need for test data","By guaranteeing deterministic output"],a:1,w:"VLM phân tích screenshot/wireframe + mô tả text → phát hiện khác biệt expected vs actual, sinh TC giàu visual cue."},
{ch:1,lo:"1.1.4",k:"K2",q:"How is tokenization handled in multimodal LLMs?",o:["Only text is tokenized; other modalities are ignored","Tokenization is adapted per data type, e.g. images are converted to embeddings via vision-language models","All modalities are converted to text first","Tokenization is not used in multimodal models"],a:1,w:"Multimodal adapt tokenization cho từng modality – ảnh được chuyển thành embedding qua VLM trước khi vào transformer."},
{ch:1,lo:"1.2.1",k:"K2",q:"Which of the following is NOT listed as a key LLM capability for test tasks?",o:["Test oracle generation","Test data generation","Physically executing hardware-in-the-loop tests","Requirements analysis and improvement"],a:2,w:"7 capability: requirements analysis, test case creation, test oracle, test data, test automation support, test result analysis, testware creation."},
{ch:1,lo:"1.2.1",k:"K2",q:"'LLMs can help generate expected results.' Which capability does this describe?",o:["Test oracle generation","Test data generation","Testware creation","Test result analysis"],a:0,w:"Test oracle = nguồn expected result. Sinh expected results = test oracle generation."},
{ch:1,lo:"1.2.2",k:"K2",q:"Which statement BEST compares AI chatbots and LLM-powered testing applications?",o:["Chatbots integrate via API for automated tasks; applications are conversational","Chatbots give conversational, fast feedback; applications integrate via API for well-defined, automated, scalable tasks","Both require no prompt engineering","Applications cannot be embedded in existing test frameworks"],a:1,w:"Chatbot = hội thoại, phản hồi nhanh, exploratory, onboarding; Application = API, well-defined, automated, customization & scalability."},
{ch:1,lo:"1.2.2",k:"K2",q:"For which scenario is an AI chatbot particularly effective according to the syllabus?",o:["Large-scale automated test data synthesis in a CI/CD pipeline","Onboarding new testers and clarifying test concepts quickly","Building autonomous AI agents","Hosting an in-house LLM"],a:1,w:"Chatbot hợp routine task, exploratory testing, onboarding tester mới, làm rõ khái niệm, fast feedback."},
{ch:2,lo:"2.1.1",k:"K2",q:"Which are the six components of a structured prompt for software testing?",o:["Role, Context, Instruction, Input data, Constraints, Output format","Persona, Goal, Steps, Examples, Tone, Length","Role, Task, Data, Format, Model, Temperature","Context, Chain, Shot, Meta, Review, Output"],a:0,w:"R-C-I-I-C-O: Role, Context, Instruction, Input data, Constraints, Output format."},
{ch:2,lo:"2.1.1",k:"K2",q:"In a prompt, the sentence 'Return the results as a table with columns ID, Steps, Expected Result' belongs to which component?",o:["Constraints","Instruction","Output format","Context"],a:2,w:"Định dạng/cấu trúc kết quả = Output format."},
{ch:2,lo:"2.1.1",k:"K2",q:"'Only consider the login functionality and do not generate performance tests.' Which prompt component is this?",o:["Role","Constraints","Input data","Output format"],a:1,w:"Giới hạn/lưu ý đặc biệt về cách áp dụng instruction = Constraints."},
{ch:2,lo:"2.1.1",k:"K2",q:"'You are an experienced test automation engineer.' Which component is this?",o:["Role","Context","Instruction","Constraints"],a:0,w:"Persona LLM nhập vai = Role."},
{ch:2,lo:"2.1.2",k:"K2",q:"A tester breaks a task into several prompts and checks each intermediate output before sending the next. Which technique is this?",o:["Few-shot prompting","Meta prompting","Prompt chaining","Zero-shot prompting"],a:2,w:"Prompt chaining: chia task thành bước trung gian, verify & refine mỗi output trước bước kế."},
{ch:2,lo:"2.1.2",k:"K2",q:"What distinguishes one-shot from few-shot prompting?",o:["One-shot uses the system prompt; few-shot uses the user prompt","One-shot provides exactly one example; few-shot provides more than one","One-shot has no examples; few-shot has one","There is no difference"],a:1,w:"Zero-shot = 0 ví dụ; one-shot = 1; few-shot = nhiều hơn 1."},
{ch:2,lo:"2.1.2",k:"K2",q:"A tester is unsure how to write an effective prompt and asks the LLM to generate and refine a prompt for the task. Which technique is this?",o:["Prompt chaining","Meta prompting","Few-shot prompting","Output analysis"],a:1,w:"Meta prompting: LLM tự sinh/refine prompt; tester co-create = 'pairing' với AI."},
{ch:2,lo:"2.1.3",k:"K2",q:"Which statement about system prompts is CORRECT?",o:["It changes with each user interaction","It is typically defined by the developer/tester, stays constant during the session and is usually not visible to the chatbot user","It can never contain a role or constraints","It is always visible and editable by the end user"],a:1,w:"System prompt: do developer/tester set, cố định suốt phiên, thường ẩn; có thể chứa role, context, constraints."},
{ch:2,lo:"2.1.3",k:"K2",q:"How does an LLM generate a response in a typical chatbot interaction?",o:["Using only the latest user prompt","Using only the system prompt","Considering both the unchanging system prompt and the current user prompt together","Ignoring the system prompt after the first turn"],a:2,w:"LLM xét cả system prompt (cố định) và user prompt hiện tại."},
{ch:2,lo:"2.2.1",k:"K3",q:"A tester wants GenAI to find ambiguities and missing information in a set of user stories before test design starts. Which test activity is this and what should the prompt input be?",o:["Test implementation; input: test scripts","Test analysis; input: the user stories as test basis","Test monitoring; input: defect metrics","Regression testing; input: code diffs"],a:1,w:"Identify defects in test basis là task test analysis; input là requirement/user story/wireframe."},
{ch:2,lo:"2.2.1",k:"K3",q:"To have an LLM prioritize test conditions by risk, which information should be provided in the prompt?",o:["Only the test condition titles","Risk likelihood and impact, regulatory aspects, user-facing features and historical defect data","The temperature setting","The vector database schema"],a:1,w:"Prioritize theo risk cần likelihood & impact, regulatory compliance, user-facing feature, historical defect data."},
{ch:2,lo:"2.2.1",k:"K3",q:"In HO-2.2.1b, a user story's acceptance criteria are refined in stages: identify ambiguities → evaluate testability → evaluate completeness, with manual verification at each stage. Which technique does this illustrate?",o:["Few-shot prompting","Prompt chaining with human verification","Meta prompting","A/B testing"],a:1,w:"Chuỗi bước + human verification mỗi bước = prompt chaining."},
{ch:2,lo:"2.2.2",k:"K3",q:"A team needs realistic test data resembling production without exposing personal information. Which GenAI-supported task applies?",o:["Test oracle generation","Test data synthesis producing privacy-preserving synthetic data","Impact analysis","Self-healing tests"],a:1,w:"Test data synthesis: dữ liệu tổng hợp giống production, bảo vệ privacy, bao phủ extreme situations."},
{ch:2,lo:"2.2.2",k:"K3",q:"A tester must generate Gherkin (Given-When-Then) scenarios from user stories in a consistent style. Which technique is MOST appropriate?",o:["Zero-shot prompting","Few-shot prompting with example user stories and their Gherkin scenarios","Lowering the temperature only","Meta prompting only"],a:1,w:"Output format cụ thể/lặp lại (Gherkin) → few-shot với ví dụ mẫu (HO-2.2.2b)."},
{ch:2,lo:"2.2.2",k:"K3",q:"When using GenAI to prioritize a test suite with risks and dependencies between test cases (HO-2.2.2c), what must the tester do with the output?",o:["Accept it directly since the LLM has all the data","Manually verify it to detect errors in the LLM's reasoning","Lower the temperature to zero and skip review","Convert it to Gherkin"],a:1,w:"Task multi-criteria reasoning dễ reasoning error → phải verify thủ công."},
{ch:2,lo:"2.2.3",k:"K3",q:"GUI regression tests keep failing because element locators change slightly between releases. Which GenAI-supported activity addresses this?",o:["Test oracle generation","Self-healing and adaptive tests that adjust scripts to minor UI changes","Test completion reporting","Data minimization"],a:1,w:"Self-healing/adaptive tests tự điều chỉnh script khi UI/API đổi nhỏ (dynamic locators)."},
{ch:2,lo:"2.2.3",k:"K3",q:"A team wants to focus regression testing on areas most affected by recent code changes. Which GenAI use applies?",o:["Impact analysis and test optimization","Keyword-driven script generation","Meta prompting","Context manipulation"],a:0,w:"Impact analysis: phân tích code change → vùng rủi ro cao → regression có mục tiêu."},
{ch:2,lo:"2.2.3",k:"K3",q:"In HO-2.2.3a, which technique is used to create and manage keyword-driven test scripts?",o:["Zero-shot prompting","Few-shot prompting","Fine-tuning","RAG"],a:1,w:"Keyword-driven script có pattern lặp → few-shot; phần debug dùng system prompt tạo AI assistant."},
{ch:2,lo:"2.2.4",k:"K3",q:"GenAI suggests reprioritizing tests, adjusting the schedule and reallocating resources after analyzing progress data. Which activity is this?",o:["Test analysis","Test control","Test implementation","Test design"],a:1,w:"Test control = hành động điều chỉnh (reprioritize, schedule, resources). Monitoring = đo & phân tích."},
{ch:2,lo:"2.2.4",k:"K3",q:"Which test monitoring task can GenAI support according to the syllabus?",o:["Compiling code into executables","Analyzing trends to predict risks and alert teams about deviations from plan","Granting database access rights","Replacing all human test managers"],a:1,w:"Test monitoring & metrics analysis: tự động monitoring, phân tích xu hướng, dự đoán risk, cảnh báo lệch kế hoạch."},
{ch:2,lo:"2.2.5",k:"K3",q:"Task: generate weekly test reports that must always follow the same company template. Which prompting technique is MOST suitable?",o:["Few-shot prompting","Prompt chaining","Meta prompting","Zero-shot prompting"],a:0,w:"Repetitive + specific output format → few-shot."},
{ch:2,lo:"2.2.5",k:"K3",q:"Task: a complex end-to-end test design where each intermediate step must be checked for functional correctness by a human. Which technique is MOST suitable?",o:["Few-shot prompting","Prompt chaining","Meta prompting","One-shot prompting"],a:1,w:"Complex + precision + human verification mỗi bước → prompt chaining."},
{ch:2,lo:"2.2.5",k:"K3",q:"Task: a new kind of anomaly detection on test logs that the team has never prompted for before. Which technique is recommended as a starting point?",o:["Few-shot prompting","Prompt chaining","Meta prompting","Setting a random seed"],a:2,w:"Flexible/dynamic/new task, cần tạo prompt mới → meta prompting (vd. test report analysis, anomaly detection)."},
{ch:2,lo:"2.2.5",k:"K3",q:"Which sequence illustrates combining all three techniques for one use case as described in the syllabus?",o:["Few-shot → meta → chaining","Meta prompting creates an initial prompt → its examples are adapted (few-shot) → the task is split into subtasks to validate intermediate steps (chaining)","Chaining → zero-shot → one-shot","Meta prompting is never combined with others"],a:1,w:"Ví dụ trong 2.2.5: meta tạo prompt → few-shot điều chỉnh ví dụ → chaining để validate bước trung gian."},
{ch:2,lo:"2.3.1",k:"K2",q:"'The proportion of generated test scripts that run without syntax errors in the test environment.' Which metric is this?",o:["Accuracy","Execution success rate","Recall","Diversity"],a:1,w:"Execution Success Rate: tỉ lệ artefact chạy được 'as is' trong test environment."},
{ch:2,lo:"2.3.1",k:"K2",q:"'The degree to which generated test cases cover both valid and invalid equivalence partitions.' Which metric?",o:["Precision","Recall","Time efficiency","Relevance"],a:1,w:"Recall = khả năng tìm tất cả instance liên quan – ví dụ trong syllabus là cover valid & invalid partitions."},
{ch:2,lo:"2.3.1",k:"K2",q:"'The degree to which generated test cases cover various user behaviors and explore edge cases.' Which metric?",o:["Diversity","Accuracy","Precision","Execution success rate"],a:0,w:"Diversity: bao phủ nhiều input/scenario, tránh lặp, edge case."},
{ch:2,lo:"2.3.1",k:"K2",q:"'The degree to which generated test cases correctly identify anomalies.' Which metric?",o:["Recall","Accuracy","Precision","Diversity"],a:2,w:"Precision = độ đúng so với một mục tiêu cụ thể – ví dụ: xác định đúng anomaly."},
{ch:2,lo:"2.3.1",k:"K2",q:"Why must metrics for GenAI results be based on statistically relevant data?",o:["Because LLMs are deterministic","Because of the non-deterministic nature of GenAI","Because metrics are only qualitative","Because of GDPR"],a:1,w:"GenAI non-deterministic → một lần chạy không đủ, cần dữ liệu đủ ý nghĩa thống kê."},
{ch:2,lo:"2.3.2",k:"K2",q:"A team creates two versions of a prompt and compares the outputs using predefined metrics to choose the better phrasing. Which technique is this?",o:["Iterative prompt modification","A/B testing of prompts","Output analysis","Meta prompting"],a:1,w:"A/B testing: nhiều phiên bản prompt, so sánh bằng metric định sẵn."},
{ch:2,lo:"2.3.2",k:"K2",q:"Which of the following is a technique for iteratively refining prompts listed in the syllabus?",o:["Setting the context window to zero","Adjusting prompt length and specificity","Disabling the system prompt","Data poisoning"],a:1,w:"5 kỹ thuật: iterative modification, A/B testing, output analysis, integrate user feedback, adjust length & specificity."},
{ch:3,lo:"3.1.1",k:"K1",q:"An LLM suggests test cases that verify acceptance criteria which do not exist in the user story. This is an example of:",o:["A reasoning error","A hallucination","A bias","Non-determinism"],a:1,w:"Hallucination: output sai/không liên quan – TC verify AC không tồn tại là ví dụ trong syllabus."},
{ch:3,lo:"3.1.1",k:"K1",q:"Which test tasks are given as examples where LLMs are prone to reasoning errors?",o:["Test planning and test case prioritization","Writing defect report titles","Translating documentation","Image captioning"],a:0,w:"Task cần logic: test planning, prioritization, ước lượng effort – LLM chỉ pattern matching."},
{ch:3,lo:"3.1.1",k:"K1",q:"Where do LLM biases originate from according to the syllabus?",o:["The temperature parameter","The data on which the model was trained","The vector database","The user prompt length"],a:1,w:"Bias bắt nguồn từ training data (vd. chủ yếu tiếng Anh)."},
{ch:3,lo:"3.1.2",k:"K3",q:"An LLM generates test data for a global e-commerce app, but all names, addresses and phone formats are US-style. What should the tester identify this as?",o:["A hallucination","A reasoning error","A bias","Context manipulation"],a:2,w:"Thiên lệch do training data → output thiên về một kiểu – bias."},
{ch:3,lo:"3.1.2",k:"K3",q:"Given a test suite where TC-5 depends on TC-2, the LLM's prioritization plan schedules TC-5 before TC-2 despite being told the dependency. This is BEST classified as:",o:["A hallucination","A reasoning error","A bias","Data poisoning"],a:1,w:"Hiểu sai logic/điều kiện (dependency) → reasoning error."},
{ch:3,lo:"3.1.2",k:"K3",q:"Which approach detects reasoning errors by running the generated test cases against the test object?",o:["Cross-verification","Domain expertise consultation","Output testing","Consistency checks"],a:2,w:"Output testing = chạy TC/script sinh ra để verify kết quả. Cross-verification/consistency/SME dùng cho hallucination."},
{ch:3,lo:"3.1.2",k:"K3",q:"A tester compares LLM-generated acceptance criteria with the existing requirements documentation to flag invented items. Which detection approach is this?",o:["Cross-verification","Logical validation","Output testing","Temperature adjustment"],a:0,w:"Cross-verification: so output với documentation/requirement/hành vi đã biết."},
{ch:3,lo:"3.1.2",k:"K3",q:"The LLM's generated test set contains almost no non-functional tests although the strategy requires them. What kind of issue is this and how is it detected?",o:["Hallucination; cross-verification","Bias; reviewing whether testware fairly represents the test strategy and coverage requirements","Reasoning error; output testing","Non-determinism; setting a seed"],a:1,w:"Thiếu non-functional test là ví dụ bias theo loại test; phát hiện bằng review tính đại diện so với strategy."},
{ch:3,lo:"3.1.3",k:"K2",q:"Which is a mitigation technique for hallucinations and reasoning errors listed in the syllabus?",o:["Use the longest possible prompt regardless of relevance","Compare results across several LLMs","Always use zero-shot prompting","Increase temperature"],a:1,w:"5 mitigation: complete context, chia nhỏ (chaining), format rõ, chọn model phù hợp, so sánh nhiều model."},
{ch:3,lo:"3.1.3",k:"K2",q:"Which two complementary techniques from Chapter 4 are mentioned to improve LLM results?",o:["Temperature and seed","RAG and fine-tuning","A/B testing and output analysis","Shadow AI and LLMOps"],a:1,w:"3.1.3 nhắc Ch.4 giới thiệu RAG và Fine-tuning."},
{ch:3,lo:"3.1.4",k:"K1",q:"Which two strategies reduce the variability of LLM output?",o:["Increasing context window and adding examples","Lowering temperature and setting a random seed","Using meta prompting and chaining","Fine-tuning and RAG"],a:1,w:"Non-determinism: temperature thấp + random seed."},
{ch:3,lo:"3.1.4",k:"K1",q:"What is a side effect of lowering the temperature?",o:["Output becomes more creative","Output becomes more repetitive with less diversity","The context window shrinks","Embeddings change"],a:1,w:"Temperature thấp → ít ngẫu nhiên nhưng giảm creativity/diversity."},
{ch:3,lo:"3.2.1",k:"K2",q:"Which is one of the data privacy concerns of GenAI in testing named in the syllabus?",o:["Lack of control over data usage by GenAI tools","Too few tokens in the context window","Excessive test coverage","Slow test execution"],a:0,w:"3 concern: unintentional data exposure, lack of control over data usage, compliance risks (GDPR)."},
{ch:3,lo:"3.2.1",k:"K2",q:"Using GenAI tools without complying with GDPR is an example of which risk?",o:["Compliance risk","Reasoning error","Overfitting","Orchestration"],a:0,w:"Compliance risk: vi phạm quy định bảo vệ dữ liệu như GDPR → tranh chấp pháp lý."},
{ch:3,lo:"3.2.2",k:"K2",q:"An attacker sends extremely long prompts that exceed the context window to make the LLM reveal snippets of its training data. Which attack vector is this?",o:["Request manipulation","Context manipulation","Data poisoning","Malicious code generation"],a:1,w:"Context manipulation: request thiết kế để trích xuất training data, vd. vượt context window."},
{ch:3,lo:"3.2.2",k:"K2",q:"Providing fake evaluations when rating AI-generated test reports is an example of:",o:["Data poisoning","Context manipulation","Request manipulation","Shadow AI"],a:0,w:"Data poisoning = thao túng training data (fake ratings)."},
{ch:3,lo:"3.2.2",k:"K2",q:"An image that lures the LLM into a different context and provokes hallucinated acceptance criteria is an example of:",o:["Request manipulation","Context manipulation","Malicious code generation","Overfitting"],a:0,w:"Request manipulation: đưa dữ liệu phá output (ảnh dụ sang ngữ cảnh khác)."},
{ch:3,lo:"3.2.3",k:"K2",q:"Masking or replacing sensitive information with non-identifiable data is called:",o:["Data minimization","Data anonymization and pseudonymization","Secure transmission","Resources training"],a:1,w:"Anonymization/pseudonymization = mask/thay thế thông tin nhạy cảm."},
{ch:3,lo:"3.2.3",k:"K2",q:"Which options does the syllabus give for a secure operational environment depending on required confidentiality?",o:["Public chatbot only","Commercial secure offering, secure cloud, or installing the LLM in the organization's own infrastructure","Shadow AI tools","Any free online LLM"],a:1,w:"3 lựa chọn theo mức bảo mật: commercial secure offering → secure cloud → in-house."},
{ch:3,lo:"3.2.3",k:"K2",q:"Which roles does the syllabus recommend involving when defining security measures for GenAI in testing?",o:["Only the test team","Senior Security Engineers, Legal counsel, CTO or CISO","Marketing and sales","External end users"],a:1,w:"Nên có Security Engineer, Legal, CTO, CISO tham gia."},
{ch:3,lo:"3.3.1",k:"K2",q:"According to the syllabus, generating a single image with a powerful AI model can consume as much energy as:",o:["Running a data center for a day","Fully charging a smartphone","Boiling a kettle","Driving a car for 100 km"],a:1,w:"Heikkilä 2023: 1 ảnh ≈ sạc đầy smartphone; text chỉ vài % pin."},
{ch:3,lo:"3.3.1",k:"K2",q:"What influences the energy consumption of a GenAI task?",o:["Only the number of users","The complexity of the task and the computational resources required","The tester's role","The output language"],a:1,w:"Độ phức tạp task + tài nguyên tính toán quyết định năng lượng; best practice: hạn chế tương tác không cần thiết."},
{ch:3,lo:"3.4.1",k:"K1",q:"Which document is a REGULATION that classifies AI applications by risk level?",o:["ISO/IEC 42001:2023","ISO/IEC 23053:2022","EU AI Act","NIST AI RMF"],a:2,w:"EU AI Act = regulation (luật), phân loại theo mức rủi ro. 42001/23053 = standard; NIST = framework."},
{ch:3,lo:"3.4.1",k:"K1",q:"Which standard specifies requirements for an AI management system within an organization?",o:["ISO/IEC 42001:2023","ISO/IEC 23053:2022","EU AI Act","NIST AI RMF 1.0"],a:0,w:"ISO/IEC 42001 = AI Management System. 23053 = framework cho AI systems dùng ML."},
{ch:3,lo:"3.4.1",k:"K1",q:"Which of these is a US framework offering guidelines for managing AI risks focused on fairness, transparency and security?",o:["EU AI Act","NIST AI Risk Management Framework","ISO/IEC 23053","GDPR"],a:1,w:"NIST AI RMF (US) = framework quản lý rủi ro AI."},
{ch:4,lo:"4.1.1",k:"K2",q:"In an LLM-powered test infrastructure, which component handles authentication, data retrieval and prompt preparation?",o:["Front-end","Back-end","The LLM","Vector database"],a:1,w:"Back-end xử lý input, authentication, data retrieval, prompt preparation, giao tiếp LLM, post-processing."},
{ch:4,lo:"4.1.1",k:"K2",q:"Which data source does the back-end use for semantic retrieval of related content using embeddings?",o:["Relational database","Vector database","File system","Test management tool"],a:1,w:"Vector DB lưu embedding → semantic retrieval; relational DB cho structured data (test cases)."},
{ch:4,lo:"4.1.1",k:"K2",q:"How does an LLM-powered test infrastructure differ from a rule-based chatbot?",o:["It follows scripted responses","It generates test insights dynamically from context such as requirements, code or test results","It has no back-end","It cannot be accessed via API"],a:1,w:"Khác rule-based: sinh insight động từ context; LLM là smart processing component; back-end post-process."},
{ch:4,lo:"4.1.2",k:"K2",q:"What is the correct order of the RAG preprocessing pipeline?",o:["Embed → chunk → query","Split documents into chunks (~256–512 tokens) → encode chunks into embeddings → store in a vector database","Store in relational DB → tokenize → generate","Fine-tune → retrieve → chunk"],a:1,w:"Preprocessing: chunk → embedding → vector DB. Runtime: retrieval (semantic similarity) → generation."},
{ch:4,lo:"4.1.2",k:"K2",q:"During the runtime phase of RAG, how are relevant chunks selected?",o:["Randomly","By semantic similarity between the query embedding and chunk embeddings","By file name","By the temperature value"],a:1,w:"Retrieval dựa trên semantic similarity giữa embedding của prompt và embedding của chunk."},
{ch:4,lo:"4.1.2",k:"K2",q:"What is the main benefit of RAG for test analysis and test design?",o:["It removes the need for prompts","Outputs are aligned with the latest specifications, requirements and existing test data retrieved in real time","It makes the LLM deterministic","It reduces the model size"],a:1,w:"RAG cho phép truy cập dữ liệu doanh nghiệp real-time → khớp spec/requirement mới nhất; response được grounded."},
{ch:4,lo:"4.1.3",k:"K2",q:"What distinguishes an LLM-powered agent from a traditional AI chatbot?",o:["Agents cannot use LLMs","Agents can 'act' by invoking predefined functions called tools to interact with external systems","Agents only answer questions","Agents have no memory"],a:1,w:"Agent 'act' qua tools; tích hợp reasoning, decision-making, memory."},
{ch:4,lo:"4.1.3",k:"K2",q:"For a critical test task, which type of agent does the syllabus recommend to mitigate hallucination risks?",o:["Fully autonomous agent","Semi-autonomous agent with periodic human oversight","Rule-based chatbot","No agent is ever acceptable"],a:1,w:"Agent vẫn mắc hallucination/reasoning error → dùng semi-autonomous cho task critical hoặc automated verification."},
{ch:4,lo:"4.1.3",k:"K2",q:"The coordinated effort of several specialized agents to solve a complex problem is called:",o:["Orchestration","Fine-tuning","Tokenization","Pseudonymization"],a:0,w:"Multi-agent architecture với phối hợp = orchestration."},
{ch:4,lo:"4.1.3",k:"K2",q:"How do LLM-powered agents change test automation according to the syllabus?",o:["From goal-driven to script-based","From script-based execution to goal-driven, agent-based test automation","They eliminate the need for test analysis","They only support test reporting"],a:1,w:"Agent-based: chuyển từ script-based sang goal-driven, end-to-end automation qua cả lifecycle."},
{ch:4,lo:"4.2.1",k:"K2",q:"What is fine-tuning?",o:["Lowering the temperature of an LLM","Further training a pre-trained language model on a targeted dataset to adapt it to specific tasks or domains","Retrieving documents at runtime","Splitting prompts into steps"],a:1,w:"Fine-tuning = train thêm trên dataset mục tiêu; glossary: supervised learning cập nhật weights."},
{ch:4,lo:"4.2.1",k:"K2",q:"Which is a challenge of fine-tuning named in the syllabus?",o:["Overfitting to the training data","Too much transparency","Too small a context window","Lack of prompt templates"],a:0,w:"4 thách thức: dữ liệu chất lượng (bias), overfitting, opacity, tài nguyên tính toán."},
{ch:4,lo:"4.2.1",k:"K2",q:"Why might an organization fine-tune an SLM instead of an LLM?",o:["SLMs cannot be fine-tuned","Higher performance for specific tasks without the same computational overhead","SLMs have larger context windows","SLMs are always more accurate"],a:1,w:"Fine-tune SLM: hiệu năng cao cho task cụ thể, ít tốn tài nguyên hơn LLM."},
{ch:4,lo:"4.2.1",k:"K2",q:"'Lack of transparency in how an LLM produces its outputs, complicating debugging and validation' refers to:",o:["Overfitting","Opacity","Bias","Hallucination"],a:1,w:"Opacity = thiếu minh bạch trong reasoning của model."},
{ch:4,lo:"4.2.2",k:"K2",q:"What is LLMOps?",o:["A prompting technique","Practices, tools and processes to streamline the development, deployment and maintenance of LLMs in production","A type of vector database","An EU regulation"],a:1,w:"LLMOps = Large Language Model Operations (Sinha 2024)."},
{ch:4,lo:"4.2.2",k:"K2",q:"Which approach to using GenAI in test processes emphasizes the most comprehensive control over data privacy but requires the most expertise?",o:["Using a public AI chatbot","Using a test tool with GenAI capabilities","In-house development of a GenAI-based test tool","Shadow AI"],a:2,w:"In-house: kiểm soát toàn diện privacy/security nhưng cần expertise, compute, storage, training."},
{ch:4,lo:"4.2.2",k:"K2",q:"Are the three approaches (chatbot, GenAI-enabled test tool, in-house tool) mutually exclusive?",o:["Yes, an organization must choose exactly one","No, they can be used simultaneously for different test activities","Yes, due to GDPR","Only chatbot and in-house can coexist"],a:1,w:"Không loại trừ nhau – có thể dùng song song, kết hợp RAG/fine-tuning."},
{ch:5,lo:"5.1.1",k:"K1",q:"What is shadow AI?",o:["AI that runs only at night","Use of GenAI tools within an organization without formal approval or oversight","An AI agent with no tools","A model with a hidden system prompt"],a:1,w:"Shadow AI = dùng GenAI không được phê duyệt/giám sát chính thức."},
{ch:5,lo:"5.1.1",k:"K1",q:"Which is a risk of shadow AI listed in the syllabus?",o:["Vague intellectual property due to unclear licensing","Too much test coverage","Excessive documentation","Slower tokenization"],a:0,w:"3 risk: security/privacy weaknesses, compliance issues, vague IP."},
{ch:5,lo:"5.1.2",k:"K2",q:"Which is a key aspect of a GenAI strategy for software testing?",o:["Defining measurable test objectives such as increasing productivity and shortening test cycles","Banning all human review","Choosing the LLM with the most marketing","Avoiding any metrics"],a:0,w:"Strategy: objectives đo được, chọn LLM, data quality, training & metrics, process guidelines (transparency, quality gates)."},
{ch:5,lo:"5.1.2",k:"K2",q:"Process guidelines for GenAI use should include which of the following?",o:["Rules for sensitive data, transparency obligations about what was generated, and quality gates with review of generated testware","Mandatory use of a single public chatbot","No review of generated testware","Hiding GenAI usage from stakeholders"],a:0,w:"Process guidelines: sensitive data rules, transparency obligations, quality gates."},
{ch:5,lo:"5.1.3",k:"K2",q:"Which set lists the key criteria for selecting LLMs/SLMs for test tasks?",o:["Model performance, fine-tuning potential, recurring cost, community and support","Brand popularity, UI color, release date, number of employees","Temperature, seed, context window, tokenizer","Chunk size, embedding size, index type, latency"],a:0,w:"4 tiêu chí: performance, fine-tuning potential, recurring cost, community & support."},
{ch:5,lo:"5.1.3",k:"K2",q:"When estimating recurring costs of GenAI for a test task (HO-5.1.3), which factors are considered?",o:["Number of input/output tokens, prompts used and task frequency","Only the number of testers","Only the vendor's reputation","The size of the vector database"],a:0,w:"Recurring cost phụ thuộc token input/output, prompt, tần suất task; so sánh commercial & open source."},
{ch:5,lo:"5.1.4",k:"K1",q:"What are the three phases of adopting GenAI in a test organization, in order?",o:["Discovery → Initiation and usage definition → Utilization and iteration","Planning → Execution → Closure","Pilot → Scale → Retire","Training → Fine-tuning → Deployment"],a:0,w:"D-I-U: Discovery, Initiation & usage definition, Utilization & iteration."},
{ch:5,lo:"5.1.4",k:"K1",q:"Which statement about the adoption phases is CORRECT?",o:["All use cases must be in the same phase","Phases can run in parallel for different use cases","Discovery comes last","Utilization requires no monitoring"],a:1,w:"Có thể song song theo use case (vd. test report analysis đi trước test automation)."},
{ch:5,lo:"5.1.4",k:"K1",q:"Which activity belongs to the Discovery phase?",o:["Training test teams on GenAI concepts and experimenting with initial use cases","Full integration into test processes with continuous monitoring","Measuring the transformation for scalability","Decommissioning legacy tools"],a:0,w:"Discovery = awareness & capability building: training, cấp quyền LLM, thử use case ban đầu."},
{ch:5,lo:"5.2.1",k:"K2",q:"Removing or masking sensitive, personal or confidential information before sharing testware with an LLM is called:",o:["Data sanitization","Tokenization","Orchestration","Meta prompting"],a:0,w:"Data sanitization – kỹ năng bắt buộc về bảo mật của tester (5.2.1)."},
{ch:5,lo:"5.2.1",k:"K2",q:"Which environmental consideration is part of the essential skills for testing with GenAI?",o:["Always using the largest model available","Selecting right-sized models and optimizing usage patterns to reduce computational overhead","Ignoring energy consumption","Running every prompt multiple times"],a:1,w:"Right-sized model, tối ưu usage, cân bằng lợi ích với chi phí & năng lượng."},
{ch:5,lo:"5.2.2",k:"K1",q:"What is a prompt pattern?",o:["A reusable template for crafting effective prompts to guide GenAI toward consistent outputs","A security attack vector","A fine-tuning dataset","A test monitoring metric"],a:0,w:"Prompt pattern = template tái sử dụng; team chia sẻ prompt pattern libraries."},
{ch:5,lo:"5.2.2",k:"K1",q:"Which strategy supports building GenAI capabilities in test teams?",o:["Internal communities of practice with regular meetings to share successful applications and lessons learned","Prohibiting experimentation","Outsourcing all prompting","Removing structured learning paths"],a:0,w:"Hands-on, learning paths, peer learning, communities of practice, prompt pattern libraries."},
{ch:5,lo:"5.2.3",k:"K1",q:"How does the tester's role evolve in an AI-enabled test organization?",o:["Testers are replaced by agents","Testers become AI-assisted test specialists who guide and verify AI-generated testware, refine prompts and maintain prompt libraries","Testers only write code","Testers stop using test techniques"],a:1,w:"Tester → AI-assisted test specialist: review output AI, prompt refinement, prompt libraries."},
{ch:5,lo:"5.2.3",k:"K1",q:"Which new responsibility is assigned to test managers when adopting GenAI?",o:["Writing all prompts personally","Establishing AI governance frameworks and coordinating hybrid teams of people and GenAI agents","Eliminating risk management","Avoiding AI literacy in the team"],a:1,w:"Test manager: AI-based strategy, AI risk management, governance, hybrid teams, giữ AI literacy + năng lực truyền thống."}
];
