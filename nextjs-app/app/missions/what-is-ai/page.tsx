"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

// ─── Types ────────────────────────────────────────────────────────────────────
type Phase = "briefing" | "challenge" | "result" | "complete";
type ChallengeState = "input" | "evaluating" | "scored";
type Tier = "S" | "A" | "B" | "C" | "D";

const MISSION = { code: "M-001", title: "WHAT IS AI?", icon: "🧠", xpPerChallenge: 40, credits: 24, difficulty: "EASY" };

// ─── NPC Dialogue ─────────────────────────────────────────────────────────────
const NPC_DIALOGUE = [
  { speaker: "NEXUS", mood: "🤖", text: "ยินดีต้อนรับสู่ NeuralQuest, AGENT_001 — ภารกิจแรกเริ่มแล้ว!", sub: "SYSTEM INITIALIZED" },
  { speaker: "NEXUS", mood: "🤖", text: "ระบบนี้ไม่ใช่ควิซธรรมดา — AI จะวิเคราะห์ความเข้าใจจริงของคุณใน 4 มิติ: ความคิดสร้างสรรค์ ความถูกต้องเทคนิค ความชัดเจน และทักษะการสอน", sub: "DUAL_ANALYSIS_MODE ONLINE" },
  { speaker: "NEXUS", mood: "🤖", text: "แต่ละคำถามมี 2 ส่วน: Part 1 — อธิบายด้วยตัวอย่างชีวิตจริง | Part 2 — อธิบายความหมายทางเทคนิค ยิ่งละเอียดยิ่งได้ XP มาก!", sub: "BRIEFING COMPLETE" },
];

// ─── Challenge Data ────────────────────────────────────────────────────────────
interface DualChallenge {
  id: number; concept: string; icon: string;
  part1: { prompt: string; placeholder: string; minChars: number; keywords: string[] };
  part2: { prompt: string; placeholder: string; minChars: number; keywords: string[] };
  feedbacks: Record<Tier, string>;
}

