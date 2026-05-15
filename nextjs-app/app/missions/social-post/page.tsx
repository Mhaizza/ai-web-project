"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

type Phase = "briefing" | "input" | "evaluating" | "result" | "complete";

interface ScoreCriteria {
  label: string;
  passed: boolean;
  points: number;
  tip: string;
}

// ─── NPC Dialogue (2 screens, down from 4) ────────────────────────────────────

const NPC_DIALOGUE = [
  {
    speaker: "NEXUS",
    mood: "🤖",
    text: "AGENT_001 — มีลูกค้าต้องการความช่วยเหลือด่วน!",
    sub: "CLIENT REQUEST INCOMING...",
  },
  {
    speaker: "CLIENT: ARIA-7",
    mood: "👩‍💼",
    text: "สวัสดี! ฉัน Aria เจ้าของ VOLT BREW ☕ ต้องการ prompt สำหรับให้ AI สร้างโพสต์ Instagram โปรโมทกาแฟเย็นรสใหม่ — ต้องมีกลุ่มเป้าหมาย, แพลตฟอร์ม, อีโมจิ, hashtag และ CTA นะ!",
    sub: "MISSION OBJECTIVE LOADED — BEGIN WRITING",
  },
];

// ─── Quick-insert chips ────────────────────────────────────────────────────────

const INSERT_CHIPS = [
  { icon: "👥", label: "กลุ่มเป้าหมาย", insert: "สำหรับวัยรุ่น 18-25 ปี" },
  { icon: "📱", label: "Instagram", insert: "สำหรับ Instagram" },
  { icon: "☕", label: "อีโมจิ", insert: "ใส่อีโมจิ ☕⚡🔥" },
  { icon: "#️⃣", label: "Hashtag", insert: "#voltbrew #กาแฟ #coffee" },
  { icon: "👇", label: "CTA", insert: "พร้อม CTA ให้กดสั่งซื้อ" },
  { icon: "🎨", label: "โทน", insert: "โทนสนุกสนาน มีพลัง" },
];

// ─── Evaluation Engine ────────────────────────────────────────────────────────

function evaluate(text: string): { score: number; criteria: ScoreCriteria[]; grade: string; feedback: string } {
  const criteria: ScoreCriteria[] = [
    {
      label: "กลุ่มเป้าหมาย",
      passed: /กลุ่มเป้าหมาย|target|audience|วัยรุ่น|คนทำงาน|นักศึกษา|ผู้ใช้|ลูกค้า|คน/i.test(text),
      points: 20,
      tip: "บอก AI ว่าต้องเข้าถึงใคร เช่น 'สำหรับวัยรุ่น 18-25 ปี'",
    },
    {
      label: "แพลตฟอร์ม",
      passed: /instagram|ig|facebook|tiktok|twitter|โซเชียล|social|line/i.test(text),
      points: 15,
      tip: "ระบุว่าโพสต์นี้สำหรับ Instagram หรือที่ไหน",
    },
    {
      label: "อีโมจิ",
      passed: /emoji|อีโมจิ|🔥|✨|☕|💫|🌟|😊|🚀|❤️|👇|⚡|🎯|💥/.test(text),
      points: 15,
      tip: "ขอให้ AI ใส่อีโมจิ เช่น 'ใส่อีโมจิที่เกี่ยวกับกาแฟ'",
    },
    {
      label: "Hashtag",
      passed: /#|hashtag|แฮชแท็ก|tag/i.test(text),
      points: 15,
      tip: "ขอ hashtag เช่น 'พร้อม 5 hashtag'",
    },
    {
      label: "Call-to-Action",
      passed: /call.to.action|cta|คลิก|กด|ลองชิม|สั่ง|ซื้อ|ลงทะเบียน|follow|กดติดตาม|order|buy/i.test(text),
      points: 20,
      tip: "ขอ CTA ชัดๆ เช่น 'ประโยค Call-to-Action ให้กดสั่งซื้อ'",
    },
    {
      label: "ครบถ้วน (80+ ตัวอักษร)",
      passed: text.length >= 80,
      points: 15,
      tip: "เพิ่มรายละเอียดให้ครบ (อย่างน้อย 80 ตัวอักษร)",
    },
  ];

  const score = criteria.reduce((sum, c) => sum + (c.passed ? c.points : 0), 0);

  let grade = "D";
  let feedback = "";
  if (score >= 90) {
    grade = "S"; feedback = "เยี่ยมมาก! คุณเป็น Prompt Engineer ระดับ Elite แล้ว! 🏆";
  } else if (score >= 75) {
    grade = "A"; feedback = "ดีมาก! prompt มีองค์ประกอบครบ AI จะทำงานได้อย่างมีประสิทธิภาพ ⭐";
  } else if (score >= 55) {
    grade = "B"; feedback = "ดี! มีส่วนที่พัฒนาได้อีก ลองเพิ่มรายละเอียดที่ขาด 💪";
  } else if (score >= 35) {
    grade = "C"; feedback = "พอใช้ได้ แต่ prompt ยังไม่ชัดเจนพอ AI อาจสร้างไม่ตรงความต้องการ 🔧";
  } else {
    grade = "D"; feedback = "ลองเพิ่มข้อมูล: กลุ่มเป้าหมาย, แพลตฟอร์ม, อีโมจิ, hashtag และ CTA 📚";
  }

  return { score, criteria, grade, feedback };
}

