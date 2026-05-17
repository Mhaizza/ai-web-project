import type {
  GenericMissionFlow,
  StructuredMissionFlow,
  MasteryMissionFlow,
  FoundationMissionFlow,
} from "@/lib/mission-flow-types";
import { ML101_WARMUP, SOCIAL_POST_WARMUP } from "@/lib/mission-warmups";
import {
  WHAT_IS_AI_TAPS,
  NEURAL_NETWORK_TAPS,
  ML101_EXTENDED_TAPS,
} from "@/lib/mission-tap-decks";
import { evaluateSocialPostWriting } from "@/lib/mission-eval-social-post";

// ─── World 1 — foundation tap decks ───────────────────────────────────────────

const WHAT_IS_AI_FLOW: FoundationMissionFlow = {
  band: "foundation",
  briefingAccent: "#00f5ff",
  tapWarmup: WHAT_IS_AI_TAPS,
};

const NEURAL_NETWORK_FLOW: FoundationMissionFlow = {
  band: "foundation",
  briefingAccent: "#38bdf8",
  tapWarmup: NEURAL_NETWORK_TAPS,
};

// ─── World 1 — structured ─────────────────────────────────────────────────────

const ML101_FLOW: StructuredMissionFlow = {
  band: "structured",
  briefingAccent: "#facc15",
  tapWarmup: [...ML101_WARMUP, ...ML101_EXTENDED_TAPS],
  scaffoldTitle: "// FIELD_REPORT — ML OPS",
  scaffoldBullets: [
    "อธิบายสั้นๆ (1–2 ประโยค): Machine Learning คืออะไร และต่างจากโปรแกรมที่เขียนกฎทุกอย่างล่วงหน้าอย่างไร",
    "ยกตัวอย่าง Overfitting + ผลกับ model เมื่อนำไปใช้จริง",
    "ความต่าง Supervised vs Unsupervised อย่างย่อ พร้อมตัวอย่างการใช้งานอย่างใดอย่างหนึ่ง",
  ],
  scaffoldPlaceholder:
    "ตัวอย่าง: ML เรียนจากข้อมูลหา pattern — Overfitting เหมือนท่องเฉลยจำได้แม่นแต่สอบใหม่พัง — Supervised ใช้ label จำแนก spam...",
  scaffoldMinChars: 75,
  chipInserts: [
    {
      icon: "📊",
      label: "training data",
      insert: "training data / ข้อมูลสำหรับฝึก ",
    },
    {
      icon: "🎯",
      label: "generalize",
      insert: "generalize ได้บนข้อมูลใหม่ ",
    },
    {
      icon: "🏷️",
      label: "labeled data",
      insert: "labeled data / มีป้ายกำกับคำตอบ ",
    },
    {
      icon: "🔍",
      label: "clustering",
      insert: "clustering / จัดกลุ่มโดยไม่มี label ",
    },
  ],
};

const SOCIAL_POST_FLOW: StructuredMissionFlow = {
  band: "structured",
  briefingAccent: "#f472b6",
  tapWarmup: SOCIAL_POST_WARMUP,
  scaffoldTitle: "// CLIENT_BRIEF — VOLT BREW ☕",
  scaffoldBullets: [
    "ให้ AI เขียนโพสต์ Instagram โปรโมทกาแฟเย็นรสใหม่ของ VOLT BREW",
    "ระบุกลุ่มเป้าหมาย แพลตฟอร์ม โทน อีโมจิ hashtag และ CTA ให้ครบในคำสั่งเดียว",
  ],
  scaffoldPlaceholder:
    "ตัวอย่าง: เขียน prompt ภาษาไทยสั่ง AI ให้สร้างโพสต์ IG สำหรับวัยรุ่น โทนสนุก มีอีโมจิ ☕⚡ และ hashtag พร้อม CTA กดสั่ง...",
  scaffoldMinChars: 80,
  chipInserts: [
    { icon: "👥", label: "กลุ่มเป้าหมาย", insert: "สำหรับวัยรุ่น 18-25 ปี " },
    { icon: "📱", label: "Instagram", insert: "สำหรับ Instagram " },
    { icon: "☕", label: "อีโมจิ", insert: "ใส่อีโมจิ ☕⚡🔥 " },
    { icon: "#️⃣", label: "Hashtag", insert: "#voltbrew #กาแฟ #coffee " },
    { icon: "👇", label: "CTA", insert: "พร้อม CTA ให้กดสั่งซื้อ " },
    { icon: "🎨", label: "โทน", insert: "โทนสนุกสนาน มีพลัง " },
  ],
  evaluateWritten: evaluateSocialPostWriting,
};

