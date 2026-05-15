"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

// ─── Types ────────────────────────────────────────────────────────────────────
type Phase = "briefing" | "challenge" | "result" | "complete";
type ChallengeState = "input" | "evaluating" | "scored";
type Tier = "S" | "A" | "B" | "C" | "D";

const MISSION = { code: "M-002", title: "MACHINE LEARNING 101", icon: "⚙️", xpPerChallenge: 50, credits: 40, difficulty: "EASY" };

const NPC_DIALOGUE = [
  { speaker: "NEXUS", mood: "🤖", text: "กลับมาแล้ว AGENT_001! ตอนนี้คุณรู้จัก AI พื้นฐานแล้ว — ถึงเวลาเจาะลึก Machine Learning!", sub: "MISSION RESUMING..." },
  { speaker: "DR. ALGO", mood: "👨‍🔬", text: "สวัสดี! ฉัน Dr. Algo ผู้เชี่ยวชาญด้าน ML — วันนี้คุณจะอธิบายแนวคิด ML ด้วยตัวอย่างชีวิตจริง พร้อมกับนิยามเทคนิค", sub: "EXPERT_MODULE ONLINE" },
  { speaker: "DR. ALGO", mood: "👨‍🔬", text: "AI จะให้คะแนน 4 มิติ: ความคิดสร้างสรรค์ ความถูกต้องเทคนิค ความชัดเจน และทักษะการสอน ยิ่งอธิบายละเอียด ยิ่งได้ XP สูง!", sub: "DUAL_ANALYSIS_MODE READY" },
];

interface DualChallenge {
  id: number; concept: string; icon: string;
  part1: { prompt: string; placeholder: string; minChars: number; keywords: string[] };
  part2: { prompt: string; placeholder: string; minChars: number; keywords: string[] };
  feedbacks: Record<Tier, string>;
}

