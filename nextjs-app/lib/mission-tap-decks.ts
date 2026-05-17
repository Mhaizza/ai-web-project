import type { TapStep } from "@/lib/mission-flow-types";

/** M-001 — tap-only foundation deck */
export const WHAT_IS_AI_TAPS: TapStep[] = [
  {
    kind: "mcq",
    prompt: "AI ย่อมาจากอะไร?",
    options: [
      "Automatic Intelligence",
      "Artificial Intelligence",
      "Advanced Interface",
      "Automated Input",
    ],
    correctIndex: 1,
    coachHint: "ปัญญาประดิษฐ์ภาษาอังกฤษ",
    explain: "AI = Artificial Intelligence หรือ ปัญญาประดิษฐ์",
  },
  {
    kind: "mcq",
    prompt: "อะไรทำให้ AI แตกต่างจากโปรแกรมธรรมดา?",
    options: [
      "ทำงานได้เร็วกว่า",
      "เรียนรู้จากข้อมูลได้",
      "ใช้ไฟน้อยกว่า",
      "ไม่มี bug",
    ],
    correctIndex: 1,
    coachHint: "ไม่ต้องเขียนกฎทุกเคสล่วงหน้า",
    explain:
      "AI เรียนรู้จากข้อมูล (data) ไม่ต้องโปรแกรมกฎทุกอย่างล่วงหน้า",
  },
  {
    kind: "fill",
    prefix: "AI เรียนรู้จาก",
    suffix: "แทนที่จะทำตามกฎตายตัว",
    chips: ["ข้อมูล (Data)", "ไฟฟ้า", "Python code", "คำสั่งมนุษย์"],
    correct: "ข้อมูล (Data)",
    coachHint: "ข้อมูลเทรน / production data",
    explain:
      "Machine Learning ใช้ข้อมูลจำนวนมากในการหา pattern โดยอัตโนมัติ",
  },
  {
    kind: "mcq",
    prompt: "อะไรคือตัวอย่าง AI ในชีวิตจริง?",
    options: [
      "Excel spreadsheet",
      "Netflix แนะนำซีรีส์",
      "นาฬิกาปลุก",
      "เครื่องคิดเลข",
    ],
    correctIndex: 1,
    coachHint: "ระบบแนะนำจากพฤติกรรมผู้ใช้",
    explain:
      "Netflix วิเคราะห์ข้อมูลการดูของคุณเพื่อแนะนำเนื้อหาที่คุณน่าจะชอบ",
  },
  {
    kind: "mcq",
    prompt: "Machine Learning คืออะไร?",
    options: [
      "เขียนโปรแกรมด้วยมือ",
      "AI หา pattern จากข้อมูลได้เอง",
      "สอน AI ด้วยกฎ",
      "ซ่อมคอมพิวเตอร์",
    ],
    correctIndex: 1,
    coachHint: "เรียนรู้จากข้อมูลโดยไม่ระบุกฎครบทุกอย่าง",
    explain:
      "Machine Learning = AI เรียนรู้ pattern จาก training data โดยไม่ต้องโปรแกรมกฎล่วงหน้า",
  },
  {
    kind: "mcq",
    prompt: "ถ้า AI ฝึกด้วยข้อมูลที่มีอคติ จะเกิดอะไร?",
    options: [
      "AI จะฉลาดขึ้น",
      "AI จะทำงานเร็วขึ้น",
      "AI จะมีอคติด้วย",
      "ไม่มีผลกระทบ",
    ],
    correctIndex: 2,
    coachHint: "Garbage in — garbage out",
    explain:
      "\"Garbage in, Garbage out\" — ข้อมูลไม่ดี ผลลัพธ์ของ AI ก็จะมีอคติตามไปด้วย",
  },
];

