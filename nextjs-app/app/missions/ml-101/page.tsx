"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

type Phase = "briefing" | "challenge" | "result" | "complete";
type ChallengeState = "input" | "evaluating" | "scored";
type Tier = "S" | "A" | "B" | "C" | "D";

const MISSION = { code: "M-002", title: "MACHINE LEARNING 101", icon: "⚙️", xpPerChallenge: 50, credits: 40, difficulty: "EASY" };

const NPC_DIALOGUE = [
  { speaker: "DR. ALGO", mood: "👨‍🔬", text: "สวัสดี AGENT_001! ฉัน Dr. Algo ผู้เชี่ยวชาญ Machine Learning ยินดีต้อนรับสู่ M-002!", sub: "EXPERT_MODULE ONLINE" },
  { speaker: "DR. ALGO", mood: "👨‍🔬", text: "วันนี้แต่ละคำถามมี 3 ส่วน: ส่วน 1 = ตัวอย่างชีวิตจริง | ส่วน 2 = นิยามเทคนิค | ส่วน 3 = Bonus คิดเพิ่ม", sub: "FORMAT_LOADED" },
  { speaker: "DR. ALGO", mood: "👨‍🔬", text: "เขียนสั้นก็ได้ ขอแค่เข้าใจ! ยิ่งเพิ่มคำเทคนิคและตัวอย่างที่ดี ยิ่งได้ XP เยอะ 🔥", sub: "READY TO TRAIN" },
];

interface Part {
  label: string;
  icon: string;
  color: string;
  prompt: string;
  hint: string;
  minChars: number;
  keywords: string[];
  optional?: boolean;
}

interface Challenge {
  id: number;
  concept: string;
  icon: string;
  parts: [Part, Part, Part];
  feedbacks: Record<Tier, string>;
}

