import type { TapStep } from "@/lib/mission-flow-types";

/** Quick tap rounds before ML-101 writing challenges — avoids starting on blank essays */
export const ML101_WARMUP: TapStep[] = [
  {
    kind: "mcq",
    prompt: "Machine Learning เรียนรู้หลักการจากอะไรเป็นหลัก?",
    options: [
      "กฎ if-else ที่เขียนครบทุกกรณีล่วงหน้า",
      "ข้อมูลและแพทเทิร์นในการฝึก",
      "ความเร็วของ SSD เท่านั้น",
      "ขนาดของเมาส์และคีย์บอร์ด",
    ],
    correctIndex: 1,
    coachHint: "Training data → model เรียนจากตัวอย่าง",
    explain:
      "ML เรียนจากข้อมูลเพื่อหา pattern — ไม่ต้องเขียนกฎครบทุกเคสเหมือนโปรแกรมแบบดั้งเดิม",
  },
  {
    kind: "mcq",
    prompt: "Overfitting คล้ายสถานการณ์ไหนมากที่สุด?",
    options: [
      "นักเรียนท่องเฉลยข้อสอบเก่าได้แม่น แต่ทำโจทย์ใหม่ไม่ได้",
      "นักเรียนอ่านหนังสือทุกวันอย่างสม่ำเสมอ",
      "ครูสอนช้าเกินไป",
      "คอมพิวเตอร์ค้างเพราะแรมเต็ม",
    ],
    correctIndex: 0,
    coachHint: "จำได้แม่นแต่ไม่ generalize",
    explain:
      "Model จำ training set + noise มากเกินไป → ไปไม่รอดบนข้อมูลใหม่",
  },
  {
    kind: "fill",
    prefix: "ใน Supervised Learning เรามักมี",
    suffix: "บอกว่าคำตอบที่ถูกต้องคืออะไร",
    chips: ["Labels / ป้ายกำกับ", "Wi-Fi password", "พื้นที่ว่าง", "ชื่อเมาส์"],
    correct: "Labels / ป้ายกำกับ",
    coachHint: "มีครูบอกว่าอันไหนถูก",
    explain:
      "Supervised ใช้ labeled data เช่น รูป + ป้ายว่าเป็นแมวหรือหมา",
  },
];

/** Prompt-literacy taps before Social AI textarea */
export const SOCIAL_POST_WARMUP: TapStep[] = [
  {
    kind: "mcq",
    prompt: "ถ้าอยากให้ AI เขียนโพสต์โซเชียลตรงใจ — ควรระบุอะไรก่อนเป็นอันดับแรก?",
    options: [
      "แค่พิมพ์ว่า \"ช่วยเขียนหน่อย\"",
      "กลุ่มเป้าหมาย + แพลตฟอร์ม + โทนที่ต้องการ",
      "ชื่อผู้เขียนภายในโมเดล",
      "หมายเลขบัตรเครดิต",
    ],
    correctIndex: 1,
    coachHint: "บริบทช่วยให้ AI เดาถูก",
    explain:
      "ยิ่งบอก audience / platform / tone ชัด เชิงสร้างสรรค์ยิ่งไปตรงจุด",
  },
  {
    kind: "mcq",
    prompt: "Hashtag ใน brief มีหน้าที่หลักอย่างไรต่อโพสต์?",
    options: [
      "ทำให้ไฟล์หนักขึ้น",
      "ช่วยค้นหา/จัดกลุ่มเนื้อหาและเพิ่มการค้นพบ",
      "ลบความคิดเห็นอัตโนมัติ",
      "บังคับให้โพสต์เป็นภาษาอังกฤษเท่านั้น",
    ],
    correctIndex: 1,
    coachHint: "discovery + context",
    explain: "Hashtag ช่วย discovery และสื่อธีมของแคมเปญ",
  },
  {
    kind: "mcq",
    prompt: "CTA (Call-to-Action) ที่ดีควรทำให้ผู้อ่านรู้สึกอย่างไร?",
    options: [
      "สับสนว่าจะทำอะไร",
      "รู้ชัดว่าต้องกด/สั่ง/ติดตามขั้นตอนถัดไป",
      "หลีกเลี่ยงการขายของ",
      "ปิดการแสดงความคิดเห็น",
    ],
    correctIndex: 1,
    coachHint: "ชัดเจน สั้น กระตุ้นการกระทำ",
    explain:
      "CTA บอกขั้นตอนถัดไป เช่น กดสั่ง ลองชิม ติดตาม",
  },
];