const GRADE_CONFIG: Record<string, { color: string; xp: number; credits: number }> = {
  S: { color: "text-yellow-300", xp: 500, credits: 80 },
  A: { color: "text-cyan-300",   xp: 400, credits: 60 },
  B: { color: "text-green-400",  xp: 300, credits: 40 },
  C: { color: "text-orange-400", xp: 200, credits: 25 },
  D: { color: "text-red-400",    xp: 100, credits: 10 },
};

// ─── Typewriter ───────────────────────────────────────────────────────────────

function useTypewriter(text: string, speed = 28) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed(""); setDone(false);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(iv); setDone(true); }
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed]);
  return { displayed, done };
}

// ─── Dialogue Box ─────────────────────────────────────────────────────────────

function DialogueBox({
  dialogue, onNext, index, total,
}: {
  dialogue: (typeof NPC_DIALOGUE)[0];
  onNext: () => void;
  index: number;
  total: number;
}) {
  const { displayed, done } = useTypewriter(dialogue.text);

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm mx-auto">
      <div className="relative">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-2 border-cyan-400/40 flex items-center justify-center text-4xl" style={{ animation: "float 4s ease-in-out infinite" }}>
          {dialogue.mood}
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#050510] border border-cyan-500/40 whitespace-nowrap">
          <span className="text-xs font-bold text-cyan-400 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>{dialogue.speaker}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" style={{ animation: "glowPulse 2s infinite" }} />
        <span className="text-xs tracking-widest text-cyan-500" style={{ fontFamily: "var(--font-mono)" }}>{dialogue.sub}</span>
      </div>

      <div className="w-full glass-card rounded-2xl p-5 border border-cyan-500/20 min-h-[88px]">
        <p className="text-white text-sm leading-relaxed text-center">
          {displayed}
          {!done && <span className="inline-block w-0.5 h-4 bg-cyan-400 ml-1 align-middle" style={{ animation: "pulse 1s infinite" }} />}
        </p>
      </div>

      <div className="flex gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: i === index ? 24 : 8,
              background: i === index ? "#00f5ff" : i < index ? "rgba(0,245,255,0.4)" : "#374151",
            }}
          />
        ))}
      </div>

      <button
        onClick={onNext}
        className="w-full btn-neon-cyan py-4 text-xs font-bold tracking-widest rounded-xl"
        style={{ fontFamily: "var(--font-orbitron)" }}
      >
        {index < total - 1 ? "NEXT ▶" : "เริ่มเขียน ▶"}
      </button>
    </div>
  );
}

// ─── Live Criteria Dots ────────────────────────────────────────────────────────

function CriteriaDots({ text }: { text: string }) {
  const { criteria } = evaluate(text);
  return (
    <div className="flex flex-wrap gap-2">
      {criteria.map((c) => (
        <span
          key={c.label}
          className={`text-xs px-2.5 py-1 rounded-full border transition-all duration-300 ${
            c.passed
              ? "border-green-500/40 bg-green-500/8 text-green-400"
              : "border-gray-700/50 text-gray-600"
          }`}
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {c.passed ? "✓" : "○"} {c.label}
        </span>
      ))}
    </div>
  );
}