const CHALLENGES: Challenge[] = [
  {
    id: 1,
    concept: "Machine Learning คืออะไร?",
    icon: "🤖",
    parts: [
      {
        label: "ตัวอย่างชีวิตจริง",
        icon: "🌍",
        color: "#facc15",
        prompt: "เปรียบ Machine Learning กับการเรียนรู้ของคนหรือสัตว์",
        hint: "เช่น: ML เหมือนกุ๊กที่ลองผิดลองถูกจนหาสูตรที่อร่อย โดยไม่มีใครบอกสูตรตายตัว...",
        minChars: 20,
        keywords: ["เหมือน", "เปรียบ", "เช่น", "ลอง", "ผิด", "ถูก", "ฝึก", "ซ้ำ", "ปรับ", "เรียน", "กุ๊ก", "อาหาร", "นักกีฬา", "เด็ก"],
      },
      {
        label: "นิยามทางเทคนิค",
        icon: "⚙️",
        color: "#fb923c",
        prompt: "ML คืออะไร และต่างจากโปรแกรม if-else ทั่วไปอย่างไร?",
        hint: "เช่น: ML คือ subset ของ AI ที่ให้คอมพิวเตอร์หา pattern จาก data โดยไม่ต้องเขียนกฎทุกอย่างเอง...",
        minChars: 20,
        keywords: ["machine learning", "training", "data", "ข้อมูล", "model", "pattern", "algorithm", "subset", "ai", "ทำนาย", "if-else", "เรียนรู้", "dataset"],
      },
      {
        label: "ความคิดของคุณ",
        icon: "💡",
        color: "#fde047",
        prompt: "ML ถูกใช้อยู่ในแอปที่คุณใช้ทุกวัน ยกตัวอย่างหนึ่ง",
        hint: "เช่น: Spotify แนะนำเพลงที่ชอบ, Gmail กรอง spam, Instagram เลือก feed ที่เหมาะกับคุณ...",
        minChars: 15,
        keywords: ["spotify", "netflix", "gmail", "spam", "instagram", "youtube", "tiktok", "แนะนำ", "เลือก", "กรอง", "feed", "recommendation"],
        optional: true,
      },
    ],
    feedbacks: {
      S: "ยอดเยี่ยม! ตัวอย่างสร้างสรรค์และอธิบาย ML ทางเทคนิคได้ถูกต้องสมบูรณ์ คุณเป็น ML Communicator ตัวจริง! 🔥",
      A: "ดีมาก! ตัวอย่างเข้าใจง่าย และนิยามเทคนิคถูกต้อง ลองเพิ่ม training data หรือ model ให้ครบขึ้น ⭐",
      B: "ดี! เข้าใจหลักการพื้นฐาน ลองอธิบายว่า ML ต่างจากโปรแกรมธรรมดาอย่างไรในส่วนที่ 2 💪",
      C: "เริ่มต้นได้ ลองเพิ่มรายละเอียดในส่วนที่ 2 เช่น คำว่า data, pattern, หรือ model 🔧",
      D: "นึกถึงตอนฝึกทักษะซ้ำๆ จนชำนาญ — ML ก็เรียนรู้แบบนั้นจาก data แล้วเขียนอธิบาย 📚",
    },
  },
  {
    id: 2,
    concept: "Overfitting คืออะไร?",
    icon: "📊",
    parts: [
      {
        label: "ตัวอย่างชีวิตจริง",
        icon: "🌍",
        color: "#facc15",
        prompt: "เปรียบ Overfitting กับนักเรียนที่ท่องจำแทนที่จะเข้าใจจริง",
        hint: "เช่น: Overfitting เหมือนนักเรียนที่จำเฉลยข้อสอบเก่าได้หมด แต่พอเจอโจทย์ใหม่กลับทำไม่ได้...",
        minChars: 20,
        keywords: ["เหมือน", "เปรียบ", "เช่น", "นักเรียน", "ท่องจำ", "จำ", "สอบ", "ข้อสอบ", "ใหม่", "ไม่ได้", "เข้าใจ", "หลักการ"],
      },
      {
        label: "นิยามทางเทคนิค",
        icon: "⚙️",
        color: "#fb923c",
        prompt: "Overfitting เกิดขึ้นเมื่อไหร่ และมีผลอย่างไรต่อ model?",
        hint: "เช่น: Overfitting เกิดเมื่อ model เรียนรู้ training data มากเกินไปรวมทั้ง noise จนไม่สามารถ generalize ได้...",
        minChars: 20,
        keywords: ["overfitting", "training", "generalize", "model", "noise", "data", "regularization", "dropout", "validation", "accuracy", "underfitting"],
      },
      {
        label: "ความคิดของคุณ",
        icon: "💡",
        color: "#fde047",
        prompt: "คิดว่าแก้ Overfitting ได้อย่างไร?",
        hint: "เช่น: เพิ่มข้อมูล training ให้หลากหลาย, ใช้ dropout, หรือ regularization เพื่อให้ model ไม่จำมากเกินไป...",
        minChars: 15,
        keywords: ["regularization", "dropout", "data", "เพิ่ม", "หลากหลาย", "cross-validation", "validation", "early stopping", "test", "แก้"],
        optional: true,
      },
    ],
    feedbacks: {
      S: "ยอดมาก! Analogy สมจริง และอธิบาย Overfitting + วิธีแก้ได้ครบถ้วนมาก 🏆",
      A: "อธิบายได้ดีมาก! เข้าใจ Overfitting ทั้งเชิงเปรียบเทียบและเทคนิคได้ถูกต้อง ⭐",
      B: "ดี! ลองเพิ่มวิธีแก้ Overfitting เช่น regularization หรือการเพิ่ม data ในส่วน Bonus 💪",
      C: "เข้าใจ concept ลองอธิบายว่า Overfitting ส่งผลต่อการทำงาน model อย่างไรให้ชัดขึ้น 🔧",
      D: "Overfitting = จำแต่ไม่เข้าใจ ลองเขียนตัวอย่างนักเรียนท่องจำแล้วเชื่อมกับ ML 📚",
    },
  },
  {
    id: 3,
    concept: "Supervised vs Unsupervised",
    icon: "🏷️",
    parts: [
      {
        label: "ตัวอย่างชีวิตจริง",
        icon: "🌍",
        color: "#facc15",
        prompt: "เปรียบ Supervised Learning กับการสอนที่มีครู และ Unsupervised กับการเรียนรู้เอง",
        hint: "เช่น: Supervised เหมือนครูบอกว่านี่คือหมา นี่คือแมว — Unsupervised เหมือนเด็กที่จัดกลุ่มสัตว์เองโดยไม่มีใครบอก...",
        minChars: 20,
        keywords: ["เหมือน", "เปรียบ", "เช่น", "ครู", "สอน", "บอก", "กลุ่ม", "จัดกลุ่ม", "เด็ก", "เอง", "อิสระ", "แยก", "หมวด"],
      },
      {
        label: "นิยามทางเทคนิค",
        icon: "⚙️",
        color: "#fb923c",
        prompt: "Supervised และ Unsupervised Learning ต่างกันอย่างไรในแง่เทคนิค?",
        hint: "เช่น: Supervised ใช้ labeled data เรียนรู้ mapping จาก input → output เช่น Linear Regression — Unsupervised ใช้ unlabeled data หา pattern เช่น K-Means...",
        minChars: 20,
        keywords: ["supervised", "unsupervised", "labeled", "unlabeled", "classification", "regression", "clustering", "k-means", "svm", "pca", "label", "pattern", "output", "input"],
      },
      {
        label: "ความคิดของคุณ",
        icon: "💡",
        color: "#fde047",
        prompt: "ยกตัวอย่างการใช้งาน Supervised หรือ Unsupervised ในชีวิตจริง",
        hint: "เช่น: Supervised — ตรวจอีเมล spam หรือวินิจฉัยโรค | Unsupervised — จัดกลุ่มลูกค้า หรือค้นหา anomaly...",
        minChars: 15,
        keywords: ["spam", "โรค", "ลูกค้า", "customer", "anomaly", "กลุ่ม", "วินิจฉัย", "ตรวจ", "แนะนำ", "recommendation", "segment"],
        optional: true,
      },
    ],
    feedbacks: {
      S: "ยอดเยี่ยม! ตัวอย่างทำให้เข้าใจความแตกต่างได้ทันที และรู้จัก algorithm ที่เกี่ยวข้องได้ครบถ้วน 🔥",
      A: "ดีมาก! ตัวอย่างชัดเจน และรู้จัก labeled/unlabeled data ได้ถูกต้อง ⭐",
      B: "ดี! ลองเพิ่มชื่อ algorithm เช่น K-Means หรือ SVM เพื่อให้ส่วนที่ 2 สมบูรณ์ขึ้น 💪",
      C: "เข้าใจความแตกต่างพื้นฐาน ลองเพิ่ม labeled vs unlabeled data ในคำอธิบาย 🔧",
      D: "Supervised = มีครูบอก (มี label) / Unsupervised = เรียนรู้เอง (ไม่มี label) เริ่มจากตรงนี้แล้วขยายความ 📚",
    },
  },
];