const CHALLENGES: DualChallenge[] = [
  {
    id: 1, concept: "Machine Learning คืออะไร?", icon: "🤖",
    part1: {
      prompt: "อธิบาย Machine Learning โดยใช้ตัวอย่างในชีวิตจริงที่ไม่ใช่เทคโนโลยี เปรียบกับสิ่งที่ทุกคนเข้าใจได้",
      placeholder: "เช่น: 'ML เหมือนกุ๊กที่เรียนรู้สูตรอาหารจากการลองผิดลองถูก ครั้งแรกอาจเค็มเกิน ครั้งต่อมาปรับลดเกลือ จนได้รสชาติที่ดีขึ้นเรื่อยๆ โดยไม่มีใครบอกสูตรตายตัว...'",
      minChars: 30,
      keywords: ["เหมือน", "เปรียบ", "เช่น", "ลองผิดลองถูก", "ฝึก", "ซ้ำ", "ปรับ", "เรียน", "ครู", "เด็ก", "กุ๊ก", "อาหาร", "กีฬา", "นักกีฬา", "พ่อ", "แม่", "ดูตัวอย่าง", "ประสบการณ์", "ฝึกซ้อม"],
    },
    part2: {
      prompt: "อธิบายความหมายทางเทคนิคของ Machine Learning — มันเรียนรู้จากอะไร และต่างจากโปรแกรม if-else ทั่วไปอย่างไร",
      placeholder: "เช่น: 'Machine Learning คือ subset ของ AI ที่ให้คอมพิวเตอร์เรียนรู้จาก training data โดยไม่ต้องโปรแกรมทุกกรณีไว้ล่วงหน้า model จะหา pattern จาก data แล้วนำมาทำนายผลลัพธ์ใหม่...'",
      minChars: 30,
      keywords: ["machine learning", "training", "data", "ข้อมูล", "model", "pattern", "algorithm", "อัลกอริทึม", "subset", "ai", "ทำนาย", "if-else", "เรียนรู้", "dataset", "feature", "label", "supervised", "unsupervised"],
    },
    feedbacks: {
      S: "ยอดเยี่ยม! ตัวอย่างของคุณสร้างสรรค์มาก และอธิบาย ML ทางเทคนิคได้ถูกต้องสมบูรณ์ คุณเป็น ML Communicator ตัวจริง! 🔥",
      A: "ดีมาก! ตัวอย่างชีวิตจริงเข้าใจง่าย และคำอธิบายเทคนิคถูกต้อง ลองเพิ่ม keyword เช่น training data, model ให้ครบ ⭐",
      B: "ดี! เข้าใจหลักการพื้นฐาน แต่ลองทำตัวอย่างให้เป็นรูปธรรมขึ้น และเพิ่มรายละเอียดว่า model เรียนรู้อย่างไร 💪",
      C: "เริ่มต้นดี ลองอธิบายให้ชัดขึ้นว่า ML ต่างจากการเขียนโปรแกรมธรรมดาอย่างไร และยกตัวอย่างจากชีวิตจริงเพิ่ม 🔧",
      D: "ลองคิดถึงตอนที่คุณเรียนอะไรบางอย่างจนชำนาญ — ML ก็เรียนรู้แบบนั้น จากตัวอย่างมากมาย แล้วเขียนอธิบาย 📚",
    },
  },
  {
    id: 2, concept: "Training Data และ Overfitting", icon: "📊",
    part1: {
      prompt: "อธิบาย 'Overfitting' โดยเปรียบกับนักเรียนที่ท่องจำแทนที่จะเข้าใจจริงๆ หรือตัวอย่างอื่นที่คุณนึกออก",
      placeholder: "เช่น: 'Overfitting เหมือนนักเรียนที่จำเฉลยข้อสอบเก่าได้ทุกข้อ แต่พอเจอโจทย์ใหม่ที่คล้ายกันกลับทำไม่ได้ เพราะไม่ได้เข้าใจหลักการจริงๆ แค่จำตัวอย่าง...'",
      minChars: 30,
      keywords: ["เหมือน", "เปรียบ", "เช่น", "นักเรียน", "ท่องจำ", "จำ", "สอบ", "ข้อสอบ", "เฉลย", "ตัวอย่าง", "ใหม่", "ไม่ได้", "ล้มเหลว", "เข้าใจ", "หัวใจ", "หลักการ", "แบบทดสอบ"],
    },
    part2: {
      prompt: "อธิบาย Overfitting ทางเทคนิค — เกิดขึ้นเมื่อไหร่ มีผลอย่างไร และแก้ไขอย่างไร",
      placeholder: "เช่น: 'Overfitting เกิดเมื่อ model เรียนรู้ training data มากเกินไปรวมทั้ง noise จนไม่สามารถ generalize กับ data ใหม่ได้ แก้ไขได้ด้วย regularization, dropout, หรือเพิ่ม training data...'",
      minChars: 25,
      keywords: ["overfitting", "training", "generalize", "model", "noise", "data", "regularization", "dropout", "validation", "test", "accuracy", "loss", "underfitting", "bias", "variance", "cross-validation"],
    },
    feedbacks: {
      S: "ยอดมาก! ตัวอย่าง Overfitting ของคุณสมจริงมาก และอธิบายวิธีแก้ไขทางเทคนิคได้ครบถ้วน 🏆",
      A: "อธิบายได้ดีมาก! Analogy ชัดเจน และเข้าใจ Overfitting เชิงเทคนิคได้ถูกต้อง ⭐",
      B: "ตัวอย่างดี แต่ลองเพิ่มวิธีแก้ไข Overfitting เช่น regularization หรือการเพิ่ม training data 💪",
      C: "เข้าใจ concept แต่ลองอธิบายให้ชัดขึ้นว่า Overfitting ต่างจาก Underfitting อย่างไร 🔧",
      D: "Overfitting เหมือนจำแต่ไม่เข้าใจ — ลองอธิบายด้วยตัวอย่างนักเรียนท่องจำแล้วเชื่อมกับ Machine Learning 📚",
    },
  },
  {
    id: 3, concept: "Supervised vs Unsupervised Learning", icon: "🏷️",
    part1: {
      prompt: "เปรียบ Supervised Learning กับ Unsupervised Learning โดยใช้ตัวอย่างในชีวิตจริงที่ไม่ใช่คอมพิวเตอร์",
      placeholder: "เช่น: 'Supervised เหมือนเด็กเรียนรู้สัตว์โดยมีพ่อแม่คอยบอกว่า \'นี่คือหมา นี่คือแมว\' — Unsupervised เหมือนเด็กที่เห็นสัตว์หลายตัวแล้วค่อยๆ จัดกลุ่มเองว่าตัวไหนคล้ายกัน...'",
      minChars: 35,
      keywords: ["เหมือน", "เปรียบ", "เช่น", "ครู", "สอน", "บอก", "label", "กลุ่ม", "จัดกลุ่ม", "เด็ก", "คัดแยก", "ประเภท", "หมวด", "แยก", "ไม่มีใคร", "เอง", "ตัวเอง", "อิสระ"],
    },
    part2: {
      prompt: "อธิบายความแตกต่างทางเทคนิคระหว่าง Supervised และ Unsupervised Learning พร้อมตัวอย่าง algorithm",
      placeholder: "เช่น: 'Supervised Learning ใช้ labeled data โดย model เรียนรู้ mapping จาก input → output เช่น Linear Regression, SVM — Unsupervised Learning ใช้ unlabeled data เพื่อหา pattern เช่น K-Means Clustering, PCA...'",
      minChars: 25,
      keywords: ["supervised", "unsupervised", "labeled", "unlabeled", "classification", "regression", "clustering", "k-means", "svm", "linear regression", "pca", "algorithm", "อัลกอริทึม", "output", "input", "label", "pattern"],
    },
    feedbacks: {
      S: "ยอดเยี่ยม! Analogy ของคุณทำให้เข้าใจความแตกต่างได้ทันที และอธิบาย algorithm ได้ถูกต้องครบถ้วน 🔥",
      A: "ดีมาก! ตัวอย่างชัดเจน และรู้จัก algorithm ที่เกี่ยวข้องได้ถูกต้อง ⭐",
      B: "ดี! แต่ลองเพิ่มชื่อ algorithm เช่น K-Means หรือ Linear Regression เพื่อให้คำตอบสมบูรณ์ขึ้น 💪",
      C: "เข้าใจความแตกต่างพื้นฐาน แต่ลองยกตัวอย่าง algorithm ที่ใช้ใน Supervised และ Unsupervised อีกสักอย่าง 🔧",
      D: "ลองเริ่มจาก: Supervised = มีครูสอน (มี label), Unsupervised = เรียนรู้เอง (ไม่มี label) แล้วค่อยเพิ่มรายละเอียด 📚",
    },
  },
];