// ─── World 2 — deep learning / transformers (existing) ────────────────────────

const DEEP_LEARNING_FLOW: StructuredMissionFlow = {
  band: "structured",
  briefingAccent: "#bf00ff",
  tapWarmup: [
    {
      kind: "mcq",
      prompt: "Deep Learning อยู่ภายใต้ครอบครัวใดเป็นหลัก?",
      options: [
        "Spreadsheet Automation",
        "Machine Learning / AI",
        "Network Firewall Rules",
        "Database Indexing Only",
      ],
      correctIndex: 1,
      coachHint: "นึกถึงการเรียนรู้จากข้อมูลด้วยโครงข่ายหลายชั้น",
      explain:
        "Deep Learning เป็น subset ของ Machine Learning ที่ใช้โครงข่ายประสาทเทียมหลายชั้น",
    },
    {
      kind: "mcq",
      prompt: "ทำไม Deep Network ถึงเหมาะกับข้อมูลใหญ่และซับซ้อน?",
      options: [
        "เพราะไม่ต้องมีข้อมูลเลย",
        "เพราะซ้อนชั้นช่วยเรียนรู้ฟีเจอร์ระดับต่ำไปสูงแบบลำดับชั้น",
        "เพราะใช้แค่กฎ if-else",
        "เพราะช่วยปิดเครื่องให้เร็วขึ้น",
      ],
      correctIndex: 1,
      coachHint: "ชั้นที่ลึกขึ้นจับรายละเอียดที่ซับซ้อนขึ้นได้",
      explain:
        "Hierarchy of features — ชั้นตื้นจับขอบ/สี ชั้นลึกจับความหมายเชิงนามธรรมมากขึ้น",
    },
    {
      kind: "fill",
      prefix: "การเทรน Deep Model มักพึ่ง",
      suffix: "เพื่อเร่งการคูณเมทริกซ์ขนาดใหญ่แบบขนาน",
      chips: ["GPU", "เมาส์", "ปริ้นเตอร์", "ลำโพง"],
      correct: "GPU",
      coachHint: "ฮาร์ดแวร์ที่ถนัดเลขมิติใหญ่",
      explain:
        "GPU ใช้คำนวณแบบขนานได้ดี เหมาะกับ matrix ops ใน neural networks",
    },
  ],
  scaffoldTitle: "// SYNAPTIC_DEBRIEF — เชื่อมเป็นประโยคสั้น",
  scaffoldBullets: [
    "1–2 ประโยค: ทำไมความลึกของเลเยอร์ช่วยเรื่องข้อมูลใหญ่",
    "ยกตัวอย่างงานที่ DL เก่ง (ภาพ เสียง ข้อความ — เลือกอย่างใดอย่างหนึ่ง)",
  ],
  scaffoldPlaceholder:
    "ตัวอย่าง: เลเยอร์หลายชั้นดึงฟีเจอร์จากหยาบไปละเอียด เช่น ภาพสินค้า → DL ช่วยจำแนกสภาพพื้นหลังได้ดีเมื่อมีข้อมูลมาก...",
  scaffoldMinChars: 45,
  chipInserts: [
    {
      icon: "📚",
      label: "ฟีเจอร์ลำดับชั้น",
      insert: "ฟีเจอร์ระดับต่ำถึงสูงแบบ hierarchical ",
    },
    { icon: "🖼", label: "ตย. ภาพ", insert: "จำแนกภาพหรือตรวจจับวัตถุ " },
    {
      icon: "🎧",
      label: "ตย. เสียง",
      insert: "speech recognition / audio tagging ",
    },
    {
      icon: "📈",
      label: "ข้อมูลใหญ่",
      insert: "เมื่อมีข้อมูลมากและโครงสร้างซับซ้อน ",
    },
  ],
};