interface ScoreResult {
  creativity: number; technical: number; clarity: number; teaching: number;
  total: number; tier: Tier; xpEarned: number; feedback: string;
}

function evaluate(parts: string[], ch: Challenge, baseXP: number): ScoreResult {
  const [p1, p2, p3] = parts.map(p => p.toLowerCase());
  const teachWords = ["เช่น", "เหมือน", "เปรียบ", "คือ", "ทำให้", "เพราะ", "ตัวอย่าง", "นั่นคือ"];

  const cHits = ch.parts[0].keywords.filter(k => p1.includes(k)).length;
  const creativity = Math.min(100, 22 + cHits * 14 + Math.min(26, Math.floor(parts[0].length / 4)));

  const tHits = ch.parts[1].keywords.filter(k => p2.includes(k)).length;
  const technical = Math.min(100, 18 + tHits * 18 + Math.min(22, Math.floor(parts[1].length / 5)));

  const totalLen = parts[0].length + parts[1].length + (parts[2]?.length ?? 0);
  const clarity = Math.min(100, 18 + Math.min(40, Math.floor(totalLen / 5))
    + (parts[0].length >= 20 ? 14 : 0) + (parts[1].length >= 20 ? 14 : 0));

  const p3Hits = p3 ? ch.parts[2].keywords.filter(k => p3.includes(k)).length : 0;
  const teachHits = teachWords.filter(k => (p1 + " " + p2).includes(k)).length;
  const teaching = Math.min(100, 20 + teachHits * 10 + p3Hits * 12
    + (p3 && parts[2].length >= 15 ? 18 : 0)
    + Math.min(16, Math.floor(totalLen / 12)));

  const total = Math.round((creativity + technical + clarity + teaching) / 4);
  const tier: Tier = total >= 88 ? "S" : total >= 73 ? "A" : total >= 55 ? "B" : total >= 35 ? "C" : "D";
  const mult = { S: 1.0, A: 0.85, B: 0.65, C: 0.45, D: 0.25 }[tier];
  return { creativity, technical, clarity, teaching, total, tier, xpEarned: Math.round(baseXP * mult), feedback: ch.feedbacks[tier] };
}