interface ScoreResult {
  creativity: number; technical: number; clarity: number; teaching: number;
  total: number; tier: Tier; xpEarned: number; feedback: string;
}

function evaluateDual(p1: string, p2: string, ch: DualChallenge, baseXP: number): ScoreResult {
  const t1 = p1.toLowerCase();
  const t2 = p2.toLowerCase();
  const teachWords = ["เช่น", "เหมือน", "เปรียบ", "คือ", "ทำให้", "เพราะ", "ตัวอย่าง", "นั่นคือ", "กล่าวคือ", "หมายความ"];

  const cHits = ch.part1.keywords.filter(k => t1.includes(k)).length;
  const creativity = Math.min(100, 20 + cHits * 13 + Math.min(28, Math.floor(p1.length / 4)));

  const tHits = ch.part2.keywords.filter(k => t2.includes(k)).length;
  const technical = Math.min(100, 15 + tHits * 16 + Math.min(24, Math.floor(p2.length / 5)));

  const totalLen = p1.length + p2.length;
  const clarity = Math.min(100, 15 + Math.min(38, Math.floor(totalLen / 6))
    + (p1.length >= 30 ? 12 : 0) + (p2.length >= 30 ? 12 : 0)
    + (p1.length >= 65 ? 8 : 0) + (p2.length >= 65 ? 8 : 0));

  const tvHits = teachWords.filter(k => (t1 + " " + t2).includes(k)).length;
  const teaching = Math.min(100, 20 + tvHits * 11 + (p1.length > 40 && p2.length > 40 ? 18 : 6)
    + Math.min(18, Math.floor(totalLen / 10)));

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
  { key: "technical"  as const, label: "TECHNICAL ACCURACY", color: "#00f5ff", icon: "◈" },
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
  const isAlgo = d.speaker === "DR. ALGO";
  const borderColor = isAlgo ? "rgba(250,204,21,0.45)" : "rgba(0,245,255,0.4)";
  const dotColor = isAlgo ? "#facc15" : "#00f5ff";
  const subColor = isAlgo ? "#ca8a04" : "#0891b2";
  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-lg mx-auto">
      <div className="relative">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl" style={{ animation: "float 4s ease-in-out infinite", background: isAlgo ? "linear-gradient(135deg,rgba(250,204,21,0.18),rgba(249,115,22,0.12))" : "linear-gradient(135deg,rgba(0,245,255,0.12),rgba(191,0,255,0.1))", border: `2px solid ${borderColor}` }}>
          {d.mood}
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#050510] whitespace-nowrap" style={{ border: `1px solid ${borderColor}` }}>
          <span className="text-xs font-bold tracking-widest" style={{ fontFamily: "var(--font-mono)", color: dotColor }}>{d.speaker}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: dotColor, animation: "glowPulse 2s infinite" }} />
        <span className="text-xs tracking-widest" style={{ fontFamily: "var(--font-mono)", color: subColor }}>{d.sub}</span>
      </div>
      <div className="w-full glass-card rounded-2xl p-5 min-h-[88px]" style={{ borderColor: `${dotColor}22` }}>
        <p className="text-white text-sm sm:text-base leading-relaxed text-center">
          {displayed}{!done && <span className="inline-block w-0.5 h-4 ml-1 align-middle" style={{ background: dotColor, animation: "pulse 1s infinite" }} />}
        </p>
      </div>
      <div className="flex gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className="h-2 rounded-full transition-all duration-300" style={{ width: i === idx ? 24 : 8, background: i === idx ? dotColor : i < idx ? `${dotColor}50` : "#374151" }} />
        ))}
      </div>
      <button onClick={onNext} className="btn-neon-cyan px-8 py-3 text-xs font-bold tracking-widest rounded-xl w-full sm:w-auto" style={{ fontFamily: "var(--font-orbitron)" }}>
        {idx < total - 1 ? "NEXT ▶" : "ENTER TRAINING ▶"}
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

