// ─── Types ────────────────────────────────────────────────────────────────────

export interface Challenge {
  id: number;
  prompt: string;
  icon: string;
  topic: string;
  hint: string;
  goodKeywords: string[];
  bonusKeywords: string[];
  minLength: number;
}

export interface EvalResult {
  effectiveness: number; // 0-100
  clarity: number;       // 0-100
  creativity: number;    // 0-100
  total: number;         // weighted score
  tier: "S" | "A" | "B" | "C" | "D";
  feedback: string;
  xpEarned: number;
}

// ─── Feedback Messages ────────────────────────────────────────────────────────

const FEEDBACK: Record<string, string[]> = {
  S: [
    "NEURAL_PATHWAY: OPTIMAL — Exceptional conceptual coverage with creative depth. Pattern recognition: MAXED.",
    "SYNAPSE_ACTIVATION: 100% — Your response demonstrates elite understanding. AI evaluator impressed.",
    "AGENT_STATUS: ELITE — This level of insight unlocks advanced neural pathways. Keep pushing.",
  ],
  A: [
    "SIGNAL_STRENGTH: HIGH — Strong understanding detected. Minor creative gaps prevent S-rank.",
    "DATA_QUALITY: EXCELLENT — Clear, effective response. Add real-world examples for maximum score.",
    "NEURAL_LINK: STRONG — Core concepts confirmed. Deeper elaboration will unlock S-tier next time.",
  ],
  B: [
    "SIGNAL_DETECTED — Decent understanding shown. Expand your explanation for a higher grade.",
    "PROCESSING: ACCEPTABLE — Key concepts present but lacks elaboration. Try adding examples.",
    "CALIBRATING... — You are on the right track. More AI terminology will boost your score.",
  ],
  C: [
    "WEAK_SIGNAL — Basic understanding detected. Add key AI/ML concepts to boost effectiveness.",
    "PATTERN: PARTIAL — Some relevant ideas found. Explain with real-world examples next time.",
    "RECALIBRATING... — Use more specific technical terms and describe them in your own words.",
  ],
  D: [
    "SIGNAL_LOST — Very limited response. Try using AI/ML terminology and expand your answer.",
    "ERROR: INSUFFICIENT_DATA — Elaborate more. Mention concepts, examples, and real-world context.",
    "SYSTEM: RETRY_PROTOCOL — Review the topic, then provide a more detailed response.",
  ],
};

// ─── ML-101 Challenge Set ─────────────────────────────────────────────────────

export const ML_CHALLENGES: Challenge[] = [
  {
    id: 1,
    prompt: "อธิบายว่า Machine Learning (ML) คืออะไร — ในแบบที่คุณจะบอกเพื่อนที่ไม่รู้เรื่อง AI เลย",
    icon: "🤖",
    topic: "ML DEFINITION",
    hint: "💡 ลองนึกถึงความแตกต่างระหว่างการเขียนโปรแกรมปกติ (บอกทุกกฎ) กับการให้คอมพิวเตอร์เรียนรู้จากข้อมูลด้วยตัวเอง",
    goodKeywords: [
      "เรียนรู้", "ข้อมูล", "data", "pattern", "โมเดล", "model",
      "คอมพิวเตอร์", "algorithm", "อัตโนมัติ", "ai", "predict",
      "ทำนาย", "learn", "training",
    ],
    bonusKeywords: [
      "ตัวอย่าง", "เช่น", "เหมือน", "เปรียบ", "โดยไม่ต้อง",
      "แทน", "without", "ประสบการณ์", "experience", "improve",
    ],
    minLength: 50,
  },
  {
    id: 2,
    prompt: "Training Data และ Test Data ต่างกันอย่างไร? และทำไมต้องแยกออกจากกัน?",
    icon: "📊",
    topic: "DATA SPLITTING",
    hint: "💡 Training Data = หนังสือเรียน, Test Data = ข้อสอบ — ถ้าใช้ข้อสอบเดิมฝึก จะรู้ได้ยังไงว่าเก่งจริง?",
    goodKeywords: [
      "training", "test", "สอน", "ทดสอบ", "train", "เรียน",
      "แบ่ง", "ข้อมูล", "data", "ฝึก", "ประเมิน", "validate",
      "generalize", "แยก",
    ],
    bonusKeywords: [
      "เปอร์เซ็นต์", "percent", "split", "80", "20", "70", "30",
      "ตัวอย่าง", "เปรียบ", "เหมือน", "overfit", "bias", "unseen",
    ],
    minLength: 50,
  },
  {
    id: 3,
    prompt: "Overfitting คืออะไร? ยกตัวอย่างชีวิตจริงที่ไม่เกี่ยวกับ AI เลย",
    icon: "⚠️",
    topic: "OVERFITTING",
    hint: "💡 คิดถึงคนที่ 'จำ' แทนที่จะ 'เข้าใจ' — พอเจอสถานการณ์ใหม่กลับทำไม่ได้ทั้งที่คะแนนฝึกสูงมาก",
    goodKeywords: [
      "overfitting", "จำ", "memorize", "training", "ใหม่", "new",
      "generalize", "ทั่วไป", "แย่", "error", "overfit", "ล้มเหลว",
      "fail", "ข้อมูล",
    ],
    bonusKeywords: [
      "นักเรียน", "student", "ข้อสอบ", "exam", "เฉลย",
      "จำทุก", "ท่อง", "ตัวอย่าง", "ชีวิตจริง", "real", "สถานการณ์",
    ],
    minLength: 55,
  },
  {
    id: 4,
    prompt: "Classification ใน ML คืออะไร? อธิบายพร้อมยกตัวอย่างการใช้งาน 2 กรณี",
    icon: "🏷️",
    topic: "CLASSIFICATION",
    hint: "💡 Classification = ให้ AI ตัดสินใจว่า input นี้อยู่ใน 'กลุ่ม' ไหน เช่น spam/not spam",
    goodKeywords: [
      "classification", "จัดประเภท", "classify", "หมวด", "ประเภท",
      "category", "label", "spam", "class", "จำแนก", "predict", "กลุ่ม",
    ],
    bonusKeywords: [
      "ตัวอย่าง", "เช่น", "โรงพยาบาล", "email", "อีเมล",
      "รูปภาพ", "image", "fraud", "ตรวจ", "detect", "ใช้งาน",
      "application", "แมว", "หมา", "cat", "dog",
    ],
    minLength: 60,
  },
];