const CHALLENGES: DualChallenge[] = [
  {
    id: 1, concept: "AI คืออะไร?", icon: "🧠",
    part1: {
      prompt: "อธิบาย AI โดยเปรียบเทียบกับสิ่งในชีวิตประจำวัน (ห้ามใช้คำว่า AI หรือคอมพิวเตอร์)",
      placeholder: "เช่น: 'AI เหมือนเด็กที่ดูตัวอย่างโจทย์คณิตซ้ำๆ หลายร้อยข้อ จนสามารถแก้โจทย์ใหม่ที่ไม่เคยเห็นได้เอง — ยิ่งดูมาก ยิ่งเก่งขึ้น...'",
      minChars: 25,
      keywords: ["เหมือน", "เปรียบ", "เช่น", "ครู", "เด็ก", "นักเรียน", "ฝึก", "สอน", "แม่", "พ่อ", "หมา", "แมว", "ร้าน", "อาหาร", "รถ", "คน", "ทำซ้ำ", "ซ้ำ", "เรียน", "โรงเรียน", "ตัวอย่าง", "ดูตัวอย่าง"],
    },
    part2: {
      prompt: "อธิบายความหมายทางเทคนิคของ AI — มันทำงานอย่างไร และต่างจากโปรแกรมปกติอย่างไร",
      placeholder: "เช่น: 'AI คือระบบคอมพิวเตอร์ที่จำลองความฉลาดของมนุษย์ โดยเรียนรู้จาก data เพื่อหา pattern แล้วนำมาตัดสินใจหรือทำนายผล ต่างจากโปรแกรมทั่วไปที่ทำตาม if-else ที่โปรแกรมเมอร์เขียนไว้...'",
      minChars: 25,
      keywords: ["ระบบ", "จำลอง", "เรียนรู้", "ข้อมูล", "data", "อัตโนมัติ", "algorithm", "อัลกอริทึม", "โปรแกรม", "ฉลาด", "ทำนาย", "pattern", "machine", "neural", "model", "if-else", "ตัดสินใจ"],
    },
    feedbacks: {
      S: "ยอดเยี่ยม! ทั้งตัวอย่างและคำอธิบายเทคนิคของคุณแม่นยำและสร้างสรรค์มาก คุณเข้าใจ AI อย่างลึกซึ้งจริงๆ 🏆",
      A: "ดีมาก! ตัวอย่างของคุณเข้าใจง่าย และอธิบายเทคนิคได้ถูกต้อง เพิ่มรายละเอียดเล็กน้อยก็จะสมบูรณ์แบบ ⭐",
      B: "ดี! เข้าใจแนวคิดพื้นฐานได้ถูกต้อง ลองเพิ่มตัวอย่างที่เป็นรูปธรรมมากขึ้น และใส่คำศัพท์เทคนิคให้ครบกว่านี้ 💪",
      C: "พอใช้ได้ ลองคิดถึงตัวอย่างที่ทุกคนเข้าใจได้ง่าย และอธิบายว่า AI ต่างจากโปรแกรมธรรมดาอย่างไร 🔧",
      D: "เริ่มต้นได้ดี! ลองอธิบายให้ยาวขึ้นและเพิ่มตัวอย่างจากชีวิตจริง เช่น Netflix หรือ Google Maps ใช้ AI ช่วยแนะนำ 📚",
    },
  },
  {
    id: 2, concept: "ตัวอย่าง AI ในชีวิตจริง", icon: "📱",
    part1: {
      prompt: "ยกตัวอย่าง AI ที่คุณเคยใช้หรือพบในชีวิตประจำวัน พร้อมอธิบายว่ามันช่วยคุณอย่างไร",
      placeholder: "เช่น: 'ฉันใช้ TikTok ทุกวัน มันรู้ว่าฉันชอบวิดีโอแมวและเกม จนฟีดของฉันมีแต่เนื้อหาที่ฉันชอบ ทำให้ฉันดูนานขึ้นเรื่อยๆ...'",
      minChars: 30,
      keywords: ["netflix", "spotify", "tiktok", "google", "siri", "alexa", "youtube", "instagram", "แนะนำ", "ค้นหา", "แปล", "แผนที่", "maps", "อีเมล", "spam", "ใบหน้า", "ภาพ", "เสียง", "chatgpt", "ช็อปปิ้ง"],
    },
    part2: {
      prompt: "อธิบายว่า AI ในตัวอย่างนั้นทำงานอย่างไรในเชิงเทคนิค — มันเรียนรู้จากอะไร และทำนายอะไร",
      placeholder: "เช่น: 'TikTok ใช้ Recommendation AI ที่เก็บ data พฤติกรรมของคุณ เช่น วิดีโอที่ดูนาน กด like และ share แล้วใช้ algorithm เพื่อทำนายว่าวิดีโอไหนที่คุณจะดูต่อไป...'",
      minChars: 25,
      keywords: ["algorithm", "อัลกอริทึม", "data", "ข้อมูล", "เรียนรู้", "ทำนาย", "recommendation", "pattern", "model", "วิเคราะห์", "คลิก", "พฤติกรรม", "ชอบ", "training", "feature"],
    },
    feedbacks: {
      S: "เข้าใจ AI ในชีวิตจริงได้ครบถ้วนมาก! ทั้งการยกตัวอย่างและอธิบาย mechanism ทางเทคนิคถูกต้องสมบูรณ์ 🔥",
      A: "ตัวอย่างของคุณชัดเจนมาก และอธิบายการทำงานได้ถูกต้อง ลองเพิ่ม data ที่ AI ใช้เรียนรู้ให้ละเอียดขึ้น ✨",
      B: "ตัวอย่างดี! แต่การอธิบายเทคนิคยังสั้นอยู่ ลองบอกว่า AI ใช้ข้อมูลอะไรบ้างในการตัดสินใจ 💪",
      C: "เริ่มต้นดี ลองอธิบายให้ชัดขึ้นว่า AI ในตัวอย่างทำงานอย่างไร ไม่ใช่แค่บอกว่ามันทำอะไร 🔧",
      D: "ลองยกตัวอย่าง AI ที่คุณใช้บ่อยๆ เช่น Google, YouTube หรือแอปร้านค้าออนไลน์ และอธิบายว่ามันแนะนำสินค้าหรือเนื้อหาให้คุณได้อย่างไร 📱",
    },
  },
  {
    id: 3, concept: "AI เรียนรู้จากอะไร?", icon: "📚",
    part1: {
      prompt: "เปรียบการเรียนรู้ของ AI กับวิธีที่มนุษย์หรือสัตว์เรียนรู้จากประสบการณ์",
      placeholder: "เช่น: 'AI เรียนรู้เหมือนหมาที่ถูกฝึก ถ้านั่งแล้วได้ขนม มันก็จะนั่งซ้ำ — AI ก็เหมือนกัน ถ้าตอบถูกก็จะถูก reward และปรับตัวเองให้ตอบแบบนั้นบ่อยขึ้น...'",
      minChars: 25,
      keywords: ["เหมือน", "เปรียบ", "เช่น", "หมา", "แมว", "เด็ก", "ฝึก", "ซ้ำ", "reward", "รางวัล", "ลองผิดลองถูก", "ประสบการณ์", "ครู", "โรงเรียน", "กีฬา", "นักกีฬา", "สอน", "จำ"],
    },
    part2: {
      prompt: "อธิบาย Machine Learning — กระบวนการที่ AI ใช้ในการเรียนรู้จาก data ทางเทคนิค",
      placeholder: "เช่น: 'AI เรียนรู้ผ่าน Machine Learning โดยรับ training data จำนวนมาก แล้วปรับ weights ใน model เพื่อลด error ในการทำนาย กระบวนการนี้เรียกว่า backpropagation ที่ทำซ้ำหลายรอบ...'",
      minChars: 25,
      keywords: ["machine learning", "data", "ข้อมูล", "training", "model", "weight", "error", "pattern", "backpropagation", "gradient", "ปรับ", "เรียนรู้", "ซ้ำ", "epoch", "loss", "ทำนาย", "dataset"],
    },
    feedbacks: {
      S: "ยอดเยี่ยม! ตัวอย่างของคุณสร้างสรรค์มาก และอธิบาย ML ได้ถูกต้องครบถ้วน คุณพร้อมสำหรับภารกิจ ML 101 แล้ว! 🚀",
      A: "อธิบายได้ดีมาก! ตัวอย่างเข้าใจง่าย และเข้าใจแนวคิด ML ได้ถูกต้อง เพิ่มรายละเอียด training process อีกนิดก็สมบูรณ์ ⭐",
      B: "ดี! เข้าใจว่า AI เรียนรู้จาก data แต่ลองเพิ่ม keyword เทคนิคเช่น training, model, weights ให้ครบ 💪",
      C: "พอใช้ได้ ลองอธิบายกระบวนการ Machine Learning ให้ชัดขึ้น — AI ใช้ข้อมูลอะไร และปรับตัวเองอย่างไร 🔧",
      D: "เริ่มต้นดี! ลองค้นหาคำว่า Machine Learning แล้วอธิบายด้วยคำพูดของคุณเอง เพิ่มตัวอย่างจากชีวิตจริงด้วย 📚",
    },
  },
];