function DualPartChallenge({ ch, cIdx, total, onComplete }: { ch: DualChallenge; cIdx: number; total: number; onComplete: (xp: number) => void }) {
  const [part1, setPart1] = useState("");
  const [part2, setPart2] = useState("");
  const [state, setState] = useState<ChallengeState>("input");
  const [evalStep, setEvalStep] = useState(0);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const canSubmit = part1.trim().length >= ch.part1.minChars && part2.trim().length >= ch.part2.minChars;

  function handleSubmit() {
    if (!canSubmit) return;
    const r = evaluateDual(part1, part2, ch, MISSION.xpPerChallenge);
    setResult(r);
    setState("evaluating");
    setTimeout(() => setEvalStep(1), 400);
    setTimeout(() => setEvalStep(2), 1100);
    setTimeout(() => setEvalStep(3), 1800);
    setTimeout(() => setEvalStep(4), 2500);
    setTimeout(() => { setState("scored"); setShowFeedback(true); }, 3000);
  }

  if (state === "evaluating") {
    return (
      <div className="w-full max-w-lg mx-auto space-y-5">
        <div className="glass-card rounded-2xl p-6 border border-yellow-500/20 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" style={{ animation: "glowPulse 1s infinite" }} />
            <span className="text-xs tracking-widest text-yellow-400" style={{ fontFamily: "var(--font-mono)" }}>// AI_ANALYSIS_RUNNING...</span>
          </div>
          {evalStep >= 1 && <div><div className="text-xs text-pink-400/70 tracking-widest mb-2" style={{ fontFamily: "var(--font-mono)" }}>◈ SCANNING CREATIVE PATTERNS...</div><ScoreBar label="CREATIVITY" value={result?.creativity ?? 0} color="#f472b6" icon="✦" show={evalStep >= 1} /></div>}
          {evalStep >= 2 && <div><div className="text-xs text-cyan-400/70 tracking-widest mb-2 mt-3" style={{ fontFamily: "var(--font-mono)" }}>◈ VERIFYING TECHNICAL ACCURACY...</div><ScoreBar label="TECHNICAL ACCURACY" value={result?.technical ?? 0} color="#00f5ff" icon="◈" show={evalStep >= 2} delay={60} /></div>}
          {evalStep >= 3 && <div><div className="text-xs text-green-400/70 tracking-widest mb-2 mt-3" style={{ fontFamily: "var(--font-mono)" }}>◈ MEASURING CLARITY INDEX...</div><ScoreBar label="CLARITY" value={result?.clarity ?? 0} color="#4ade80" icon="◉" show={evalStep >= 3} delay={60} /></div>}
          {evalStep >= 4 && <div><div className="text-xs text-yellow-400/70 tracking-widest mb-2 mt-3" style={{ fontFamily: "var(--font-mono)" }}>◈ EVALUATING TEACHING SKILL...</div><ScoreBar label="TEACHING SKILL" value={result?.teaching ?? 0} color="#fde047" icon="★" show={evalStep >= 4} delay={60} /></div>}
        </div>
      </div>
    );
  }

  if (state === "scored" && result) {
    const tc = TIER_CFG[result.tier];
    return (
      <div className="w-full max-w-lg mx-auto space-y-4">
        <div className="glass-card rounded-2xl p-5 border border-yellow-500/20 space-y-3">
          <div className="text-xs text-gray-500 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>// ANALYSIS_COMPLETE</div>
          <div className="space-y-3">{SCORE_BARS.map(bar => <ScoreBar key={bar.key} label={bar.label} value={result[bar.key]} color={bar.color} icon={bar.icon} show />)}</div>
          <div className="border-t border-gray-800 pt-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl font-black" style={{ fontFamily: "var(--font-orbitron)", color: tc.color, filter: `drop-shadow(0 0 12px ${tc.color})` }}>{result.tier}</div>
              <div>
                <div className="text-xs text-gray-500 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>GRADE</div>
                <div className="text-xs font-bold" style={{ color: tc.color, fontFamily: "var(--font-mono)" }}>{tc.label}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 mb-0.5" style={{ fontFamily: "var(--font-mono)" }}>XP EARNED</div>
              <div className="text-2xl font-black text-yellow-400" style={{ fontFamily: "var(--font-orbitron)" }}>+{result.xpEarned}</div>
            </div>
          </div>
        </div>
        {showFeedback && (
          <div className="glass-card rounded-xl p-4" style={{ borderColor: `${tc.color}30`, borderWidth: 1, borderStyle: "solid" }}>
            <div className="text-xs tracking-widest mb-2" style={{ fontFamily: "var(--font-mono)", color: tc.color }}>◈ AI_FEEDBACK</div>
            <p className="text-sm text-gray-300 leading-relaxed">{result.feedback}</p>
          </div>
        )}
        <button onClick={() => onComplete(result.xpEarned)} className="w-full btn-neon-pink py-4 text-xs font-bold tracking-widest rounded-xl" style={{ fontFamily: "var(--font-orbitron)" }}>
          {cIdx < total - 1 ? "NEXT CHALLENGE ▶" : "COMPLETE MISSION ▶"}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      <div className="glass-card rounded-xl p-4 border border-yellow-500/15">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>CHALLENGE {cIdx + 1}/{total}</span>
          <span className="text-xs text-yellow-400 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>● DUAL_ANALYSIS_MODE</span>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden mb-3">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${((cIdx + 1) / total) * 100}%`, background: "linear-gradient(90deg, #facc15, #f97316)" }} />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{ch.icon}</span>
          <div>
            <div className="text-xs text-gray-500 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>CONCEPT</div>
            <div className="text-sm font-black text-white" style={{ fontFamily: "var(--font-orbitron)" }}>{ch.concept}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {SCORE_BARS.map(b => (
          <div key={b.key} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-900/60 border border-gray-800/50">
            <span className="text-xs" style={{ color: b.color }}>{b.icon}</span>
            <span className="text-xs text-gray-500 tracking-widest truncate" style={{ fontFamily: "var(--font-mono)" }}>{b.label}</span>
          </div>
        ))}
      </div>

      {/* Part 1 */}
      <div className="glass-card rounded-2xl overflow-hidden" style={{ borderColor: "rgba(244,114,182,0.3)", borderWidth: 1, borderStyle: "solid" }}>
        <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: "rgba(244,114,182,0.06)", borderBottom: "1px solid rgba(244,114,182,0.15)" }}>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-pink-400">✦ PART_1</span>
            <span className="text-xs text-gray-500 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>REAL-WORLD ANALOGY</span>
          </div>
          <span className={`text-xs tracking-widest ${part1.length >= ch.part1.minChars ? "text-green-400" : "text-gray-600"}`} style={{ fontFamily: "var(--font-mono)" }}>
            {part1.length}/{ch.part1.minChars}✓
          </span>
        </div>
        <div className="px-4 py-3">
          <p className="text-xs text-pink-300/80 mb-2 leading-relaxed">{ch.part1.prompt}</p>
          <textarea value={part1} onChange={e => setPart1(e.target.value)} rows={4} placeholder={ch.part1.placeholder}
            className="w-full bg-transparent text-sm text-gray-200 placeholder-gray-700 resize-none outline-none leading-relaxed"
            style={{ fontFamily: "var(--font-mono)" }} />
        </div>
      </div>

      {/* Part 2 */}
      <div className="glass-card rounded-2xl overflow-hidden" style={{ borderColor: "rgba(0,245,255,0.25)", borderWidth: 1, borderStyle: "solid" }}>
        <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: "rgba(0,245,255,0.05)", borderBottom: "1px solid rgba(0,245,255,0.12)" }}>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-cyan-400">◈ PART_2</span>
            <span className="text-xs text-gray-500 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>TECHNICAL DEFINITION</span>
          </div>
          <span className={`text-xs tracking-widest ${part2.length >= ch.part2.minChars ? "text-green-400" : "text-gray-600"}`} style={{ fontFamily: "var(--font-mono)" }}>
            {part2.length}/{ch.part2.minChars}✓
          </span>
        </div>
        <div className="px-4 py-3">
          <p className="text-xs text-cyan-300/80 mb-2 leading-relaxed">{ch.part2.prompt}</p>
          <textarea value={part2} onChange={e => setPart2(e.target.value)} rows={4} placeholder={ch.part2.placeholder}
            className="w-full bg-transparent text-sm text-gray-200 placeholder-gray-700 resize-none outline-none leading-relaxed"
            style={{ fontFamily: "var(--font-mono)" }} />
        </div>
      </div>

      <button onClick={handleSubmit} disabled={!canSubmit}
        className={`w-full py-4 text-xs font-bold tracking-widest rounded-xl transition-all ${canSubmit ? "btn-neon-pink" : "border border-gray-800 text-gray-700 cursor-not-allowed"}`}
        style={{ fontFamily: "var(--font-orbitron)" }}>
        {canSubmit ? "▶ SUBMIT TO AI ANALYSIS" : `WRITE MORE... (P1: ${Math.max(0, ch.part1.minChars - part1.trim().length)} | P2: ${Math.max(0, ch.part2.minChars - part2.trim().length)} CHARS LEFT)`}
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
      <div className="glass-card rounded-2xl p-6 border border-yellow-500/20 text-center">
        <div className="text-xs text-gray-500 tracking-widest mb-3" style={{ fontFamily: "var(--font-mono)" }}>// ALL_CHALLENGES_COMPLETE</div>
        <div className="relative w-28 h-28 mx-auto mb-4">
          <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <circle cx="50" cy="50" r="40" fill="none" stroke={pct >= 75 ? "#facc15" : pct >= 50 ? "#4ade80" : "#fb923c"}
              strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(pct / 100) * 251} 251`}
              style={{ transition: "stroke-dasharray 1.4s ease", filter: "drop-shadow(0 0 6px currentColor)" }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-orbitron)" }}>{pct}%</div>
            <div className="text-xs text-gray-500" style={{ fontFamily: "var(--font-mono)" }}>SCORE</div>
          </div>
        </div>
        <div className="text-lg font-black text-white mb-1" style={{ fontFamily: "var(--font-orbitron)" }}>
          {pct >= 88 ? "ML MASTER!" : pct >= 73 ? "ALGORITHM EXPERT" : pct >= 55 ? "DATA SCIENTIST" : "KEEP TRAINING!"}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card rounded-xl p-4 border border-yellow-500/20 text-center">
          <div className="text-2xl mb-1">⚡</div>
          <div className="text-xl font-black text-yellow-400" style={{ fontFamily: "var(--font-orbitron)" }}>+{totalXP}</div>
          <div className="text-xs text-gray-500 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>XP EARNED</div>
        </div>
        <div className="glass-card rounded-xl p-4 border border-purple-500/20 text-center">
          <div className="text-2xl mb-1">💎</div>
          <div className="text-xl font-black text-purple-400" style={{ fontFamily: "var(--font-orbitron)" }}>+{Math.round(totalXP * 0.2)}</div>
          <div className="text-xs text-gray-500 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>CREDITS</div>
        </div>
      </div>
      <button onClick={onClaim} className="w-full btn-neon-pink py-4 text-sm font-bold tracking-widest rounded-xl" style={{ fontFamily: "var(--font-orbitron)" }}>▶ CLAIM REWARDS</button>
    </div>
  );
}

