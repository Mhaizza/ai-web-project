"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

type Phase = "briefing" | "challenge" | "result" | "complete";
type ChallengeState = "input" | "evaluating" | "scored";
type Tier = "S" | "A" | "B" | "C" | "D";

const MISSION = { code: "M-003", title: "NEURAL NETWORK", icon: "🧬", xpPerChallenge: 60, credits: 50, difficulty: "MEDIUM" };

const NPC_DIALOGUE = [
  { speaker: "SYNAPSE", mood: "🧬", text: "สวัสดี AGENT_001! ฉัน SYNAPSE ผู้นำทางด้าน Neural Network — พร้อมดำดิ่งสู่โลก Deep Learning แล้วหรือยัง?", sub: "NEURAL_CORE ONLINE" },
  { speaker: "SYNAPSE", mood: "🧬", text: "แต่ละคำถามมี 3 ส่วน: ส่วน 1 = เปรียบกับชีวิตจริง | ส่วน 2 = อธิบายเชิงเทคนิค | ส่วน 3 = Bonus ความคิดของคุณ", sub: "FORMAT_READY" },
  { speaker: "SYNAPSE", mood: "🧬", text: "ตอบสั้นก็ได้ ไม่ต้องกลัว แค่เขียนด้วยความเข้าใจของตัวเอง — นั่นคือ สิ่งที่ดีที่สุด!", sub: "BEGIN_TRANSMISSION" },
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
    concept: "Neural Network คืออะไร?",
    icon: "🧠",
    parts: [
      {
        label: "ตัวอย่างชีวิตจริง",
        icon: "🌍",
        color: "#c084fc",
        prompt: "เปรียบ Neural Network กับสมองหรือเส้นประสาทของคนหรือสัตว์",
        hint: "เช่น: Neural Network เหมือนสมองที่มีเซลล์ประสาทเชื่อมกันล้านๆ เซลล์ แต่ละเซลล์รับสัญญาณแล้วส่งต่อ...",
        minChars: 20,
        keywords: ["เหมือน", "เปรียบ", "เช่น", "สมอง", "เซลล์", "ประสาท", "เชื่อม", "รับ", "ส่ง", "โหนด", "เครือข่าย", "ชั้น", "layer"],
      },
      {
        label: "นิยามทางเทคนิค",
        icon: "⚙️",
        color: "#e879f9",
        prompt: "Neural Network ทำงานอย่างไรในแง่คอมพิวเตอร์?",
        hint: "เช่น: Neural Network ประกอบด้วย node หลายชั้น (layer) — input layer รับข้อมูล hidden layer ประมวลผล output layer แสดงผล...",
        minChars: 20,
        keywords: ["neural network", "node", "layer", "input", "output", "hidden", "weight", "bias", "activation", "neuron", "deep learning", "ชั้น", "ประมวลผล"],
      },
      {
        label: "ความคิดของคุณ",
        icon: "💡",
        color: "#fde047",
        prompt: "ยกตัวอย่างว่า Neural Network ถูกใช้ทำอะไรในชีวิตจริง",
        hint: "เช่น: รู้จำใบหน้า, แปลภาษา, ตรวจโรคจาก X-ray, สร้างรูปภาพ AI, ขับรถอัตโนมัติ...",
        minChars: 15,
        keywords: ["ใบหน้า", "แปล", "ภาษา", "โรค", "รูปภาพ", "ขับ", "รถ", "เสียง", "speech", "image", "face", "recognition", "detection", "translate"],
        optional: true,
      },
    ],
    feedbacks: {
      S: "ยอดเยี่ยม! เปรียบ Neural Network ได้สร้างสรรค์มาก และอธิบายโครงสร้างทางเทคนิคได้ถูกต้องสมบูรณ์ 🔥",
      A: "ดีมาก! ตัวอย่างสมองชัดเจน และเข้าใจ layer ใน Neural Network ได้ถูกต้อง ⭐",
      B: "ดี! ลองเพิ่มคำเทคนิคในส่วนที่ 2 เช่น input/output layer หรือ hidden layer 💪",
      C: "เริ่มต้นได้ ลองอธิบายว่า Neural Network มีส่วนประกอบอะไรบ้างในส่วนที่ 2 ให้ชัดขึ้น 🔧",
      D: "นึกถึงสมองคน — มีเซลล์ประสาทเชื่อมกัน Neural Network ก็เหมือนกัน มี node เชื่อมกันเป็นชั้นๆ 📚",
    },
  },
  {
    id: 2,
    concept: "Activation Function คืออะไร?",
    icon: "⚡",
    parts: [
      {
        label: "ตัวอย่างชีวิตจริง",
        icon: "🌍",
        color: "#c084fc",
        prompt: "เปรียบ Activation Function กับการตัดสินใจที่มีเงื่อนไข เช่น สวิตช์หรือสัญญาณไฟ",
        hint: "เช่น: Activation Function เหมือนสวิตช์ไฟ — ถ้าสัญญาณแรงพอก็เปิด ถ้าไม่ถึงก็ปิด ทำให้ Neural Network เรียนรู้แบบซับซ้อนได้...",
        minChars: 20,
        keywords: ["เหมือน", "เปรียบ", "เช่น", "สวิตช์", "ไฟ", "เปิด", "ปิด", "เงื่อนไข", "ถ้า", "สัญญาณ", "กรอง", "ตัดสินใจ", "เกณฑ์"],
      },
      {
        label: "นิยามทางเทคนิค",
        icon: "⚙️",
        color: "#e879f9",
        prompt: "Activation Function ทำหน้าที่อะไรใน Neural Network?",
        hint: "เช่น: Activation Function เพิ่ม non-linearity ให้ network เรียนรู้ pattern ซับซ้อนได้ เช่น ReLU (f(x)=max(0,x)), Sigmoid, Softmax...",
        minChars: 20,
        keywords: ["activation", "relu", "sigmoid", "softmax", "tanh", "non-linear", "linearity", "output", "neuron", "threshold", "function", "ฟังก์ชัน", "ประมวลผล"],
      },
      {
        label: "ความคิดของคุณ",
        icon: "💡",
        color: "#fde047",
        prompt: "ทำไมถ้าไม่มี Activation Function Neural Network จะไม่สามารถเรียนรู้ได้?",
        hint: "เช่น: ถ้าไม่มี activation function ทุก layer จะรวมกันเป็นแค่สมการเส้นตรง ซึ่งแก้ปัญหาซับซ้อนอย่าง image recognition ไม่ได้...",
        minChars: 15,
        keywords: ["linear", "เส้นตรง", "ซับซ้อน", "non-linear", "เรียนรู้", "pattern", "ปัญหา", "แก้", "สมการ"],
        optional: true,
      },
    ],
    feedbacks: {
      S: "ยอดมาก! Analogy สวิตช์ชัดเจนมาก และอธิบาย activation function ทางเทคนิคได้ถูกต้อง รวมถึงตอบ Bonus ได้ดีด้วย 🏆",
      A: "ดีมาก! เข้าใจบทบาทของ activation function และรู้จักชื่อ function เช่น ReLU ได้ถูกต้อง ⭐",
      B: "ดี! ลองเพิ่มชื่อ activation function เช่น ReLU หรือ Sigmoid ในส่วนที่ 2 💪",
      C: "เริ่มต้นได้ ลองอธิบายว่า activation function ทำให้ network เรียนรู้อะไรได้บ้าง 🔧",
      D: "นึกถึงสวิตช์ไฟ — เปิด/ปิดตามเงื่อนไข Activation Function ก็ทำแบบเดียวกันกับสัญญาณใน Neural Network 📚",
    },
  },
  {
    id: 3,
    concept: "Backpropagation คืออะไร?",
    icon: "🔄",
    parts: [
      {
        label: "ตัวอย่างชีวิตจริง",
        icon: "🌍",
        color: "#c084fc",
        prompt: "เปรียบ Backpropagation กับการเรียนรู้จากความผิดพลาดและแก้ไข",
        hint: "เช่น: Backpropagation เหมือนนักกีฬาที่โยนลูกบาส ผิดแล้วได้รับ feedback ว่าพลาดซ้ายหรือขวา แล้วปรับการโยนครั้งต่อไป...",
        minChars: 20,
        keywords: ["เหมือน", "เปรียบ", "เช่น", "ผิด", "ปรับ", "แก้", "feedback", "เรียนรู้", "ครั้งถัดไป", "นักกีฬา", "โยน", "ซ้อม", "ความผิดพลาด"],
      },
      {
        label: "นิยามทางเทคนิค",
        icon: "⚙️",
        color: "#e879f9",
        prompt: "Backpropagation ทำงานอย่างไรใน Neural Network?",
        hint: "เช่น: Backpropagation คำนวณ gradient ของ loss function แล้วส่งย้อนกลับ (backward) เพื่อปรับ weight ในแต่ละ layer โดยใช้ gradient descent...",
        minChars: 20,
        keywords: ["backpropagation", "gradient", "loss", "weight", "backward", "forward", "descent", "update", "error", "derivative", "chain rule", "ปรับ", "ย้อนกลับ"],
      },
      {
        label: "ความคิดของคุณ",
        icon: "💡",
        color: "#fde047",
        prompt: "ทำไม Backpropagation จึงเป็นหัวใจสำคัญของการเทรน Neural Network?",
        hint: "เช่น: เพราะมันทำให้ network รู้ว่า weight แต่ละตัวต้องปรับมากน้อยแค่ไหน จึงสามารถลด error ได้อย่างมีประสิทธิภาพ...",
        minChars: 15,
        keywords: ["weight", "ปรับ", "error", "ลด", "ประสิทธิภาพ", "เทรน", "training", "สำคัญ", "เรียนรู้", "gradient"],
        optional: true,
      },
    ],
    feedbacks: {
      S: "ยอดเยี่ยม! ตัวอย่างนักกีฬาสมจริงมาก และอธิบาย gradient descent / backpropagation ได้ถูกต้องสมบูรณ์ 🚀",
      A: "ดีมาก! เข้าใจกระบวนการ backpropagation และการปรับ weight ได้ถูกต้อง ⭐",
      B: "ดี! ลองเพิ่มคำว่า gradient หรือ weight ในส่วนที่ 2 เพื่อให้คำตอบสมบูรณ์ขึ้น 💪",
      C: "เริ่มต้นดี ลองอธิบายให้ชัดขึ้นว่า backpropagation ปรับอะไร และทำอย่างไร 🔧",
      D: "Backpropagation = เรียนรู้จากความผิดพลาด เหมือนทำโจทย์ผิดแล้วดูเฉลยปรับความเข้าใจ — แล้วเชื่อมกับ AI 📚",
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
  { key: "creativity" as const, label: "CREATIVITY",         color: "#c084fc", icon: "✦" },
  { key: "technical"  as const, label: "TECHNICAL ACCURACY", color: "#e879f9", icon: "◈" },
  { key: "clarity"    as const, label: "CLARITY",            color: "#4ade80", icon: "◉" },
  { key: "teaching"   as const, label: "TEACHING SKILL",     color: "#fde047", icon: "★" },
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
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl" style={{ animation: "float 4s ease-in-out infinite", background: "linear-gradient(135deg,rgba(192,132,252,0.18),rgba(232,121,249,0.12))", border: "2px solid rgba(192,132,252,0.45)" }}>
          {d.mood}
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#050510] border border-purple-500/40 whitespace-nowrap">
          <span className="text-xs font-bold text-purple-400 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>{d.speaker}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block" style={{ animation: "glowPulse 2s infinite" }} />
        <span className="text-xs tracking-widest text-purple-500/80" style={{ fontFamily: "var(--font-mono)" }}>{d.sub}</span>
      </div>
      <div className="w-full glass-card rounded-2xl p-5 border border-purple-500/15 min-h-[88px]">
        <p className="text-white text-sm sm:text-base leading-relaxed text-center">
          {displayed}{!done && <span className="inline-block w-0.5 h-4 bg-purple-400 ml-1 align-middle" style={{ animation: "pulse 1s infinite" }} />}
        </p>
      </div>
      <div className="flex gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className="h-2 rounded-full transition-all duration-300" style={{ width: i === idx ? 24 : 8, background: i === idx ? "#c084fc" : i < idx ? "rgba(192,132,252,0.4)" : "#374151" }} />
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
        <div className="glass-card rounded-2xl p-6 border border-purple-500/20 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 inline-block" style={{ animation: "glowPulse 1s infinite" }} />
            <span className="text-xs tracking-widest text-purple-400" style={{ fontFamily: "var(--font-mono)" }}>// AI_ANALYSIS_RUNNING...</span>
          </div>
          {evalStep >= 1 && <div><p className="text-xs text-purple-300/70 mb-2" style={{ fontFamily: "var(--font-mono)" }}>◈ SCANNING ANALOGY...</p><ScoreBar label="CREATIVITY" value={result?.creativity ?? 0} color="#c084fc" icon="✦" show /></div>}
          {evalStep >= 2 && <div><p className="text-xs text-pink-400/70 mb-2 mt-3" style={{ fontFamily: "var(--font-mono)" }}>◈ CHECKING TECHNICAL TERMS...</p><ScoreBar label="TECHNICAL ACCURACY" value={result?.technical ?? 0} color="#e879f9" icon="◈" show delay={60} /></div>}
          {evalStep >= 3 && <div><p className="text-xs text-green-400/70 mb-2 mt-3" style={{ fontFamily: "var(--font-mono)" }}>◈ MEASURING CLARITY...</p><ScoreBar label="CLARITY" value={result?.clarity ?? 0} color="#4ade80" icon="◉" show delay={60} /></div>}
          {evalStep >= 4 && <div><p className="text-xs text-yellow-400/70 mb-2 mt-3" style={{ fontFamily: "var(--font-mono)" }}>◈ EVALUATING TEACHING SKILL...</p><ScoreBar label="TEACHING SKILL" value={result?.teaching ?? 0} color="#fde047" icon="★" show delay={60} /></div>}
        </div>
      </div>
    );
  }

  if (state === "scored" && result) {
    const tc = TIER_CFG[result.tier];
    return (
      <div className="w-full max-w-lg mx-auto space-y-4">
        <div className="glass-card rounded-2xl p-5 border border-purple-500/15 space-y-3">
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
      <div className="glass-card rounded-xl p-4 border border-purple-500/15">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>คำถาม {cIdx + 1}/{total}</span>
          <span className="text-xs text-purple-400 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>● 3-PART MODE</span>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden mb-3">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${((cIdx + 1) / total) * 100}%`, background: "linear-gradient(90deg, #c084fc, #e879f9)" }} />
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
      <div className="glass-card rounded-2xl p-6 border border-purple-500/15 text-center">
        <p className="text-xs text-gray-500 tracking-widest mb-3" style={{ fontFamily: "var(--font-mono)" }}>// ทุกคำถามเสร็จสิ้น</p>
        <div className="relative w-28 h-28 mx-auto mb-4">
          <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <circle cx="50" cy="50" r="40" fill="none" stroke={pct >= 75 ? "#c084fc" : pct >= 50 ? "#4ade80" : "#fb923c"}
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
        <div className="glass-card rounded-xl p-4 border border-purple-500/20 text-center">
          <p className="text-2xl mb-1">💎</p>
          <p className="text-xl font-black text-purple-400" style={{ fontFamily: "var(--font-orbitron)" }}>+{Math.round(totalXP * 0.2)}</p>
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
      <p className="text-xs tracking-widest text-purple-400" style={{ fontFamily: "var(--font-mono)" }}>// MISSION_DEBRIEF</p>
      <h2 className="text-3xl font-black" style={{ fontFamily: "var(--font-orbitron)" }}>
        <span className="neon-text-cyan">MISSION</span><br /><span className="neon-text-pink">ACCOMPLISHED</span>
      </h2>
      <p className="text-gray-400 text-sm leading-relaxed">คุณสำเร็จภารกิจ <span className="text-white font-bold">Neural Network</span> แล้ว — ตอนนี้คุณเข้าใจรากฐานของ Deep Learning แล้ว!</p>
      <div className="glass-card rounded-2xl p-5 text-left space-y-3">
        <p className="text-xs font-bold tracking-widest text-gray-400 mb-3" style={{ fontFamily: "var(--font-orbitron)" }}>SKILLS ACQUIRED:</p>
        {[
          { icon: "🧠", skill: "Neural Architecture", desc: "เข้าใจโครงสร้าง Neural Network และ layer" },
          { icon: "⚡", skill: "Activation Functions", desc: "รู้จัก ReLU, Sigmoid และ non-linearity" },
          { icon: "🔄", skill: "Backpropagation", desc: "เข้าใจกระบวนการเรียนรู้จาก error" },
        ].map(item => (
          <div key={item.skill} className="flex items-start gap-3 p-3 rounded-xl bg-purple-500/5 border border-purple-500/10">
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
        <Link href="/missions/social-post" className="btn-neon-pink py-3 text-xs font-bold tracking-widest rounded-xl text-center" style={{ fontFamily: "var(--font-orbitron)" }}>ภารกิจถัดไป: SOCIAL POST →</Link>
      </div>
    </div>
  );
}

export default function NeuralNetworkMissionPage() {
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
          <div className="glass-card rounded-3xl p-8 max-w-sm w-full text-center border border-purple-500/30" style={{ boxShadow: "0 0 60px rgba(192,132,252,0.2)" }}>
            <p className="text-6xl mb-4" style={{ animation: "float 3s ease-in-out infinite" }}>🧬</p>
            <p className="text-xs tracking-widest text-purple-400 mb-2" style={{ fontFamily: "var(--font-mono)" }}>MISSION COMPLETE!</p>
            <p className="text-2xl font-black text-white mb-5" style={{ fontFamily: "var(--font-orbitron)" }}>NEURAL NETWORK<br /><span className="neon-text-pink">CLEARED</span></p>
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
          <div className="glass-card rounded-2xl p-4 border border-purple-500/15">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-xl">{MISSION.icon}</div>
                <div>
                  <p className="text-xs text-purple-400 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>{MISSION.code} • {MISSION.difficulty}</p>
                  <p className="text-sm font-black text-white" style={{ fontFamily: "var(--font-orbitron)" }}>{MISSION.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs" style={{ fontFamily: "var(--font-mono)" }}>
                <span className="text-yellow-400">⚡ {MISSION.xpPerChallenge * CHALLENGES.length} XP</span>
                <span className={`px-2 py-1 rounded-lg tracking-widest ${phase === "briefing" ? "bg-gray-800 text-gray-500" : phase === "challenge" ? "bg-purple-500/15 text-purple-400 border border-purple-500/30" : phase === "result" ? "bg-pink-500/15 text-pink-400 border border-pink-500/30" : "bg-green-500/15 text-green-400 border border-green-500/30"}`}>
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