// ─── Score Evaluation ─────────────────────────────────────────────────────────
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
    + (p1.length >= 60 ? 8 : 0) + (p2.length >= 60 ? 8 : 0));

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
  { key: "creativity" as const, label: "CREATIVITY",        color: "#f472b6", icon: "✦" },
  { key: "technical"  as const, label: "TECHNICAL ACCURACY", color: "#00f5ff", icon: "◈" },
  { key: "clarity"    as const, label: "CLARITY",            color: "#4ade80", icon: "◉" },
  { key: "teaching"   as const, label: "TEACHING SKILL",     color: "#fde047", icon: "★" },
];

// ─── Typewriter ───────────────────────────────────────────────────────────────
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

// ─── Dialogue Box ─────────────────────────────────────────────────────────────
function DialogueBox({ d, onNext, idx, total }: { d: (typeof NPC_DIALOGUE)[0]; onNext: () => void; idx: number; total: number }) {
  const { displayed, done } = useTypewriter(d.text);
  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-lg mx-auto">
      <div className="relative">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-2 border-cyan-400/40 flex items-center justify-center text-4xl" style={{ animation: "float 4s ease-in-out infinite" }}>
          {d.mood}
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#050510] border border-cyan-500/40 whitespace-nowrap">
          <span className="text-xs font-bold text-cyan-400 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>{d.speaker}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" style={{ animation: "glowPulse 2s ease-in-out infinite" }} />
        <span className="text-xs tracking-widest text-cyan-500/80" style={{ fontFamily: "var(--font-mono)" }}>{d.sub}</span>
      </div>
      <div className="w-full glass-card rounded-2xl p-5 border border-cyan-500/20 min-h-[88px]">
        <p className="text-white text-sm sm:text-base leading-relaxed text-center">
          {displayed}{!done && <span className="inline-block w-0.5 h-4 bg-cyan-400 ml-1 align-middle" style={{ animation: "pulse 1s infinite" }} />}
        </p>
      </div>
      <div className="flex gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className="h-2 rounded-full transition-all duration-300" style={{ width: i === idx ? 24 : 8, background: i === idx ? "#00f5ff" : i < idx ? "rgba(0,245,255,0.4)" : "#374151" }} />
        ))}
      </div>
      <button onClick={onNext} className="btn-neon-cyan px-8 py-3 text-xs font-bold tracking-widest rounded-xl w-full sm:w-auto" style={{ fontFamily: "var(--font-orbitron)" }}>
        {idx < total - 1 ? "NEXT ▶" : "ENTER TRAINING ▶"}
      </button>
    </div>
  );
}