// ─── Neural Network Challenge Set ────────────────────────────────────────────

export const NN_CHALLENGES: Challenge[] = [
  {
    id: 1,
    prompt: "อธิบายว่า Neuron ใน Neural Network ทำงานอย่างไร — ใช้คำเปรียบเทียบให้เข้าใจง่าย",
    icon: "🔗",
    topic: "NEURON FUNCTION",
    hint: "💡 Neuron รับ input → คูณด้วย weight → รวมค่า → ผ่าน activation function → ส่ง output — คล้ายเซลล์ประสาทในสมอง",
    goodKeywords: [
      "neuron", "รับ", "input", "ส่ง", "output", "สัญญาณ", "signal",
      "น้ำหนัก", "weight", "ประมวลผล", "process", "activation", "layer",
    ],
    bonusKeywords: [
      "สมอง", "brain", "เซลล์ประสาท", "nerve", "เหมือน", "คล้าย",
      "เปรียบ", "คูณ", "multiply", "บวก", "sum", "threshold", "fire",
    ],
    minLength: 50,
  },
  {
    id: 2,
    prompt: "Deep Learning ต่างจาก Machine Learning ทั่วไปอย่างไร? อธิบายให้ชัดเจน",
    icon: "🏗️",
    topic: "DEEP VS ML",
    hint: "💡 คำว่า 'Deep' ใน Deep Learning = จำนวนชั้น (layers) ของ Neural Network ที่ซ้อนกันหลายชั้น",
    goodKeywords: [
      "deep", "layer", "ชั้น", "neural", "hidden", "deep learning",
      "machine learning", "feature", "คุณสมบัติ", "ลึก", "complex", "ซับซ้อน",
    ],
    bonusKeywords: [
      "ตัวอย่าง", "เช่น", "รูปภาพ", "image", "text", "ภาษา",
      "speech", "เสียง", "มากกว่า", "ต่าง", "differ", "หลายชั้น", "multiple",
    ],
    minLength: 50,
  },
  {
    id: 3,
    prompt: "Activation Function คืออะไร? ทำไม Neural Network ถึงขาดมันไม่ได้?",
    icon: "⚡",
    topic: "ACTIVATION FUNCTION",
    hint: "💡 ถ้าไม่มี Activation Function, Neural Network 100 ชั้นก็ยังทำงานเหมือน 1 ชั้น เพราะมันจะเป็น linear ล้วน",
    goodKeywords: [
      "activation", "function", "relu", "sigmoid", "nonlinear",
      "non-linear", "ฟังก์ชัน", "สัญญาณ", "output", "layer",
      "activate", "tanh",
    ],
    bonusKeywords: [
      "ตัวอย่าง", "เช่น", "เหมือน", "สวิตช์", "switch", "gate",
      "ประตู", "linear", "จำเป็น", "สำคัญ", "ไม่งั้น", "without",
      "nonlinearity", "ซับซ้อน",
    ],
    minLength: 45,
  },
  {
    id: 4,
    prompt: "CNN (Convolutional Neural Network) คืออะไร? ทำไมถึงเหมาะกับงานรูปภาพโดยเฉพาะ?",
    icon: "🖼️",
    topic: "CNN",
    hint: "💡 CNN ใช้ 'filter' สแกนผ่านรูปภาพเพื่อตรวจจับ pattern เช่น ขอบ รูปร่าง และ texture ในแต่ละตำแหน่ง",
    goodKeywords: [
      "cnn", "convolutional", "รูปภาพ", "image", "filter",
      "feature", "pattern", "ขอบ", "edge", "texture",
      "spatial", "convolution", "pool",
    ],
    bonusKeywords: [
      "ตัวอย่าง", "เช่น", "pixel", "ตรวจจับ", "detect",
      "จดจำ", "recognize", "ใบหน้า", "face", "object",
      "grid", "scan", "locality", "translation invariant",
    ],
    minLength: 50,
  },
];