/** M-003 — tap-only foundation deck */
export const NEURAL_NETWORK_TAPS: TapStep[] = [
  {
    kind: "mcq",
    prompt: "Neural Network ได้แรงบันดาลใจมาจากอะไร?",
    options: ["วงจรไฟฟ้า", "สมองมนุษย์", "ต้นไม้ตัดสินใจ", "กฎคณิตศาสตร์"],
    correctIndex: 1,
    coachHint: "เลียนแบบ neuron",
    explain:
      "Neural Network เลียนแบบการทำงานของเซลล์ประสาท (neuron) ในสมองมนุษย์",
  },
  {
    kind: "fill",
    prefix: "Neural Network ประกอบด้วย Input Layer →",
    suffix: "→ Output Layer",
    chips: ["Hidden Layer", "Secret Layer", "Process Node", "Middle Layer"],
    correct: "Hidden Layer",
    coachHint: "ชั้นกลางประมวลผล",
    explain:
      "Hidden Layer คือชั้นกลางที่ประมวลผลข้อมูลก่อนส่งออก Output",
  },
  {
    kind: "mcq",
    prompt: "Activation Function ทำหน้าที่อะไรใน Neural Network?",
    options: [
      "เก็บข้อมูลไว้ใน layer",
      "เพิ่ม non-linearity ให้ network เรียนรู้ pattern ซับซ้อนได้",
      "ลบ node ที่ไม่ใช้ออก",
      "ส่งข้อมูลออกนอก network",
    ],
    correctIndex: 1,
    coachHint: "ถ้าไม่มีชั้นนี้จะเหลือแค่เส้นตรงซ้อนกัน",
    explain:
      "ถ้าไม่มี Activation Function ทุก layer จะรวมกันเป็นแค่สมการเส้นตรง ซึ่งแก้ปัญหาซับซ้อนไม่ได้",
  },
  {
    kind: "mcq",
    prompt: "ReLU คือ Activation Function ที่ทำอะไร?",
    options: [
      "คำนวณค่าเฉลี่ยของ inputs",
      "ส่งค่าลบเป็น 0 ส่งค่าบวกผ่านตรงๆ (max(0,x))",
      "แปลงค่าทุกอย่างให้อยู่ระหว่าง 0-1",
      "ลบ weight ที่น้อยกว่า 0",
    ],
    correctIndex: 1,
    coachHint: "Rectified Linear Unit",
    explain: "ReLU = Rectified Linear Unit: f(x) = max(0, x) — ง่ายและมีประสิทธิภาพสูง",
  },
  {
    kind: "mcq",
    prompt: "Backpropagation ทำอะไรหลัง Neural Network ตอบผิด?",
    options: [
      "สร้าง layer ใหม่",
      "ลบ node ที่ผิดออก",
      "ย้อนกลับมาปรับ weight ทุก layer เพื่อลด error",
      "รีสตาร์ทการเทรนใหม่ทั้งหมด",
    ],
    correctIndex: 2,
    coachHint: "ส่ง gradient ย้อนกลับ",
    explain:
      "Backpropagation คำนวณ gradient แล้วส่งย้อนกลับ (backward) เพื่อปรับ weight ให้ error ลดลง",
  },
  {
    kind: "fill",
    prefix: "Backpropagation ปรับ",
    suffix: "ของแต่ละ connection เพื่อลด error",
    chips: ["Weight", "Layer", "Bias", "Node"],
    correct: "Weight",
    coachHint: "พารามิเตอร์ของสายเชื่อม",
    explain:
      "Weight คือค่าความสำคัญของแต่ละ connection ที่ Backprop จะปรับให้ network แม่นขึ้น",
  },
];

/** Extra taps after ML101_WARMUP for structured ML-101 mission */
export const ML101_EXTENDED_TAPS: TapStep[] = [
  {
    kind: "mcq",
    prompt: "Overfitting ใกล้เคียงสถานการณ์ไหนมากที่สุด?",
    options: [
      "นักเรียนท่องเฉลยข้อสอบเก่าได้หมดแต่ทำโจทย์ใหม่ไม่ได้",
      "นักเรียนเข้าใจหลักการแล้วทำได้หลากหลาย",
      "โมเดลเล็กเกินจนทำอะไรไม่ได้",
      "ข้อมูลหายไปจากดิสก์",
    ],
    correctIndex: 0,
    coachHint: "จำ noise ใน training มากเกินไป",
    explain:
      "Model เรียนจำ training data + noise จนทำผลบนชุดใหม่ไม่ได้ — generalization แย่",
  },
  {
    kind: "mcq",
    prompt: "Supervised Learning ต้องการอะไรจากข้อมูลเป็นหลัก?",
    options: [
      "ป้ายกำกับคำตอบที่ถูกต้อง (labels)",
      "ไม่มีข้อมูลเลย",
      "แค่ชื่อไฟล์",
      "ความเร็วอินเทอร์เน็ตเท่านั้น",
    ],
    correctIndex: 0,
    coachHint: "ครูบอกว่าอันไหนถูก",
    explain:
      "Supervised เรียนรู้จาก input-output pairs ที่มี label / target ที่ถูกต้อง",
  },
  {
    kind: "mcq",
    prompt: "Unsupervised Learning มักใช้ทำอะไร?",
    options: [
      "จัดกลุ่มหรือค้นหา pattern โดยไม่มี label",
      "ทำนายราคาหุ้นที่มีเฉลยทุกวันเสมอ",
      "แปลภาษาที่มีคู่ประโยคเฉลยครบแล้วเท่านั้น",
      "ปิดการทำงานของ GPU",
    ],
    correctIndex: 0,
    coachHint: "clustering / representation learning",
    explain:
      "Unsupervised ทำงานกับข้อมูลที่ไม่มี label เช่น clustering หาโครงสร้างซ่อน",
  },
];