// ─── Score Bar ────────────────────────────────────────────────────────────────
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

// ─── Dual Part Challenge ──────────────────────────────────────────────────────
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
        <div className="glass-card rounded-2xl p-6 border border-cyan-500/20 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" style={{ animation: "glowPulse 1s infinite" }} />
            <span className="text-xs tracking-widest text-cyan-400" style={{ fontFamily: "var(--font-mono)" }}>// AI_ANALYSIS_RUNNING...</span>
          </div>
          {evalStep >= 1 && (
            <div>
              <div className="text-xs text-pink-400/70 tracking-widest mb-2" style={{ fontFamily: "var(--font-mono)" }}>◈ SCANNING CREATIVE PATTERNS...</div>
              <ScoreBar label="CREATIVITY" value={result?.creativity ?? 0} color="#f472b6" icon="✦" show={evalStep >= 1} />
            </div>
          )}
          {evalStep >= 2 && (
            <div>
              <div className="text-xs text-cyan-400/70 tracking-widest mb-2 mt-3" style={{ fontFamily: "var(--font-mono)" }}>◈ VERIFYING TECHNICAL ACCURACY...</div>
              <ScoreBar label="TECHNICAL ACCURACY" value={result?.technical ?? 0} color="#00f5ff" icon="◈" show={evalStep >= 2} delay={60} />
            </div>
          )}
          {evalStep >= 3 && (
            <div>
              <div className="text-xs text-green-400/70 tracking-widest mb-2 mt-3" style={{ fontFamily: "var(--font-mono)" }}>◈ MEASURING CLARITY INDEX...</div>
              <ScoreBar label="CLARITY" value={result?.clarity ?? 0} color="#4ade80" icon="◉" show={evalStep >= 3} delay={60} />
            </div>
          )}
          {evalStep >= 4 && (
            <div>
              <div className="text-xs text-yellow-400/70 tracking-widest mb-2 mt-3" style={{ fontFamily: "var(--font-mono)" }}>◈ EVALUATING TEACHING SKILL...</div>
              <ScoreBar label="TEACHING SKILL" value={result?.teaching ?? 0} color="#fde047" icon="★" show={evalStep >= 4} delay={60} />
            </div>
          )}
        </div>
      </div>
    );
  }

  if (state === "scored" && result) {
    const tc = TIER_CFG[result.tier];
    return (
      <div className="w-full max-w-lg mx-auto space-y-4">
        {/* Score panel */}
        <div className="glass-card rounded-2xl p-5 border border-cyan-500/20 space-y-3">
          <div className="text-xs text-gray-500 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>// ANALYSIS_COMPLETE</div>
          <div className="space-y-3">
            {SCORE_BARS.map((bar) => (
              <ScoreBar key={bar.key} label={bar.label} value={result[bar.key]} color={bar.color} icon={bar.icon} show />
            ))}
          </div>
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
        {/* AI Feedback */}
        {showFeedback && (
          <div className="glass-card rounded-xl p-4" style={{ borderColor: `${tc.color}30`, borderWidth: 1, borderStyle: "solid" }}>
            <div className="text-xs tracking-widest mb-2" style={{ fontFamily: "var(--font-mono)", color: tc.color }}>◈ AI_FEEDBACK</div>
            <p className="text-sm text-gray-300 leading-relaxed">{result.feedback}</p>
          </div>
        )}
        <button onClick={() => onComplete(result.xpEarned)}
          className="w-full btn-neon-pink py-4 text-xs font-bold tracking-widest rounded-xl" style={{ fontFamily: "var(--font-orbitron)" }}>
          {cIdx < total - 1 ? "NEXT CHALLENGE ▶" : "COMPLETE MISSION ▶"}
        </button>
      </div>
    );
  }

  // ── Input State ──────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      {/* Progress + concept header */}
      <div className="glass-card rounded-xl p-4 border border-cyan-500/15">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>CHALLENGE {cIdx + 1}/{total}</span>
          <span className="text-xs text-cyan-400 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>● DUAL_ANALYSIS_MODE</span>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden mb-3">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${((cIdx + 1) / total) * 100}%`, background: "linear-gradient(90deg, #00f5ff, #bf00ff)" }} />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{ch.icon}</span>
          <div>
            <div className="text-xs text-gray-500 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>CONCEPT</div>
            <div className="text-sm font-black text-white" style={{ fontFamily: "var(--font-orbitron)" }}>{ch.concept}</div>
          </div>
        </div>
      </div>

      {/* Score categories legend */}
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
          <textarea
            value={part1} onChange={e => setPart1(e.target.value)} rows={4}
            placeholder={ch.part1.placeholder}
            className="w-full bg-transparent text-sm text-gray-200 placeholder-gray-700 resize-none outline-none leading-relaxed"
            style={{ fontFamily: "var(--font-mono)" }}
          />
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
          <textarea
            value={part2} onChange={e => setPart2(e.target.value)} rows={4}
            placeholder={ch.part2.placeholder}
            className="w-full bg-transparent text-sm text-gray-200 placeholder-gray-700 resize-none outline-none leading-relaxed"
            style={{ fontFamily: "var(--font-mono)" }}
          />
        </div>
      </div>

      {/* Submit */}
      <button onClick={handleSubmit} disabled={!canSubmit}
        className={`w-full py-4 text-xs font-bold tracking-widest rounded-xl transition-all ${canSubmit ? "btn-neon-pink" : "border border-gray-800 text-gray-700 cursor-not-allowed"}`}
        style={{ fontFamily: "var(--font-orbitron)" }}>
        {canSubmit ? "▶ SUBMIT TO AI ANALYSIS" : `WRITE MORE... (P1: ${Math.max(0, ch.part1.minChars - part1.trim().length)} | P2: ${Math.max(0, ch.part2.minChars - part2.trim().length)} CHARS LEFT)`}
      </button>
    </div>
  );
}

// ─── Result Screen ────────────────────────────────────────────────────────────
function ResultScreen({ totalXP, onClaim }: { totalXP: number; onClaim: () => void }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 80); }, []);
  const pct = Math.min(100, Math.round((totalXP / (MISSION.xpPerChallenge * CHALLENGES.length)) * 100));
  return (
    <div className={`w-full max-w-lg mx-auto space-y-4 transition-all duration-500 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
      <div className="glass-card rounded-2xl p-6 border border-cyan-500/20 text-center">
        <div className="text-xs text-gray-500 tracking-widest mb-3" style={{ fontFamily: "var(--font-mono)" }}>// ALL_CHALLENGES_COMPLETE</div>
        <div className="relative w-28 h-28 mx-auto mb-4">
          <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <circle cx="50" cy="50" r="40" fill="none" stroke={pct >= 75 ? "#00f5ff" : pct >= 50 ? "#4ade80" : "#fb923c"}
              strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(pct / 100) * 251} 251`}
              style={{ transition: "stroke-dasharray 1.4s ease", filter: "drop-shadow(0 0 6px currentColor)" }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-orbitron)" }}>{pct}%</div>
            <div className="text-xs text-gray-500" style={{ fontFamily: "var(--font-mono)" }}>SCORE</div>
          </div>
        </div>
        <div className="text-lg font-black text-white mb-1" style={{ fontFamily: "var(--font-orbitron)" }}>
          {pct >= 88 ? "LEGENDARY PERFORMANCE" : pct >= 73 ? "EXPERT ANALYSIS" : pct >= 55 ? "SOLID UNDERSTANDING" : "KEEP TRAINING!"}
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
      <button onClick={onClaim} className="w-full btn-neon-pink py-4 text-sm font-bold tracking-widest rounded-xl" style={{ fontFamily: "var(--font-orbitron)" }}>
        ▶ CLAIM REWARDS
      </button>
    </div>
  );
}

function CompleteScreen({ totalXP }: { totalXP: number }) {
  return (
    <div className="w-full max-w-lg mx-auto text-center space-y-6">
      <div className="text-xs tracking-widest text-cyan-400" style={{ fontFamily: "var(--font-mono)" }}>// MISSION_DEBRIEF</div>
      <h2 className="text-3xl font-black" style={{ fontFamily: "var(--font-orbitron)" }}>
        <span className="neon-text-cyan">MISSION</span><br /><span className="neon-text-pink">ACCOMPLISHED</span>
      </h2>
      <p className="text-gray-400 text-sm leading-relaxed">คุณสำเร็จภารกิจ <span className="text-white font-bold">What is AI?</span> แล้ว! ระบบ Dual-Analysis ให้คะแนนความเข้าใจของคุณใน 4 มิติเรียบร้อย</p>
      <div className="glass-card rounded-2xl p-5 text-left space-y-3">
        <div className="text-xs font-bold tracking-widest text-gray-400 mb-3" style={{ fontFamily: "var(--font-orbitron)" }}>SKILLS ACQUIRED:</div>
        {[
          { icon: "🧠", skill: "AI Fundamentals", desc: "รู้จักความหมายและแนวคิดพื้นฐานของ AI" },
          { icon: "✦", skill: "Analogy Thinking", desc: "ทักษะอธิบายแนวคิดซับซ้อนด้วยตัวอย่างง่ายๆ" },
          { icon: "◈", skill: "Technical Literacy", desc: "เข้าใจคำศัพท์เทคนิคพื้นฐานของ AI" },
        ].map(item => (
          <div key={item.skill} className="flex items-start gap-3 p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
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
        <Link href="/missions/ml-101" className="btn-neon-pink py-3 text-xs font-bold tracking-widest rounded-xl text-center" style={{ fontFamily: "var(--font-orbitron)" }}>NEXT MISSION: ML 101 →</Link>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function WhatIsAIMissionPage() {
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

      {/* Reward popup */}
      {showReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass-card rounded-3xl p-8 max-w-sm w-full text-center border border-cyan-500/30" style={{ boxShadow: "0 0 60px rgba(0,245,255,0.2)" }}>
            <div className="text-6xl mb-4" style={{ animation: "float 3s ease-in-out infinite" }}>🏆</div>
            <div className="text-xs tracking-widest text-cyan-400 mb-2" style={{ fontFamily: "var(--font-mono)" }}>MISSION COMPLETE!</div>
            <div className="text-2xl font-black text-white mb-5" style={{ fontFamily: "var(--font-orbitron)" }}>WHAT IS AI?<br /><span className="neon-text-pink">CLEARED</span></div>
            <div className="space-y-3 mb-5">
              <div className="flex justify-between p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <span className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-orbitron)" }}>⚡ XP EARNED</span>
                <span className="text-xl font-black text-yellow-400" style={{ fontFamily: "var(--font-orbitron)" }}>+{totalXP}</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-pink-500/10 border border-pink-500/20">
                <span className="text-sm font-bold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-orbitron)" }}>✦ DUAL ANALYSIS</span>
                <span className="text-sm font-black text-pink-400" style={{ fontFamily: "var(--font-orbitron)" }}>UNLOCKED</span>
              </div>
            </div>
            <button onClick={() => { setShowReward(false); setPhase("complete"); }} className="w-full btn-neon-pink py-3 text-sm font-bold tracking-widest rounded-xl" style={{ fontFamily: "var(--font-orbitron)" }}>▶ CONTINUE</button>
          </div>
        </div>
      )}

      <div className="pt-20 pb-12 px-4">
        {/* Mission header */}
        <div className="max-w-lg mx-auto mb-6">
          <div className="glass-card rounded-2xl p-4 border border-cyan-500/15">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-xl">{MISSION.icon}</div>
                <div>
                  <div className="text-xs text-cyan-400 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>{MISSION.code} • {MISSION.difficulty}</div>
                  <div className="text-sm font-black text-white" style={{ fontFamily: "var(--font-orbitron)" }}>{MISSION.title}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs" style={{ fontFamily: "var(--font-mono)" }}>
                <span className="text-yellow-400">⚡ {MISSION.xpPerChallenge * CHALLENGES.length} XP</span>
                <span className={`px-2 py-1 rounded-lg tracking-widest ${
                  phase === "briefing" ? "bg-gray-800 text-gray-500" :
                  phase === "challenge" ? "bg-pink-500/15 text-pink-400 border border-pink-500/30" :
                  phase === "result" ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30" :
                  "bg-green-500/15 text-green-400 border border-green-500/30"}`}>
                  {phase === "briefing" && "BRIEFING"}
                  {phase === "challenge" && `● C${cIdx + 1}/${CHALLENGES.length}`}
                  {phase === "result" && "RESULTS"}
                  {phase === "complete" && "✓ DONE"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center px-0">
          {phase === "briefing" && (
            <div className="w-full flex flex-col items-center justify-center min-h-[60vh]">
              <DialogueBox d={NPC_DIALOGUE[dlgIdx]} onNext={handleNextDlg} idx={dlgIdx} total={NPC_DIALOGUE.length} />
            </div>
          )}
          {phase === "challenge" && (
            <DualPartChallenge key={cIdx} ch={CHALLENGES[cIdx]} cIdx={cIdx} total={CHALLENGES.length} onComplete={handleChallengeComplete} />
          )}
          {phase === "result" && (
            <ResultScreen totalXP={totalXP} onClaim={() => setShowReward(true)} />
          )}
          {phase === "complete" && <CompleteScreen totalXP={totalXP} />}
        </div>
      </div>
    </div>
  );
}
