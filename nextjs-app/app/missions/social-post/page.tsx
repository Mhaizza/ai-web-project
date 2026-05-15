"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "briefing" | "input" | "evaluating" | "result" | "complete";

interface ScoreCriteria {
  label: string;
  passed: boolean;
  points: number;
  tip: string;
}

// ─── NPC Dialogue ─────────────────────────────────────────────────────────────

const NPC_DIALOGUE = [
  {
    speaker: "NEXUS",
    mood: "🤖",
    text: "AGENT_001 — ยินดีต้อนรับสู่ภารกิจแรกของคุณ",
    sub: "MISSION BRIEFING INCOMING...",
  },
  {
    speaker: "CLIENT: ARIA-7",
    mood: "👩‍💼",
    text: "สวัสดี! ฉันชื่อ Aria เจ้าของแบรนด์กาแฟ 'VOLT BREW' ต้องการความช่วยเหลือ",
    sub: "CLIENT REQUEST RECEIVED",
  },
  {
    speaker: "CLIENT: ARIA-7",
    mood: "👩‍💼",
    text: "อยากให้คุณเขียน prompt สำหรับให้ AI สร้างโพสต์ Instagram โปรโมทกาแฟเย็นรสใหม่ของฉัน",
    sub: "MISSION OBJECTIVE LOADED",
  },
  {
    speaker: "NEXUS",
    mood: "🤖",
    text: "เป้าหมาย: เขียน prompt ที่ระบุ กลุ่มเป้าหมาย / แพลตฟอร์ม / โทน / อีโมจิ / และ Call-to-Action",
    sub: "AI EVALUATION READY — GOOD LUCK AGENT",
  },
];

// ─── Evaluation Engine ────────────────────────────────────────────────────────

function evaluate(text: string): { score: number; criteria: ScoreCriteria[]; grade: string; feedback: string } {
  const t = text.toLowerCase();

  const criteria: ScoreCriteria[] = [
    {
      label: "ระบุกลุ่มเป้าหมาย",
      passed:
        /กลุ่มเป้าหมาย|target|audience|วัยรุ่น|คนทำงาน|นักศึกษา|ผู้ใช้|ลูกค้า|สาวก|คน/i.test(text),
      points: 20,
      tip: "บอก AI ว่าโพสต์นี้ต้องการเข้าถึงใคร เช่น 'สำหรับวัยรุ่น 18-25 ปี'",
    },
    {
      label: "ระบุแพลตฟอร์ม",
      passed:
        /instagram|ig|facebook|tiktok|twitter|โซเชียล|social media|line/i.test(text),
      points: 15,
      tip: "ระบุว่าโพสต์นี้สำหรับแพลตฟอร์มไหน เช่น 'สำหรับ Instagram'",
    },
    {
      label: "มีอีโมจิหรือสั่งให้ใช้อีโมจิ",
      passed: /emoji|อีโมจิ|🔥|✨|☕|💫|🌟|😊|🚀|❤️|👇|⚡|🎯|💥|🌙|🌈/.test(text),
      points: 15,
      tip: "บอก AI ว่าต้องใช้อีโมจิให้เหมาะสม เช่น 'ใช้อีโมจิที่เกี่ยวกับกาแฟและพลังงาน'",
    },
    {
      label: "กล่าวถึง Hashtag",
      passed: /#|hashtag|แฮชแท็ก|แฮชแท็ค|tag/i.test(text),
      points: 15,
      tip: "บอก AI ว่าต้องการ hashtag กี่อัน เช่น 'พร้อม 5 hashtag ที่เกี่ยวข้อง'",
    },
    {
      label: "มี Call-to-Action",
      passed:
        /call.to.action|cta|คลิก|กด|ลองชิม|สั่ง|ซื้อ|ลงทะเบียน|สมัคร|ดู|follow|กดติดตาม|link|ลิ้ง|order|buy/i.test(
          text
        ),
      points: 20,
      tip: "ขอ CTA ที่ชัดเจน เช่น 'พร้อมประโยค Call-to-Action ให้คลิกสั่งซื้อ'",
    },
    {
      label: "Prompt มีความละเอียดเพียงพอ",
      passed: text.length >= 80,
      points: 15,
      tip: "เขียน prompt ให้ละเอียดมากขึ้น (อย่างน้อย 80 ตัวอักษร)",
    },
  ];

  const score = criteria.reduce((sum, c) => sum + (c.passed ? c.points : 0), 0);

  let grade = "F";
  let feedback = "";

  if (score >= 90) {
    grade = "S";
    feedback = "เยี่ยมมาก! คุณเป็น Prompt Engineer ระดับ Elite แล้ว! AI จะสร้างโพสต์ที่สมบูรณ์แบบตาม prompt ของคุณ 🏆";
  } else if (score >= 75) {
    grade = "A";
    feedback = "ดีมาก! prompt ของคุณมีองค์ประกอบครบถ้วนเกือบหมด AI จะทำงานได้อย่างมีประสิทธิภาพ ⭐";
  } else if (score >= 55) {
    grade = "B";
    feedback = "ดี! แต่ยังมีส่วนที่พัฒนาได้อีก ลองเพิ่มรายละเอียดที่ขาดเพื่อให้ผลลัพธ์ดีขึ้น 💪";
  } else if (score >= 35) {
    grade = "C";
    feedback = "พอใช้ได้ แต่ prompt ยังไม่ชัดเจนพอ AI อาจสร้างโพสต์ที่ไม่ตรงความต้องการ 🔧";
  } else {
    grade = "D";
    feedback = "ต้องพัฒนาอีกมาก ลองเพิ่มข้อมูลเกี่ยวกับกลุ่มเป้าหมาย แพลตฟอร์ม และสิ่งที่ต้องการให้ AI สร้าง 📚";
  }

  return { score, criteria, grade, feedback };
}