const TIER_CFG: Record<Tier, { color: string; label: string }> = {
  S: { color: "#fde047", label: "LEGENDARY" }, A: { color: "#00f5ff", label: "EXPERT" },
  B: { color: "#4ade80", label: "ADVANCED" }, C: { color: "#fb923c", label: "LEARNER" },
  D: { color: "#f87171", label: "NOVICE" },
};

const SCORE_BARS = [
  { key: "creativity" as const, label: "CREATIVITY",         color: "#f472b6", icon: "✦" },
  { key: "technical"  as const, label: "TECHNICAL ACCURACY", color: "#facc15", icon: "◈" },
  { key: "clarity"    as const, label: "CLARITY",            color: "#4ade80", icon: "◉" },
  { key: "teaching"   as const, label: "TEACHING SKILL",     color: "#fb923c", icon: "★" },
];

function useTypewriter(text: string, speed = 26) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed(""); setDone(false);
    let i = 0;
    const iv = setInterval(() => { i++; setDisplayed(text.slice(0, i)); if (i >= text.length) { clearInterval(iv); setDone(true); } }, speed);
    return () => clearInterval(iv);
  }, [text, speed]);
  return { displayed, done };
}

function DialogueBox({ d, onNext, idx, total }: { d: (typeof NPC_DIALOGUE)[0]; onNext: () => void; idx: number; total: number }) {
  const { displayed, done } = useTypewriter(d.text);
  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-lg mx-auto">
      <div className="relative">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl" style={{ animation: "float 4s ease-in-out infinite", background: "linear-gradient(135deg,rgba(250,204,21,0.18),rgba(249,115,22,0.12))", border: "2px solid rgba(250,204,21,0.45)" }}>
          {d.mood}
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#050510] border border-yellow-500/40 whitespace-nowrap">
          <span className="text-xs font-bold text-yellow-400 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>{d.speaker}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 inline-block" style={{ animation: "glowPulse 2s infinite" }} />
        <span className="text-xs tracking-widest text-yellow-500/80" style={{ fontFamily: "var(--font-mono)" }}>{d.sub}</span>
      </div>
      <div className="w-full glass-card rounded-2xl p-5 border border-yellow-500/15 min-h-[88px]">
        <p className="text-white text-sm sm:text-base leading-relaxed text-center">
          {displayed}{!done && <span className="inline-block w-0.5 h-4 bg-yellow-400 ml-1 align-middle" style={{ animation: "pulse 1s infinite" }} />}
        </p>
      </div>
      <div className="flex gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className="h-2 rounded-full transition-all duration-300" style={{ width: i === idx ? 24 : 8, background: i === idx ? "#facc15" : i < idx ? "rgba(250,204,21,0.4)" : "#374151" }} />
        ))}
      </div>
      <button onClick={onNext} className="btn-neon-cyan px-8 py-3 text-xs font-bold tracking-widest rounded-xl w-full sm:w-auto" style={{ fontFamily: "var(--font-orbitron)" }}>
        {idx < total - 1 ? "NEXT ▶" : "เริ่มฝึก ▶"}
      </button>
    </div>
  );
}

function ScoreBar({ label, value, color, icon, delay = 0, show }: { label: string; value: number; color: string; icon: string; delay?: number; show: boolean }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => setW(value), delay + 60);
    return () => clearTimeout(t);
  }, [value, delay, show]);
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs tracking-widest font-bold flex items-center gap-1.5" style={{ fontFamily: "var(--font-mono)", color }}>
          <span>{icon}</span>{label}
        </span>
        <span className="text-xs font-black" style={{ color, fontFamily: "var(--font-orbitron)" }}>{w}%</span>
      </div>
      <div className="h-2.5 bg-gray-800/80 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${w}%`, background: `linear-gradient(90deg, ${color}88, ${color})`, boxShadow: `0 0 8px ${color}60` }} />
      </div>
    </div>
  );
}