// ─── Evaluating Screen ────────────────────────────────────────────────────────

function EvaluatingScreen() {
  const steps = [
    "PARSING PROMPT STRUCTURE...",
    "CHECKING TARGET AUDIENCE...",
    "ANALYZING PLATFORM & TONE...",
    "EVALUATING CTA & HASHTAGS...",
    "COMPUTING FINAL SCORE...",
  ];
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s < steps.length - 1 ? s + 1 : s)), 380);
    return () => clearInterval(id);
  }, [steps.length]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20" />
        <div className="absolute inset-0 rounded-full border-4 border-t-cyan-400 border-r-transparent border-b-transparent border-l-transparent" style={{ animation: "spin 0.8s linear infinite" }} />
        <div className="absolute inset-4 rounded-full border-2 border-pink-500/30" />
        <div className="absolute inset-4 rounded-full border-2 border-t-transparent border-r-pink-400 border-b-transparent border-l-transparent" style={{ animation: "spin 1.3s linear infinite reverse" }} />
        <div className="absolute inset-0 flex items-center justify-center text-2xl">🤖</div>
      </div>

      <div className="text-center">
        <div className="text-base font-black text-white" style={{ fontFamily: "var(--font-orbitron)" }}>AI EVALUATING</div>
        <div className="text-xs text-gray-500 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>NEXUS IS ANALYZING YOUR PROMPT...</div>
      </div>

      <div className="w-full glass-card rounded-xl p-4 space-y-2">
        {steps.map((s, i) => (
          <div key={s} className={`flex items-center gap-3 transition-all duration-300 ${i > step ? "opacity-20" : ""}`}>
            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs shrink-0 ${i < step ? "bg-green-500" : i === step ? "bg-cyan-500" : "bg-gray-700"}`}>
              {i < step ? "✓" : i === step ? "●" : "○"}
            </div>
            <span className={`text-xs tracking-widest ${i === step ? "text-cyan-400" : i < step ? "text-gray-500" : "text-gray-700"}`} style={{ fontFamily: "var(--font-mono)" }}>
              {s}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Result Screen ─────────────────────────────────────────────────────────────

function ResultScreen({
  result, prompt, onClaim,
}: {
  result: ReturnType<typeof evaluate>;
  prompt: string;
  onClaim: () => void;
}) {
  const cfg = GRADE_CONFIG[result.grade];
  const [revealed, setRevealed] = useState(false);
  useEffect(() => { setTimeout(() => setRevealed(true), 400); }, []);

  const passed = result.criteria.filter((c) => c.passed);
  const failed = result.criteria.filter((c) => !c.passed);

  return (
    <div className={`w-full max-w-sm mx-auto space-y-4 transition-all duration-700 ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      {/* Grade card */}
      <div className="glass-card rounded-2xl p-5 border border-cyan-500/15 text-center">
        <p className="text-xs tracking-widest text-gray-500 mb-4" style={{ fontFamily: "var(--font-mono)" }}>// AI_EVALUATION_COMPLETE</p>

        <div className="flex items-center justify-center gap-5 mb-4">
          <div className="relative w-20 h-20 shrink-0">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42" fill="none"
                stroke={result.score >= 75 ? "#00f5ff" : result.score >= 55 ? "#4ade80" : result.score >= 35 ? "#fb923c" : "#f87171"}
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${(result.score / 100) * 264} 264`}
                style={{ transition: "stroke-dasharray 1.2s ease", filter: "drop-shadow(0 0 6px currentColor)" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-black text-white" style={{ fontFamily: "var(--font-orbitron)" }}>{result.score}</span>
              <span className="text-xs text-gray-500">/100</span>
            </div>
          </div>

          <div className="text-left">
            <div className={`text-5xl font-black ${cfg.color} drop-shadow-[0_0_15px_currentColor]`} style={{ fontFamily: "var(--font-orbitron)" }}>
              {result.grade}
            </div>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">{result.feedback}</p>
          </div>
        </div>

        {/* Compact criteria */}
        <div className="flex flex-wrap gap-2 justify-center">
          {result.criteria.map((c) => (
            <span key={c.label} className={`text-xs px-2 py-1 rounded-full border ${c.passed ? "border-green-500/40 text-green-400 bg-green-500/8" : "border-red-500/30 text-red-400/60 bg-red-500/5"}`} style={{ fontFamily: "var(--font-mono)" }}>
              {c.passed ? "✓" : "✗"} {c.label}
            </span>
          ))}
        </div>
      </div>

      {/* Tips for failed criteria */}
      {failed.length > 0 && (
        <div className="glass-card rounded-xl p-4 border border-orange-500/15 space-y-2">
          <p className="text-xs font-bold text-orange-400 tracking-widest mb-1" style={{ fontFamily: "var(--font-mono)" }}>💡 ปรับปรุงได้:</p>
          {failed.map((c) => (
            <p key={c.label} className="text-xs text-gray-400 leading-relaxed">• {c.tip}</p>
          ))}
        </div>
      )}

      {/* Your prompt preview */}
      <div className="glass-card rounded-xl p-4 border border-gray-700/30">
        <p className="text-xs text-gray-600 tracking-widest mb-2" style={{ fontFamily: "var(--font-mono)" }}>YOUR PROMPT:</p>
        <p className="text-xs text-gray-400 leading-relaxed italic">"{prompt.slice(0, 120)}{prompt.length > 120 ? "…" : ""}"</p>
      </div>

      <button
        onClick={onClaim}
        className="w-full btn-neon-pink py-4 text-sm font-bold tracking-widest rounded-xl"
        style={{ fontFamily: "var(--font-orbitron)" }}
      >
        ▶ CLAIM REWARDS
      </button>
    </div>
  );
}

// ─── Reward Popup ──────────────────────────────────────────────────────────────

function RewardPopup({ grade, onClose }: { grade: string; onClose: () => void }) {
  const cfg = GRADE_CONFIG[grade];
  const [animIn, setAnimIn] = useState(false);
  useEffect(() => { setTimeout(() => setAnimIn(true), 50); }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div
        className={`glass-card rounded-3xl p-8 max-w-sm w-full text-center border border-cyan-500/30 transition-all duration-500 ${animIn ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}
        style={{ boxShadow: "0 0 60px rgba(0,245,255,0.2), 0 0 120px rgba(255,0,128,0.1)" }}
      >
        <div className="text-6xl mb-4" style={{ animation: "float 3s ease-in-out infinite" }}>🏆</div>
        <p className="text-xs tracking-widest text-cyan-400 mb-2" style={{ fontFamily: "var(--font-mono)" }}>MISSION COMPLETE!</p>
        <p className="text-2xl font-black text-white mb-5" style={{ fontFamily: "var(--font-orbitron)" }}>
          SOCIAL AI<br /><span className="neon-text-pink">CLEARED</span>
        </p>

        <div className="space-y-2.5 mb-5">
          <div className="flex items-center justify-between p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <span className="text-sm font-bold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-orbitron)" }}>⚡ XP</span>
            <span className="text-xl font-black text-yellow-400" style={{ fontFamily: "var(--font-orbitron)" }}>+{cfg.xp}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <span className="text-sm font-bold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-orbitron)" }}>💎 CREDITS</span>
            <span className="text-xl font-black text-purple-400" style={{ fontFamily: "var(--font-orbitron)" }}>+{cfg.credits}</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-pink-500/10 border border-pink-500/20">
            <span>🔓</span>
            <span className="text-xs text-pink-400 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>PROMPT ENGINEER BADGE</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full btn-neon-pink py-3 text-sm font-bold tracking-widest rounded-xl"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          ▶ CONTINUE
        </button>
      </div>
    </div>
  );
}