// ─── Grade Config ─────────────────────────────────────────────────────────────

const GRADE_CONFIG: Record<string, { color: string; glow: string; xp: number; credits: number }> = {
  S: { color: "text-yellow-300", glow: "shadow-yellow-400/50", xp: 500, credits: 80 },
  A: { color: "text-cyan-300",   glow: "shadow-cyan-400/40",   xp: 400, credits: 60 },
  B: { color: "text-green-400",  glow: "shadow-green-400/40",  xp: 300, credits: 40 },
  C: { color: "text-orange-400", glow: "shadow-orange-400/40", xp: 200, credits: 25 },
  D: { color: "text-red-400",    glow: "shadow-red-400/40",    xp: 100, credits: 10 },
};

// ─── Typewriter Hook ──────────────────────────────────────────────────────────

function useTypewriter(text: string, speed = 30) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayed, done };
}

// ─── Components ───────────────────────────────────────────────────────────────

function DialogueBox({
  dialogue,
  onNext,
  index,
  total,
}: {
  dialogue: (typeof NPC_DIALOGUE)[0];
  onNext: () => void;
  index: number;
  total: number;
}) {
  const { displayed, done } = useTypewriter(dialogue.text, 28);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
      {/* Speaker avatar */}
      <div className="relative">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-2 border-cyan-400/40 flex items-center justify-center text-4xl animate-float">
          {dialogue.mood}
        </div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#050510] border border-cyan-500/40 whitespace-nowrap">
          <span className="text-xs font-bold text-cyan-400 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
            {dialogue.speaker}
          </span>
        </div>
      </div>

      {/* Sub label */}
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-glow-pulse" />
        <span className="text-xs tracking-widest text-cyan-500" style={{ fontFamily: "var(--font-mono)" }}>
          {dialogue.sub}
        </span>
      </div>

      {/* Dialogue bubble */}
      <div className="w-full glass-card rounded-2xl p-6 border border-cyan-500/20 relative min-h-[90px]">
        <p className="text-white text-base sm:text-lg leading-relaxed text-center">
          {displayed}
          {!done && <span className="inline-block w-0.5 h-5 bg-cyan-400 ml-1 animate-pulse align-middle" />}
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i === index ? "bg-cyan-400 w-6" : i < index ? "bg-cyan-700" : "bg-gray-700"
            }`}
          />
        ))}
      </div>

      {/* Next button */}
      <button
        onClick={onNext}
        className="btn-neon-cyan px-8 py-3 text-xs font-bold tracking-widest rounded-xl"
        style={{ fontFamily: "var(--font-orbitron)" }}
      >
        {index < total - 1 ? "NEXT ▶" : "START MISSION ▶"}
      </button>
    </div>
  );
}

function EvaluatingScreen() {
  const steps = [
    "PARSING PROMPT STRUCTURE...",
    "ANALYZING TARGET AUDIENCE...",
    "CHECKING PLATFORM SPECS...",
    "EVALUATING CTA EFFECTIVENESS...",
    "COMPUTING FINAL SCORE...",
  ];
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => (s < steps.length - 1 ? s + 1 : s));
    }, 380);
    return () => clearInterval(id);
  }, [steps.length]);

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-lg mx-auto">
      {/* Spinning ring */}
      <div className="relative w-28 h-28">
        <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20" />
        <div
          className="absolute inset-0 rounded-full border-4 border-t-cyan-400 border-r-transparent border-b-transparent border-l-transparent"
          style={{ animation: "spin 0.8s linear infinite" }}
        />
        <div className="absolute inset-4 rounded-full border-2 border-pink-500/30" />
        <div
          className="absolute inset-4 rounded-full border-2 border-t-transparent border-r-pink-400 border-b-transparent border-l-transparent"
          style={{ animation: "spin 1.3s linear infinite reverse" }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-3xl">🤖</div>
      </div>

      <div className="text-center space-y-1">
        <div className="text-lg font-black text-white" style={{ fontFamily: "var(--font-orbitron)" }}>
          AI EVALUATING
        </div>
        <div className="text-xs text-gray-500 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
          NEXUS IS ANALYZING YOUR PROMPT...
        </div>
      </div>

      {/* Steps */}
      <div className="w-full glass-card rounded-xl p-4 space-y-2">
        {steps.map((s, i) => (
          <div key={s} className={`flex items-center gap-3 transition-all duration-300 ${i > step ? "opacity-20" : ""}`}>
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center text-xs shrink-0 ${
                i < step
                  ? "bg-green-500"
                  : i === step
                  ? "bg-cyan-500 animate-glow-pulse"
                  : "bg-gray-700"
              }`}
            >
              {i < step ? "✓" : i === step ? "●" : "○"}
            </div>
            <span
              className={`text-xs tracking-widest ${i === step ? "text-cyan-400" : i < step ? "text-gray-500" : "text-gray-700"}`}
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {s}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultScreen({
  result,
  prompt,
  onClaim,
}: {
  result: ReturnType<typeof evaluate>;
  prompt: string;
  onClaim: () => void;
}) {
  const cfg = GRADE_CONFIG[result.grade];
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      {/* Grade card */}
      <div className={`glass-card rounded-2xl p-6 border border-cyan-500/15 text-center transition-all duration-700 ${revealed ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
        <div className="text-xs tracking-widest text-gray-500 mb-3" style={{ fontFamily: "var(--font-mono)" }}>
          // AI_EVALUATION_COMPLETE
        </div>

        <div className="flex items-center justify-center gap-6 mb-4">
          {/* Score ring */}
          <div className="relative w-24 h-24 shrink-0">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42" fill="none"
                stroke={result.score >= 75 ? "#00f5ff" : result.score >= 55 ? "#4ade80" : result.score >= 35 ? "#fb923c" : "#f87171"}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(result.score / 100) * 264} 264`}
                style={{ transition: "stroke-dasharray 1.2s ease", filter: "drop-shadow(0 0 6px currentColor)" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-orbitron)" }}>
                {result.score}
              </span>
              <span className="text-xs text-gray-500">/ 100</span>
            </div>
          </div>

          {/* Grade + feedback */}
          <div className="text-left flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-5xl font-black ${cfg.color} drop-shadow-[0_0_15px_currentColor]`} style={{ fontFamily: "var(--font-orbitron)" }}>
                {result.grade}
              </span>
              <div>
                <div className="text-xs text-gray-500 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>GRADE</div>
                <div className="text-xs text-gray-400">
                  {result.score >= 90 ? "ELITE" : result.score >= 75 ? "EXPERT" : result.score >= 55 ? "INTERMEDIATE" : result.score >= 35 ? "BEGINNER" : "NOVICE"}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{result.feedback}</p>
          </div>
        </div>
      </div>

      {/* Criteria breakdown */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-cyan-500/10">
          <span className="text-xs font-bold tracking-widest text-gray-400" style={{ fontFamily: "var(--font-orbitron)" }}>
            EVALUATION BREAKDOWN
          </span>
        </div>
        <div className="p-4 space-y-2">
          {result.criteria.map((c) => (
            <div key={c.label} className={`flex items-start gap-3 p-3 rounded-xl transition-all ${c.passed ? "bg-green-500/5 border border-green-500/15" : "bg-red-500/5 border border-red-500/10"}`}>
              <span className={`text-base shrink-0 mt-0.5 ${c.passed ? "text-green-400" : "text-red-400"}`}>
                {c.passed ? "✓" : "✗"}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-orbitron)" }}>
                    {c.label}
                  </span>
                  <span className={`text-xs font-bold shrink-0 ${c.passed ? "text-green-400" : "text-gray-600"}`} style={{ fontFamily: "var(--font-mono)" }}>
                    {c.passed ? `+${c.points}` : `+0`} / {c.points}
                  </span>
                </div>
                {!c.passed && (
                  <p className="text-xs text-gray-500 leading-relaxed">💡 {c.tip}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Your prompt */}
      <div className="glass-card rounded-xl p-4 border border-gray-700/30">
        <div className="text-xs text-gray-600 tracking-widest mb-2" style={{ fontFamily: "var(--font-mono)" }}>
          YOUR PROMPT:
        </div>
        <p className="text-sm text-gray-400 leading-relaxed italic">"{prompt}"</p>
      </div>

      {/* Claim button */}
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

function RewardPopup({ grade, onClose }: { grade: string; onClose: () => void }) {
  const cfg = GRADE_CONFIG[grade];
  const [animIn, setAnimIn] = useState(false);
  const [particles] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      size: 4 + Math.random() * 6,
      color: ["#00f5ff", "#ff0080", "#bf00ff", "#ffff00"][Math.floor(Math.random() * 4)],
    }))
  );

  useEffect(() => {
    const t = setTimeout(() => setAnimIn(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      {/* Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: "50%",
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            animation: `float 2s ${p.delay}s ease-out forwards`,
            opacity: animIn ? 1 : 0,
          }}
        />
      ))}

      <div
        className={`glass-card rounded-3xl p-8 max-w-sm w-full text-center border border-cyan-500/30 transition-all duration-500
          ${animIn ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}
        style={{ boxShadow: "0 0 60px rgba(0,245,255,0.2), 0 0 120px rgba(255,0,128,0.1)" }}
      >
        {/* Trophy */}
        <div className="text-6xl mb-4 animate-float">🏆</div>

        <div className="text-xs tracking-widest text-cyan-400 mb-2" style={{ fontFamily: "var(--font-mono)" }}>
          MISSION COMPLETE!
        </div>
        <div className="text-2xl font-black text-white mb-6" style={{ fontFamily: "var(--font-orbitron)" }}>
          SOCIAL AI<br />
          <span className="neon-text-pink">MISSION CLEARED</span>
        </div>

        {/* Rewards */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <span className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-orbitron)" }}>
                XP EARNED
              </span>
            </div>
            <span className="text-xl font-black text-yellow-400" style={{ fontFamily: "var(--font-orbitron)" }}>
              +{cfg.xp}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <div className="flex items-center gap-2">
              <span className="text-xl">💎</span>
              <span className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-orbitron)" }}>
                CREDITS
              </span>
            </div>
            <span className="text-xl font-black text-purple-400" style={{ fontFamily: "var(--font-orbitron)" }}>
              +{cfg.credits}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎖️</span>
              <span className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-orbitron)" }}>
                GRADE
              </span>
            </div>
            <span className={`text-2xl font-black ${cfg.color}`} style={{ fontFamily: "var(--font-orbitron)", filter: "drop-shadow(0 0 8px currentColor)" }}>
              {grade}
            </span>
          </div>
        </div>

        {/* Unlock badge */}
        <div className="flex items-center gap-2 justify-center p-2 rounded-lg bg-pink-500/10 border border-pink-500/20 mb-6">
          <span className="text-sm">🔓</span>
          <span className="text-xs text-pink-400 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
            UNLOCKED: PROMPT ENGINEER BADGE
          </span>
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

function MissionCompleteScreen({ grade }: { grade: string }) {
  const cfg = GRADE_CONFIG[grade];

  return (
    <div className="w-full max-w-2xl mx-auto text-center space-y-8">
      <div className="text-xs tracking-widest text-cyan-400" style={{ fontFamily: "var(--font-mono)" }}>
        // MISSION_DEBRIEF
      </div>

      <h2 className="text-3xl sm:text-4xl font-black" style={{ fontFamily: "var(--font-orbitron)" }}>
        <span className="neon-text-cyan">MISSION</span>
        <br />
        <span className="neon-text-pink">ACCOMPLISHED</span>
      </h2>

      <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
        คุณสำเร็จภารกิจ <span className="text-white font-bold">Social AI Agent</span> แล้ว!
        ทักษะ Prompt Engineering ของคุณได้รับการพัฒนา — เดินหน้าสู่ภารกิจถัดไป
      </p>

      {/* Grade badge */}
      <div className="inline-flex flex-col items-center gap-2">
        <div
          className={`w-24 h-24 rounded-2xl flex items-center justify-center text-5xl font-black ${cfg.color} border-2 border-current`}
          style={{ fontFamily: "var(--font-orbitron)", boxShadow: `0 0 30px currentColor, 0 0 60px currentColor` }}
        >
          {grade}
        </div>
        <span className="text-xs text-gray-500 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>FINAL GRADE</span>
      </div>

      {/* What you learned */}
      <div className="glass-card rounded-2xl p-6 text-left space-y-3">
        <div className="text-xs font-bold tracking-widest text-gray-400 mb-4" style={{ fontFamily: "var(--font-orbitron)" }}>
          SKILLS ACQUIRED:
        </div>
        {[
          { icon: "🎯", skill: "Prompt Engineering Basics", desc: "รู้จักองค์ประกอบสำคัญของ prompt ที่ดี" },
          { icon: "📱", skill: "Social Media AI", desc: "ประยุกต์ใช้ AI สำหรับสร้างคอนเทนต์โซเชียล" },
          { icon: "🤖", skill: "AI Communication", desc: "สื่อสารกับ AI ได้อย่างชัดเจนและมีประสิทธิภาพ" },
        ].map((item) => (
          <div key={item.skill} className="flex items-start gap-3 p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
            <span className="text-xl shrink-0">{item.icon}</span>
            <div>
              <div className="text-sm font-bold text-white mb-0.5" style={{ fontFamily: "var(--font-orbitron)" }}>
                {item.skill}
              </div>
              <div className="text-xs text-gray-500">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/dashboard"
          className="flex-1 btn-neon-cyan py-3 text-xs font-bold tracking-widest rounded-xl text-center"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          ← BACK TO HQ
        </Link>
        <Link
          href="/missions/social-post"
          className="flex-1 btn-neon-pink py-3 text-xs font-bold tracking-widest rounded-xl text-center"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          🔄 REPLAY MISSION
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

  const charCount = prompt.length;
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
    if (charCount < MIN_CHARS) return;
    setPhase("evaluating");
    setTimeout(() => {
      setResult(evaluate(prompt));
      setPhase("result");
    }, 2200);
  }

  function handleClaimReward() {
    setShowReward(true);
  }

  function handleRewardClose() {
    setShowReward(false);
    setPhase("complete");
  }

  return (
    <div className="min-h-screen bg-[#050510] cyber-grid">
      <Navbar />

      {/* Reward popup */}
      {showReward && result && (
        <RewardPopup grade={result.grade} onClose={handleRewardClose} />
      )}

      <div className="pt-20 pb-12 px-4">
        {/* Mission header bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="glass-card rounded-2xl p-4 border border-pink-500/20">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-xl">
                  ✍️
                </div>
                <div>
                  <div className="text-xs text-pink-400 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
                    M-004 • EASY
                  </div>
                  <div className="text-sm font-black text-white" style={{ fontFamily: "var(--font-orbitron)" }}>
                    SOCIAL AI AGENT
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs" style={{ fontFamily: "var(--font-mono)" }}>
                <span className="flex items-center gap-1 text-yellow-400">
                  <span>⚡</span> 500 XP
                </span>
                <span className="flex items-center gap-1 text-purple-400">
                  <span>💎</span> 80 Credits
                </span>
                <span className={`px-2 py-1 rounded-lg tracking-widest
                  ${phase === "briefing" ? "bg-gray-700/50 text-gray-500" : ""}
                  ${phase === "input" ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30" : ""}
                  ${phase === "evaluating" ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30" : ""}
                  ${phase === "result" ? "bg-pink-500/15 text-pink-400 border border-pink-500/30" : ""}
                  ${phase === "complete" ? "bg-green-500/15 text-green-400 border border-green-500/30" : ""}
                `}>
                  {phase === "briefing" && "BRIEFING"}
                  {phase === "input" && "● ACTIVE"}
                  {phase === "evaluating" && "EVALUATING"}
                  {phase === "result" && "RESULTS"}
                  {phase === "complete" && "✓ COMPLETE"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Phase: Briefing */}
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

        {/* Phase: Input */}
        {phase === "input" && (
          <div className="max-w-2xl mx-auto space-y-5">
            {/* Objective card */}
            <div className="glass-card rounded-2xl p-5 border border-yellow-500/20 bg-yellow-500/5">
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">📋</span>
                <div>
                  <div className="text-xs font-bold tracking-widest text-yellow-400 mb-1" style={{ fontFamily: "var(--font-orbitron)" }}>
                    MISSION OBJECTIVE
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    เขียน <span className="text-white font-bold">prompt</span> เพื่อสั่งให้ AI สร้าง{" "}
                    <span className="text-yellow-400 font-bold">โพสต์ Instagram</span>{" "}
                    โปรโมทกาแฟเย็นรสใหม่ของ <span className="text-cyan-400 font-bold">VOLT BREW</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Hints */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { icon: "👥", hint: "กลุ่มเป้าหมาย" },
                { icon: "📱", hint: "แพลตฟอร์ม" },
                { icon: "😊", hint: "อีโมจิ" },
                { icon: "#️⃣", hint: "Hashtag" },
                { icon: "👇", hint: "Call-to-Action" },
                { icon: "📝", hint: "รายละเอียด" },
              ].map((h) => (
                <div
                  key={h.hint}
                  className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/40 border border-gray-700/30 text-xs text-gray-500"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  <span>{h.icon}</span> {h.hint}
                </div>
              ))}
            </div>

            {/* Textarea */}
            <div className="glass-card rounded-2xl overflow-hidden border border-cyan-500/20 focus-within:border-cyan-500/50 transition-colors">
              <div className="px-4 py-2 border-b border-cyan-500/10 flex items-center gap-2 bg-cyan-500/5">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-glow-pulse" />
                <span className="text-xs text-cyan-400 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
                  PROMPT_INPUT.txt
                </span>
              </div>
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="เขียน prompt ของคุณที่นี่...

ตัวอย่าง: 'เขียนโพสต์ Instagram สำหรับวัยรุ่น 18-25 ปี โปรโมทกาแฟเย็น VOLT BREW รสใหม่ ใช้โทนสนุกสนาน มีพลัง ใส่อีโมจิที่เกี่ยวกับกาแฟ ☕⚡ มี hashtag 5 อัน และ CTA ให้กดสั่งซื้อ'"
                rows={7}
                className="w-full bg-transparent p-4 text-sm text-gray-200 placeholder-gray-600 resize-none outline-none leading-relaxed"
                style={{ fontFamily: "var(--font-mono)" }}
              />
              <div className="px-4 py-2 border-t border-cyan-500/10 flex items-center justify-between">
                <span
                  className={`text-xs tracking-widest ${
                    charCount < MIN_CHARS ? "text-red-500" : charCount < 80 ? "text-yellow-500" : "text-green-400"
                  }`}
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {charCount} CHARS {charCount < MIN_CHARS ? `(MIN ${MIN_CHARS})` : "✓"}
                </span>
                <div className="flex gap-1">
                  {[30, 80, 120].map((n) => (
                    <div
                      key={n}
                      className={`h-1 w-8 rounded-full transition-colors ${charCount >= n ? "bg-green-400" : "bg-gray-700"}`}
                    />
                  ))}
                </div>
              </div>
            </div>

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
                ? `WRITE MORE... (${MIN_CHARS - charCount} CHARS LEFT)`
                : "▶ SUBMIT TO AI EVALUATION"}
            </button>
          </div>
        )}

        {/* Phase: Evaluating */}
        {phase === "evaluating" && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <EvaluatingScreen />
          </div>
        )}

        {/* Phase: Result */}
        {phase === "result" && result && (
          <ResultScreen result={result} prompt={prompt} onClaim={handleClaimReward} />
        )}

        {/* Phase: Complete */}
        {phase === "complete" && result && (
          <MissionCompleteScreen grade={result.grade} />
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