function ChallengeCard({ ch, cIdx, total, onComplete }: { ch: Challenge; cIdx: number; total: number; onComplete: (xp: number) => void }) {
  const [vals, setVals] = useState(["", "", ""]);
  const [state, setState] = useState<ChallengeState>("input");
  const [evalStep, setEvalStep] = useState(0);
  const [result, setResult] = useState<ScoreResult | null>(null);

  const canSubmit = vals[0].trim().length >= ch.parts[0].minChars && vals[1].trim().length >= ch.parts[1].minChars;

  function handleSubmit() {
    if (!canSubmit) return;
    const r = evaluate(vals, ch, MISSION.xpPerChallenge);
    setResult(r);
    setState("evaluating");
    [400, 1100, 1800, 2500].forEach((ms, i) => setTimeout(() => setEvalStep(i + 1), ms));
    setTimeout(() => setState("scored"), 3000);
  }

  if (state === "evaluating") {
    return (
      <div className="w-full max-w-lg mx-auto">
        <div className="glass-card rounded-2xl p-6 border border-yellow-500/20 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" style={{ animation: "glowPulse 1s infinite" }} />
            <span className="text-xs tracking-widest text-yellow-400" style={{ fontFamily: "var(--font-mono)" }}>// AI_ANALYSIS_RUNNING...</span>
          </div>
          {evalStep >= 1 && <div><p className="text-xs text-pink-400/70 mb-2" style={{ fontFamily: "var(--font-mono)" }}>◈ SCANNING ANALOGY...</p><ScoreBar label="CREATIVITY" value={result?.creativity ?? 0} color="#f472b6" icon="✦" show /></div>}
          {evalStep >= 2 && <div><p className="text-xs text-yellow-400/70 mb-2 mt-3" style={{ fontFamily: "var(--font-mono)" }}>◈ CHECKING TECHNICAL TERMS...</p><ScoreBar label="TECHNICAL ACCURACY" value={result?.technical ?? 0} color="#facc15" icon="◈" show delay={60} /></div>}
          {evalStep >= 3 && <div><p className="text-xs text-green-400/70 mb-2 mt-3" style={{ fontFamily: "var(--font-mono)" }}>◈ MEASURING CLARITY...</p><ScoreBar label="CLARITY" value={result?.clarity ?? 0} color="#4ade80" icon="◉" show delay={60} /></div>}
          {evalStep >= 4 && <div><p className="text-xs text-orange-400/70 mb-2 mt-3" style={{ fontFamily: "var(--font-mono)" }}>◈ EVALUATING TEACHING SKILL...</p><ScoreBar label="TEACHING SKILL" value={result?.teaching ?? 0} color="#fb923c" icon="★" show delay={60} /></div>}
        </div>
      </div>
    );
  }

  if (state === "scored" && result) {
    const tc = TIER_CFG[result.tier];
    return (
      <div className="w-full max-w-lg mx-auto space-y-4">
        <div className="glass-card rounded-2xl p-5 border border-yellow-500/15 space-y-3">
          <p className="text-xs text-gray-500 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>// ANALYSIS_COMPLETE</p>
          <div className="space-y-3">{SCORE_BARS.map(bar => <ScoreBar key={bar.key} label={bar.label} value={result[bar.key]} color={bar.color} icon={bar.icon} show />)}</div>
          <div className="border-t border-gray-800 pt-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl font-black" style={{ fontFamily: "var(--font-orbitron)", color: tc.color, filter: `drop-shadow(0 0 12px ${tc.color})` }}>{result.tier}</div>
              <div>
                <p className="text-xs text-gray-500" style={{ fontFamily: "var(--font-mono)" }}>GRADE</p>
                <p className="text-xs font-bold" style={{ color: tc.color, fontFamily: "var(--font-mono)" }}>{tc.label}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-0.5" style={{ fontFamily: "var(--font-mono)" }}>XP EARNED</p>
              <p className="text-2xl font-black text-yellow-400" style={{ fontFamily: "var(--font-orbitron)" }}>+{result.xpEarned}</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4" style={{ borderColor: `${tc.color}30`, borderWidth: 1, borderStyle: "solid" }}>
          <p className="text-xs tracking-widest mb-2" style={{ fontFamily: "var(--font-mono)", color: tc.color }}>◈ AI_FEEDBACK</p>
          <p className="text-sm text-gray-300 leading-relaxed">{result.feedback}</p>
        </div>
        <button onClick={() => onComplete(result.xpEarned)} className="w-full btn-neon-pink py-4 text-xs font-bold tracking-widest rounded-xl" style={{ fontFamily: "var(--font-orbitron)" }}>
          {cIdx < total - 1 ? "คำถามถัดไป ▶" : "เสร็จสิ้นภารกิจ ▶"}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto space-y-3">
      <div className="glass-card rounded-xl p-4 border border-yellow-500/15">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>คำถาม {cIdx + 1}/{total}</span>
          <span className="text-xs text-yellow-400 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>● 3-PART MODE</span>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden mb-3">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${((cIdx + 1) / total) * 100}%`, background: "linear-gradient(90deg, #facc15, #fb923c)" }} />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{ch.icon}</span>
          <div>
            <p className="text-xs text-gray-500 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>CONCEPT</p>
            <p className="text-sm font-black text-white" style={{ fontFamily: "var(--font-orbitron)" }}>{ch.concept}</p>
          </div>
        </div>
      </div>

      {ch.parts.map((part, i) => (
        <div key={i} className="glass-card rounded-2xl overflow-hidden" style={{ borderColor: `${part.color}${part.optional ? "22" : "30"}`, borderWidth: 1, borderStyle: "solid" }}>
          <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: `${part.color}08`, borderBottom: `1px solid ${part.color}14` }}>
            <div className="flex items-center gap-2">
              <span className="text-base">{part.icon}</span>
              <span className="text-xs font-black tracking-widest" style={{ color: part.color, fontFamily: "var(--font-mono)" }}>
                ส่วนที่ {i + 1}{part.optional ? " — BONUS" : ""}
              </span>
              <span className="text-xs text-gray-500 hidden sm:inline" style={{ fontFamily: "var(--font-mono)" }}>{part.label}</span>
            </div>
            <span className={`text-xs tracking-widest ${vals[i].length >= part.minChars ? "text-green-400" : "text-gray-600"}`} style={{ fontFamily: "var(--font-mono)" }}>
              {vals[i].length}{part.optional ? "" : `/${part.minChars}✓`}
            </span>
          </div>
          <div className="px-4 py-3">
            <p className="text-xs mb-2 leading-relaxed font-bold" style={{ color: part.color }}>
              {part.optional ? "🎁 " : ""}{part.prompt}
            </p>
            <textarea
              value={vals[i]}
              onChange={e => setVals(prev => { const n = [...prev]; n[i] = e.target.value; return n; })}
              rows={3}
              placeholder={part.hint}
              className="w-full bg-transparent text-sm text-gray-200 placeholder-gray-700 resize-none outline-none leading-relaxed"
              style={{ fontFamily: "var(--font-mono)" }}
            />
          </div>
        </div>
      ))}

      <button onClick={handleSubmit} disabled={!canSubmit}
        className={`w-full py-4 text-xs font-bold tracking-widest rounded-xl transition-all ${canSubmit ? "btn-neon-pink" : "border border-gray-800 text-gray-700 cursor-not-allowed"}`}
        style={{ fontFamily: "var(--font-orbitron)" }}>
        {canSubmit
          ? "▶ ส่งให้ AI ประเมิน"
          : `เขียนเพิ่มอีก (ส่วน 1: ${Math.max(0, ch.parts[0].minChars - vals[0].trim().length)} | ส่วน 2: ${Math.max(0, ch.parts[1].minChars - vals[1].trim().length)} ตัวอักษร)`}
      </button>
    </div>
  );
}

function ResultScreen({ totalXP, onClaim }: { totalXP: number; onClaim: () => void }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 80); }, []);
  const maxXP = MISSION.xpPerChallenge * CHALLENGES.length;
  const pct = Math.min(100, Math.round((totalXP / maxXP) * 100));
  return (
    <div className={`w-full max-w-lg mx-auto space-y-4 transition-all duration-500 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
      <div className="glass-card rounded-2xl p-6 border border-yellow-500/15 text-center">
        <p className="text-xs text-gray-500 tracking-widest mb-3" style={{ fontFamily: "var(--font-mono)" }}>// ทุกคำถามเสร็จสิ้น</p>
        <div className="relative w-28 h-28 mx-auto mb-4">
          <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <circle cx="50" cy="50" r="40" fill="none" stroke={pct >= 75 ? "#facc15" : pct >= 50 ? "#4ade80" : "#fb923c"}
              strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(pct / 100) * 251} 251`}
              style={{ transition: "stroke-dasharray 1.4s ease", filter: "drop-shadow(0 0 6px currentColor)" }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-orbitron)" }}>{pct}%</p>
            <p className="text-xs text-gray-500" style={{ fontFamily: "var(--font-mono)" }}>SCORE</p>
          </div>
        </div>
        <p className="text-lg font-black text-white" style={{ fontFamily: "var(--font-orbitron)" }}>
          {pct >= 88 ? "LEGENDARY!" : pct >= 73 ? "EXPERT!" : pct >= 55 ? "ADVANCED!" : "KEEP GOING!"}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card rounded-xl p-4 border border-yellow-500/20 text-center">
          <p className="text-2xl mb-1">⚡</p>
          <p className="text-xl font-black text-yellow-400" style={{ fontFamily: "var(--font-orbitron)" }}>+{totalXP}</p>
          <p className="text-xs text-gray-500 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>XP EARNED</p>
        </div>
        <div className="glass-card rounded-xl p-4 border border-orange-500/20 text-center">
          <p className="text-2xl mb-1">💎</p>
          <p className="text-xl font-black text-orange-400" style={{ fontFamily: "var(--font-orbitron)" }}>+{Math.round(totalXP * 0.2)}</p>
          <p className="text-xs text-gray-500 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>CREDITS</p>
        </div>
      </div>
      <button onClick={onClaim} className="w-full btn-neon-pink py-4 text-sm font-bold tracking-widest rounded-xl" style={{ fontFamily: "var(--font-orbitron)" }}>▶ รับรางวัล</button>
    </div>
  );
}

function CompleteScreen({ totalXP }: { totalXP: number }) {
  return (
    <div className="w-full max-w-lg mx-auto text-center space-y-6">
      <p className="text-xs tracking-widest text-yellow-400" style={{ fontFamily: "var(--font-mono)" }}>// MISSION_DEBRIEF</p>
      <h2 className="text-3xl font-black" style={{ fontFamily: "var(--font-orbitron)" }}>
        <span className="neon-text-cyan">MISSION</span><br /><span className="neon-text-pink">ACCOMPLISHED</span>
      </h2>
      <p className="text-gray-400 text-sm leading-relaxed">คุณสำเร็จภารกิจ <span className="text-white font-bold">ML 101</span> แล้ว — ตอนนี้คุณเข้าใจ Machine Learning พื้นฐานแล้ว!</p>
      <div className="glass-card rounded-2xl p-5 text-left space-y-3">
        <p className="text-xs font-bold tracking-widest text-gray-400 mb-3" style={{ fontFamily: "var(--font-orbitron)" }}>SKILLS ACQUIRED:</p>
        {[
          { icon: "⚙️", skill: "ML Fundamentals", desc: "รู้จัก Machine Learning และวิธีที่มันเรียนรู้" },
          { icon: "📊", skill: "Overfitting Awareness", desc: "เข้าใจปัญหา Overfitting และวิธีแก้" },
          { icon: "🏷️", skill: "Algorithm Types", desc: "แยกแยะ Supervised vs Unsupervised ได้" },
        ].map(item => (
          <div key={item.skill} className="flex items-start gap-3 p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/10">
            <span className="text-lg shrink-0">{item.icon}</span>
            <div>
              <p className="text-xs font-bold text-white mb-0.5" style={{ fontFamily: "var(--font-orbitron)" }}>{item.skill}</p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <Link href="/dashboard" className="btn-neon-cyan py-3 text-xs font-bold tracking-widest rounded-xl text-center" style={{ fontFamily: "var(--font-orbitron)" }}>← กลับ HQ</Link>
        <Link href="/missions/neural-network" className="btn-neon-pink py-3 text-xs font-bold tracking-widest rounded-xl text-center" style={{ fontFamily: "var(--font-orbitron)" }}>ภารกิจถัดไป: Neural Network →</Link>
      </div>
    </div>
  );
}

export default function ML101MissionPage() {
  const [phase, setPhase] = useState<Phase>("briefing");
  const [dlgIdx, setDlgIdx] = useState(0);
  const [cIdx, setCIdx] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [showReward, setShowReward] = useState(false);

  function handleNextDlg() {
    if (dlgIdx < NPC_DIALOGUE.length - 1) setDlgIdx(i => i + 1);
    else setPhase("challenge");
  }

  function handleChallengeComplete(xp: number) {
    setTotalXP(t => t + xp);
    if (cIdx < CHALLENGES.length - 1) setCIdx(i => i + 1);
    else setPhase("result");
  }

  return (
    <div className="min-h-screen bg-[#050510] cyber-grid">
      <Navbar />
      {showReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass-card rounded-3xl p-8 max-w-sm w-full text-center border border-yellow-500/30" style={{ boxShadow: "0 0 60px rgba(250,204,21,0.2)" }}>
            <p className="text-6xl mb-4" style={{ animation: "float 3s ease-in-out infinite" }}>⚙️</p>
            <p className="text-xs tracking-widest text-yellow-400 mb-2" style={{ fontFamily: "var(--font-mono)" }}>MISSION COMPLETE!</p>
            <p className="text-2xl font-black text-white mb-5" style={{ fontFamily: "var(--font-orbitron)" }}>ML 101<br /><span className="neon-text-pink">CLEARED</span></p>
            <div className="space-y-3 mb-5">
              <div className="flex justify-between p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <span className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-orbitron)" }}>⚡ XP EARNED</span>
                <span className="text-xl font-black text-yellow-400" style={{ fontFamily: "var(--font-orbitron)" }}>+{totalXP}</span>
              </div>
            </div>
            <button onClick={() => { setShowReward(false); setPhase("complete"); }} className="w-full btn-neon-pink py-3 text-sm font-bold tracking-widest rounded-xl" style={{ fontFamily: "var(--font-orbitron)" }}>▶ ต่อไป</button>
          </div>
        </div>
      )}
      <div className="pt-20 pb-12 px-4">
        <div className="max-w-lg mx-auto mb-6">
          <div className="glass-card rounded-2xl p-4 border border-yellow-500/15">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center text-xl">{MISSION.icon}</div>
                <div>
                  <p className="text-xs text-yellow-400 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>{MISSION.code} • {MISSION.difficulty}</p>
                  <p className="text-sm font-black text-white" style={{ fontFamily: "var(--font-orbitron)" }}>{MISSION.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs" style={{ fontFamily: "var(--font-mono)" }}>
                <span className="text-yellow-400">⚡ {MISSION.xpPerChallenge * CHALLENGES.length} XP</span>
                <span className={`px-2 py-1 rounded-lg tracking-widest ${phase === "briefing" ? "bg-gray-800 text-gray-500" : phase === "challenge" ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30" : phase === "result" ? "bg-pink-500/15 text-pink-400 border border-pink-500/30" : "bg-green-500/15 text-green-400 border border-green-500/30"}`}>
                  {phase === "briefing" && "BRIEFING"}
                  {phase === "challenge" && `● Q${cIdx + 1}/${CHALLENGES.length}`}
                  {phase === "result" && "RESULTS"}
                  {phase === "complete" && "✓ DONE"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          {phase === "briefing" && <div className="w-full flex flex-col items-center justify-center min-h-[60vh]"><DialogueBox d={NPC_DIALOGUE[dlgIdx]} onNext={handleNextDlg} idx={dlgIdx} total={NPC_DIALOGUE.length} /></div>}
          {phase === "challenge" && <ChallengeCard key={cIdx} ch={CHALLENGES[cIdx]} cIdx={cIdx} total={CHALLENGES.length} onComplete={handleChallengeComplete} />}
          {phase === "result" && <ResultScreen totalXP={totalXP} onClaim={() => setShowReward(true)} />}
          {phase === "complete" && <CompleteScreen totalXP={totalXP} />}
        </div>
      </div>
    </div>
  );
}