// ─── Complete Screen ───────────────────────────────────────────────────────────

function MissionCompleteScreen({ grade }: { grade: string }) {
  const cfg = GRADE_CONFIG[grade];
  return (
    <div className="w-full max-w-sm mx-auto text-center space-y-5">
      <p className="text-xs tracking-widest text-cyan-400" style={{ fontFamily: "var(--font-mono)" }}>// MISSION_DEBRIEF</p>
      <h2 className="text-3xl font-black" style={{ fontFamily: "var(--font-orbitron)" }}>
        <span className="neon-text-cyan">MISSION</span><br />
        <span className="neon-text-pink">ACCOMPLISHED</span>
      </h2>
      <p className="text-gray-400 text-sm">คุณผ่านภารกิจ <span className="text-white font-bold">Social AI Agent</span> แล้ว!</p>

      <div className="glass-card rounded-2xl p-5 text-left space-y-2.5">
        <p className="text-xs font-bold tracking-widest text-gray-400 mb-3" style={{ fontFamily: "var(--font-orbitron)" }}>SKILLS ACQUIRED:</p>
        {[
          { icon: "🎯", skill: "Prompt Engineering", desc: "รู้จักองค์ประกอบสำคัญของ prompt ที่ดี" },
          { icon: "📱", skill: "Social Media AI", desc: "ประยุกต์ AI สำหรับสร้างคอนเทนต์โซเชียล" },
          { icon: "🤖", skill: "AI Communication", desc: "สื่อสารกับ AI ได้ชัดเจนและมีประสิทธิภาพ" },
        ].map((item) => (
          <div key={item.skill} className="flex items-center gap-3 p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
            <span className="text-lg shrink-0">{item.icon}</span>
            <div>
              <p className="text-xs font-bold text-white" style={{ fontFamily: "var(--font-orbitron)" }}>{item.skill}</p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <Link href="/dashboard" className="btn-neon-cyan py-3 text-xs font-bold tracking-widest rounded-xl text-center" style={{ fontFamily: "var(--font-orbitron)" }}>
          ← BACK TO HQ
        </Link>
        <Link href="/missions/social-post" className="btn-neon-pink py-3 text-xs font-bold tracking-widest rounded-xl text-center" style={{ fontFamily: "var(--font-orbitron)" }}>
          🔄 REPLAY
        </Link>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function SocialPostMissionPage() {
  const [phase, setPhase] = useState<Phase>("briefing");
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<ReturnType<typeof evaluate> | null>(null);
  const [showReward, setShowReward] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const MIN_CHARS = 30;

  function handleNextDialogue() {
    if (dialogueIndex < NPC_DIALOGUE.length - 1) {
      setDialogueIndex((i) => i + 1);
    } else {
      setPhase("input");
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }

  function handleSubmit() {
    if (prompt.length < MIN_CHARS) return;
    setPhase("evaluating");
    setTimeout(() => {
      setResult(evaluate(prompt));
      setPhase("result");
    }, 2200);
  }

  function insertChip(text: string) {
    const ta = textareaRef.current;
    const sep = prompt.trim().length > 0 ? " " : "";
    const newVal = prompt + sep + text;
    setPrompt(newVal);
    ta?.focus();
  }

  const charCount = prompt.length;
  const liveResult = evaluate(prompt);
  const passedCount = liveResult.criteria.filter((c) => c.passed).length;

  return (
    <div className="min-h-screen bg-[#050510] cyber-grid">
      <Navbar />

      {showReward && result && (
        <RewardPopup grade={result.grade} onClose={() => { setShowReward(false); setPhase("complete"); }} />
      )}

      <div className="pt-20 pb-12 px-4">
        {/* Mission header */}
        <div className="max-w-sm mx-auto mb-5">
          <div className="glass-card rounded-xl p-3 border border-pink-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-lg">✍️</div>
                <div>
                  <p className="text-xs text-pink-400 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>M-004 • EASY</p>
                  <p className="text-sm font-black text-white" style={{ fontFamily: "var(--font-orbitron)" }}>SOCIAL AI AGENT</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-lg tracking-widest ${
                phase === "briefing" ? "bg-gray-700/50 text-gray-500"
                : phase === "input" ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                : phase === "evaluating" ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
                : phase === "result" ? "bg-pink-500/15 text-pink-400 border border-pink-500/30"
                : "bg-green-500/15 text-green-400 border border-green-500/30"
              }`} style={{ fontFamily: "var(--font-mono)" }}>
                {phase === "briefing" && "BRIEFING"}
                {phase === "input" && `● ${passedCount}/6`}
                {phase === "evaluating" && "EVALUATING"}
                {phase === "result" && "RESULTS"}
                {phase === "complete" && "✓ DONE"}
              </span>
            </div>
          </div>
        </div>

        {/* Briefing */}
        {phase === "briefing" && (
          <div className="flex flex-col items-center min-h-[60vh] justify-center">
            <DialogueBox
              dialogue={NPC_DIALOGUE[dialogueIndex]}
              onNext={handleNextDialogue}
              index={dialogueIndex}
              total={NPC_DIALOGUE.length}
            />
          </div>
        )}

        {/* Input */}
        {phase === "input" && (
          <div className="max-w-sm mx-auto space-y-4">
            {/* Compact objective */}
            <div className="glass-card rounded-xl p-4 border border-yellow-500/20 bg-yellow-500/5">
              <div className="flex items-start gap-2.5">
                <span className="text-xl shrink-0">📋</span>
                <p className="text-sm text-gray-300 leading-relaxed">
                  เขียน <span className="text-white font-bold">prompt</span> สั่งให้ AI สร้าง{" "}
                  <span className="text-yellow-400 font-bold">โพสต์ Instagram</span>{" "}
                  โปรโมท <span className="text-cyan-400 font-bold">VOLT BREW ☕</span> รสใหม่
                </p>
              </div>
            </div>

            {/* Quick-insert chips */}
            <div>
              <p className="text-xs text-gray-600 tracking-widest mb-2" style={{ fontFamily: "var(--font-mono)" }}>
                แตะเพื่อเพิ่มลงใน prompt:
              </p>
              <div className="flex flex-wrap gap-2">
                {INSERT_CHIPS.map((chip) => {
                  const alreadyUsed = prompt.toLowerCase().includes(chip.insert.toLowerCase().slice(0, 8));
                  return (
                    <button
                      key={chip.label}
                      onClick={() => insertChip(chip.insert)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all duration-200 active:scale-95 ${
                        alreadyUsed
                          ? "border-green-500/40 bg-green-500/8 text-green-400"
                          : "border-gray-700/60 text-gray-400 hover:border-cyan-500/40 hover:bg-cyan-500/5 hover:text-gray-200"
                      }`}
                    >
                      <span>{chip.icon}</span>
                      <span>{chip.label}</span>
                      {alreadyUsed && <span className="text-green-400">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Textarea */}
            <div className="glass-card rounded-xl overflow-hidden border border-cyan-500/20 focus-within:border-cyan-500/50 transition-colors">
              <div className="px-4 py-2 border-b border-cyan-500/10 flex items-center gap-2 bg-cyan-500/5">
                <div className="w-2 h-2 rounded-full bg-cyan-400" style={{ animation: "glowPulse 2s infinite" }} />
                <span className="text-xs text-cyan-400 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>PROMPT_INPUT.txt</span>
              </div>
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="เขียน prompt ที่นี่ หรือแตะ chips ด้านบนเพื่อเพิ่มข้อความ..."
                rows={6}
                className="w-full bg-transparent p-4 text-sm text-gray-200 placeholder-gray-600 resize-none outline-none leading-relaxed"
                style={{ fontFamily: "var(--font-mono)" }}
              />
              <div className="px-4 py-2 border-t border-cyan-500/10 flex items-center justify-between">
                <span className={`text-xs tracking-widest ${charCount < MIN_CHARS ? "text-red-500" : "text-green-400"}`} style={{ fontFamily: "var(--font-mono)" }}>
                  {charCount} CHARS {charCount < MIN_CHARS ? `(MIN ${MIN_CHARS})` : "✓"}
                </span>
                <span className="text-xs text-gray-600" style={{ fontFamily: "var(--font-mono)" }}>
                  {passedCount}/6 criteria
                </span>
              </div>
            </div>

            {/* Live criteria */}
            {charCount > 0 && <CriteriaDots text={prompt} />}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={charCount < MIN_CHARS}
              className={`w-full py-4 text-sm font-bold tracking-widest rounded-xl transition-all ${
                charCount >= MIN_CHARS
                  ? "btn-neon-pink"
                  : "border border-gray-700 text-gray-600 cursor-not-allowed"
              }`}
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              {charCount < MIN_CHARS
                ? `เพิ่มอีก ${MIN_CHARS - charCount} ตัวอักษร...`
                : "▶ ส่งให้ AI ประเมิน"}
            </button>
          </div>
        )}

        {/* Evaluating */}
        {phase === "evaluating" && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <EvaluatingScreen />
          </div>
        )}

        {/* Result */}
        {phase === "result" && result && (
          <div className="max-w-sm mx-auto">
            <ResultScreen result={result} prompt={prompt} onClaim={() => setShowReward(true)} />
          </div>
        )}

        {/* Complete */}
        {phase === "complete" && result && (
          <MissionCompleteScreen grade={result.grade} />
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