// ─── Local AI Evaluator Engine ────────────────────────────────────────────────

export function evaluateAnswer(
  answer: string,
  challenge: Challenge,
  maxXP: number
): EvalResult {
  const lower = answer.toLowerCase().trim();
  const wordCount = lower.split(/\s+/).filter(Boolean).length;

  // ── Effectiveness (50% weight) ──────────────────────────────────────────────
  // Score based on how many good keywords appear in the answer
  const goodHits = challenge.goodKeywords.filter((kw) =>
    lower.includes(kw.toLowerCase())
  ).length;
  // Hitting 40% of keywords = 100% effectiveness
  const targetHits = Math.max(2, Math.ceil(challenge.goodKeywords.length * 0.4));
  const effectivenessBase = Math.min(100, Math.round((goodHits / targetHits) * 100));
  // Baseline score for effort (answer long enough but missed keywords)
  const effortBase = lower.length >= challenge.minLength * 0.6 ? 12 : 0;
  const effectiveness = Math.max(
    effortBase,
    Math.min(100, effectivenessBase + Math.round(Math.random() * 12 - 6))
  );

  // ── Clarity (30% weight) ────────────────────────────────────────────────────
  // Based on answer length relative to the required minimum
  const lenRatio = lower.length / challenge.minLength;
  const clarityBase =
    lenRatio < 0.3 ? 8
    : lenRatio < 0.7 ? 32
    : lenRatio < 1.0 ? 56
    : lenRatio < 1.5 ? 76
    : lenRatio < 2.5 ? 89
    : 96;
  const clarity = Math.max(
    0,
    Math.min(100, clarityBase + Math.round(Math.random() * 10 - 5))
  );

  // ── Creativity (20% weight) ─────────────────────────────────────────────────
  // Bonus keywords + use of examples / analogies / depth
  const bonusHits = challenge.bonusKeywords.filter((kw) =>
    lower.includes(kw.toLowerCase())
  ).length;
  const hasExample = /เช่น|ตัวอย่าง|เหมือน|เปรียบ|like |for example|such as|อย่าง/.test(lower);
  const hasAnalogy = /คล้าย|ก็คือ|นั่นคือ|หมายความ|หมายถึง/.test(lower);
  const creativityBase = Math.min(
    100,
    bonusHits * 20
    + (hasExample ? 28 : 0)
    + (hasAnalogy ? 14 : 0)
    + (wordCount > 22 ? 14 : 0)
    + (lower.length > challenge.minLength * 2 ? 10 : 0)
  );
  const creativity = Math.max(
    0,
    Math.min(100, creativityBase + Math.round(Math.random() * 18))
  );

  // ── Weighted Total ──────────────────────────────────────────────────────────
  const total = Math.round(effectiveness * 0.5 + clarity * 0.3 + creativity * 0.2);

  // ── Tier ───────────────────────────────────────────────────────────────────
  const tier: EvalResult["tier"] =
    total >= 85 ? "S"
    : total >= 68 ? "A"
    : total >= 48 ? "B"
    : total >= 28 ? "C"
    : "D";

  // ── Feedback ───────────────────────────────────────────────────────────────
  const pool = FEEDBACK[tier];
  const feedback = pool[Math.floor(Math.random() * pool.length)];

  // ── XP ─────────────────────────────────────────────────────────────────────
  const xpEarned = Math.round(maxXP * (total / 100));

  return {
    effectiveness: Math.max(0, Math.min(100, effectiveness)),
    clarity: Math.max(0, Math.min(100, clarity)),
    creativity: Math.max(0, Math.min(100, creativity)),
    total,
    tier,
    feedback,
    xpEarned,
  };
}