const TRANSFORMERS_FLOW: MasteryMissionFlow = {
  band: "mastery",
  briefingAccent: "#00f5ff",
  tapWarmup: [
    {
      kind: "mcq",
      prompt: "ข้อความหลักของสถาปัตยกรรม Transformer คือ?",
      options: [
        "Recurrence is All You Need",
        "Attention is All You Need",
        "Convolution is All You Need",
        "Loops are All You Need",
      ],
      correctIndex: 1,
      coachHint: "ชื่อเปเปอร์ foundational ของ Transformer",
      explain:
        "Transformer พึ่ง Attention เพื่อจัดการความสัมพันธ์ระหว่างโทเค็นทั้งลำดับ",
    },
    {
      kind: "mcq",
      prompt: "Self-Attention ช่วยให้โมเดลทำอะไร?",
      options: [
        "ลบชั้นที่ไม่ใช้ออกจาก GPU",
        "ให้แต่ละโทเค็นดึง context จากโทเค็นอื่นในลำดับได้ยืดหยุ่น",
        "แปลงภาพเป็นเสียงโดยตรง",
        "บังคับให้โมเดลอ่านจากซ้ายไปขวาอย่างเดียวเสมอ",
      ],
      correctIndex: 1,
      coachHint: "ความเกี่ยวข้องไม่ได้ผูกระยะคงที่เหมือน CNN kernel เดียว",
      explain:
        "แต่ละตำแหน่งประเมินว่าตำแหน่งไหนในลำดับสำคัญต่อความหมายของตัวเอง",
    },
    {
      kind: "fill",
      prefix: "Multi-head Attention ช่วยให้โมเดลเรียนรู้ได้หลายมุมของความสัมพันธ์ใน",
      suffix: "เดียวกัน",
      chips: ["ลำดับ / sequence", "ไฟล์ ZIP", "พื้นที่ว่าง", "คีย์บอร์ด"],
      correct: "ลำดับ / sequence",
      coachHint: "ข้อความเป็นลำดับของโทเค็น",
      explain:
        "หลายหัว attention เรียนรู้ pattern ความเกี่ยวข้องที่ต่างกันในลำดับเดียวกัน",
    },
  ],
  essayPrompt:
    "อธิบายในภาษาของคุณเอง (สั้นแต่หนักแน่น): Attention ช่วยให้ LLM จัดการข้อความยาวได้อย่างไร และทำไมมันถึงเปลี่ยนเกมของ NLP",
  essayPlaceholder:
    "เริ่มจากความหมายของ attention score → เชื่อมกับ context window และ parallelism เทียบกับ RNN...",
  essayMinChars: 85,
  oracleTips: [
    "ลองใช้คำว่า query/key/value หรือ \"ความสำคัญของโทเค็น\"",
    "ยกอย่างน้อยหนึ่งข้อดีเทียบกับ recurrence",
    "ไม่ต้องยาว — ขอให้มีเหตุผลครบช่วง",
  ],
};

/** All missions routed through `/mission/[id]` except boss (static page). */
export const GENERIC_MISSION_FLOWS: Record<string, GenericMissionFlow> = {
  "what-is-ai": WHAT_IS_AI_FLOW,
  "ml-101": ML101_FLOW,
  "neural-network": NEURAL_NETWORK_FLOW,
  "social-post": SOCIAL_POST_FLOW,
  "deep-learning": DEEP_LEARNING_FLOW,
  transformers: TRANSFORMERS_FLOW,
};

export function getGenericMissionFlow(id: string): GenericMissionFlow | null {
  return GENERIC_MISSION_FLOWS[id] ?? null;
}