function CompleteScreen({ totalXP }: { totalXP: number }) {
  return (
    <div className="w-full max-w-lg mx-auto text-center space-y-6">
      <div className="text-xs tracking-widest text-yellow-400" style={{ fontFamily: "var(--font-mono)" }}>// MISSION_DEBRIEF</div>
      <h2 className="text-3xl font-black" style={{ fontFamily: "var(--font-orbitron)" }}>
        <span className="neon-text-cyan">MISSION</span><br /><span className="neon-text-pink">ACCOMPLISHED</span>
      </h2>
      <p className="text-gray-400 text-sm leading-relaxed">คุณสำเร็จภารกิจ <span className="text-white font-bold">Machine Learning 101</span> แล้ว! ความเข้าใจ ML ของคุณผ่านการวิเคราะห์ Dual-Mode เรียบร้อย</p>
      <div className="glass-card rounded-2xl p-5 text-left space-y-3">
        <div className="text-xs font-bold tracking-widest text-gray-400 mb-3" style={{ fontFamily: "var(--font-orbitron)" }}>SKILLS ACQUIRED:</div>
        {[
          { icon: "⚙️", skill: "ML Fundamentals", desc: "เข้าใจหลักการพื้นฐานของ Machine Learning" },
          { icon: "⚠️", skill: "Overfitting Detection", desc: "รู้จัก Overfitting และวิธีป้องกัน" },
          { icon: "🏷️", skill: "Learning Paradigms", desc: "แยก Supervised และ Unsupervised Learning ได้" },
        ].map(item => (
          <div key={item.skill} className="flex items-start gap-3 p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/10">
            <span className="text-lg shrink-0">{item.icon}</span>
            <div>
              <div className="text-xs font-bold text-white mb-0.5" style={{ fontFamily: "var(--font-orbitron)" }}>{item.skill}</div>
              <div className="text-xs text-gray-500">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <Link href="/dashboard" className="btn-neon-cyan py-3 text-xs font-bold tracking-widest rounded-xl text-center" style={{ fontFamily: "var(--font-orbitron)" }}>← BACK TO HQ</Link>
        <Link href="/missions/neural-network" className="btn-neon-pink py-3 text-xs font-bold tracking-widest rounded-xl text-center" style={{ fontFamily: "var(--font-orbitron)" }}>NEXT: NEURAL NETWORKS →</Link>
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
          <div className="glass-card rounded-3xl p-8 max-w-sm w-full text-center border border-yellow-500/30" style={{ boxShadow: "0 0 60px rgba(250,204,21,0.15)" }}>
            <div className="text-6xl mb-4" style={{ animation: "float 3s ease-in-out infinite" }}>⚙️</div>
            <div className="text-xs tracking-widest text-yellow-400 mb-2" style={{ fontFamily: "var(--font-mono)" }}>MISSION COMPLETE!</div>
            <div className="text-2xl font-black text-white mb-5" style={{ fontFamily: "var(--font-orbitron)" }}>ML 101<br /><span className="neon-text-pink">CLEARED</span></div>
            <div className="space-y-3 mb-5">
              <div className="flex justify-between p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <span className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-orbitron)" }}>⚡ XP EARNED</span>
                <span className="text-xl font-black text-yellow-400" style={{ fontFamily: "var(--font-orbitron)" }}>+{totalXP}</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <span className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-orbitron)" }}>💎 CREDITS</span>
                <span className="text-xl font-black text-purple-400" style={{ fontFamily: "var(--font-orbitron)" }}>+{Math.round(totalXP * 0.2)}</span>
              </div>
            </div>
            <button onClick={() => { setShowReward(false); setPhase("complete"); }} className="w-full btn-neon-pink py-3 text-sm font-bold tracking-widest rounded-xl" style={{ fontFamily: "var(--font-orbitron)" }}>▶ CONTINUE</button>
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
                  <div className="text-xs text-yellow-400 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>{MISSION.code} • {MISSION.difficulty}</div>
                  <div className="text-sm font-black text-white" style={{ fontFamily: "var(--font-orbitron)" }}>{MISSION.title}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs" style={{ fontFamily: "var(--font-mono)" }}>
                <span className="text-yellow-400">⚡ {MISSION.xpPerChallenge * CHALLENGES.length} XP</span>
                <span className={`px-2 py-1 rounded-lg tracking-widest ${phase === "briefing" ? "bg-gray-800 text-gray-500" : phase === "challenge" ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30" : phase === "result" ? "bg-pink-500/15 text-pink-400 border border-pink-500/30" : "bg-green-500/15 text-green-400 border border-green-500/30"}`}>
                  {phase === "briefing" && "BRIEFING"}
                  {phase === "challenge" && `● C${cIdx + 1}/${CHALLENGES.length}`}
                  {phase === "result" && "RESULTS"}
                  {phase === "complete" && "✓ DONE"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          {phase === "briefing" && <div className="w-full flex flex-col items-center justify-center min-h-[60vh]"><DialogueBox d={NPC_DIALOGUE[dlgIdx]} onNext={handleNextDlg} idx={dlgIdx} total={NPC_DIALOGUE.length} /></div>}
          {phase === "challenge" && <DualPartChallenge key={cIdx} ch={CHALLENGES[cIdx]} cIdx={cIdx} total={CHALLENGES.length} onComplete={handleChallengeComplete} />}
          {phase === "result" && <ResultScreen totalXP={totalXP} onClaim={() => setShowReward(true)} />}
          {phase === "complete" && <CompleteScreen totalXP={totalXP} />}
        </div>
      </div>
    </div>
  );
}
