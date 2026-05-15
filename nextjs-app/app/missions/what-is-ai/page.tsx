"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

type Tier = "S" | "A" | "B" | "C" | "D";
type Phase = "briefing" | "playing" | "result" | "complete";

const MISSION = { code: "M-001", title: "WHAT IS AI?", icon: "🧠", difficulty: "EASY" };

interface MCQ {
  type: "mcq";
  q: string;
  options: string[];
  correct: number;
  explain: string;
  xp: number;
}
interface Fill {
  type: "fill";
  prefix: string;
  suffix: string;
  chips: string[];
  correct: string;
  explain: string;
  xp: number;
}
type Question = MCQ | Fill;

const QUESTIONS: Question[] = [
  {
    type: "mcq",
    q: "AI ย่อมาจากอะไร?",
    options: ["Automatic Intelligence", "Artificial Intelligence", "Advanced Interface", "Automated Input"],
    correct: 1,
    xp: 20,
    explain: "AI = Artificial Intelligence หรือ ปัญญาประดิษฐ์",
  },
  {
    type: "mcq",
    q: "อะไรทำให้ AI แตกต่างจากโปรแกรมธรรมดา?",
    options: ["ทำงานได้เร็วกว่า", "เรียนรู้จากข้อมูลได้", "ใช้ไฟน้อยกว่า", "ไม่มี bug"],
    correct: 1,
    xp: 25,
    explain: "AI เรียนรู้จากข้อมูล (data) ไม่ต้องโปรแกรมกฎทุกอย่างล่วงหน้า",
  },
  {
    type: "fill",
    prefix: "AI เรียนรู้จาก",
    suffix: "แทนที่จะทำตามกฎตายตัว",
    chips: ["ข้อมูล (Data)", "ไฟฟ้า", "Python code", "คำสั่งมนุษย์"],
    correct: "ข้อมูล (Data)",
    xp: 25,
    explain: "Machine Learning ใช้ข้อมูลจำนวนมากในการหา pattern โดยอัตโนมัติ",
  },
  {
    type: "mcq",
    q: "อะไรคือตัวอย่าง AI ในชีวิตจริง?",
    options: ["Excel spreadsheet", "Netflix แนะนำซีรีส์", "นาฬิกาปลุก", "เครื่องคิดเลข"],
    correct: 1,
    xp: 20,
    explain: "Netflix วิเคราะห์ข้อมูลการดูของคุณเพื่อแนะนำเนื้อหาที่คุณน่าจะชอบ",
  },
  {
    type: "mcq",
    q: "Machine Learning คืออะไร?",
    options: ["เขียนโปรแกรมด้วยมือ", "AI หา pattern จากข้อมูลได้เอง", "สอน AI ด้วยกฎ", "ซ่อมคอมพิวเตอร์"],
    correct: 1,
    xp: 30,
    explain: "Machine Learning = AI เรียนรู้ pattern จาก training data โดยไม่ต้องโปรแกรมกฎล่วงหน้า",
  },
  {
    type: "mcq",
    q: "ถ้า AI ฝึกด้วยข้อมูลที่มีอคติ จะเกิดอะไร?",
    options: ["AI จะฉลาดขึ้น", "AI จะทำงานเร็วขึ้น", "AI จะมีอคติด้วย", "ไม่มีผลกระทบ"],
    correct: 2,
    xp: 30,
    explain: "\"Garbage in, Garbage out\" — ข้อมูลไม่ดี ผลลัพธ์ของ AI ก็จะมีอคติตามไปด้วย",
  },
];

const TOTAL_XP = QUESTIONS.reduce((s, q) => s + q.xp, 0);

const TIER_CFG: Record<Tier, { color: string; label: string }> = {
  S: { color: "#fde047", label: "LEGENDARY" },
  A: { color: "#00f5ff", label: "EXPERT" },
  B: { color: "#4ade80", label: "ADVANCED" },
  C: { color: "#fb923c", label: "LEARNER" },
  D: { color: "#f87171", label: "NOVICE" },
};

function getTier(correct: number, total: number): Tier {
  const r = correct / total;
  if (r >= 0.9) return "S";
  if (r >= 0.7) return "A";
  if (r >= 0.5) return "B";
  if (r >= 0.3) return "C";
  return "D";
}

// ─── Briefing ─────────────────────────────────────────────────────────────────

function BriefingCard({ onStart }: { onStart: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 60); }, []);
  return (
    <div className={`flex flex-col items-center gap-5 w-full max-w-sm mx-auto transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      <div className="relative">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-2 border-cyan-400/40 flex items-center justify-center text-4xl" style={{ animation: "float 4s ease-in-out infinite" }}>
          🤖
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#050510] border border-cyan-500/40 whitespace-nowrap">
          <span className="text-xs font-bold text-cyan-400 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>NEXUS</span>
        </div>
      </div>
      <div className="glass-card rounded-2xl p-5 border border-cyan-500/20 w-full text-center space-y-2">
        <p className="text-white text-sm leading-relaxed font-medium">
          AGENT_001 — พร้อมทดสอบ AI พื้นฐานแล้วหรือยัง?
        </p>
        <p className="text-gray-500 text-xs" style={{ fontFamily: "var(--font-mono)" }}>
          6 คำถาม • ตอบให้รวดเร็ว • รับ XP สูงสุด
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2 w-full text-center">
        {[
          { icon: "⚡", label: `${TOTAL_XP} XP`, sub: "รางวัล" },
          { icon: "🧠", label: "6 คำถาม", sub: "ด่านนี้" },
          { icon: "🏆", label: "S Tier", sub: "เป้าหมาย" },
        ].map((item) => (
          <div key={item.label} className="glass-card rounded-xl p-3 border border-gray-700/40">
            <p className="text-lg">{item.icon}</p>
            <p className="text-xs font-bold text-white" style={{ fontFamily: "var(--font-orbitron)" }}>{item.label}</p>
            <p className="text-xs text-gray-500" style={{ fontFamily: "var(--font-mono)" }}>{item.sub}</p>
          </div>
        ))}
      </div>
      <button
        onClick={onStart}
        className="w-full btn-neon-cyan py-4 text-sm font-bold tracking-widest rounded-xl"
        style={{ fontFamily: "var(--font-orbitron)" }}
      >
        เริ่มเลย ▶
      </button>
    </div>
  );
}

// ─── Question Card ─────────────────────────────────────────────────────────────

function QuestionCard({
  q, idx, total, streak, onNext,
}: {
  q: Question; idx: number; total: number; streak: number;
  onNext: (correct: boolean, xp: number) => void;
}) {
  const [answered, setAnswered] = useState<string | number | null>(null);
  const [showNext, setShowNext] = useState(false);

  const isAnswered = answered !== null;
  const isCorrect = q.type === "mcq"
    ? answered === q.correct
    : answered === q.correct;

  function handleSelect(val: string | number) {
    if (isAnswered) return;
    setAnswered(val);
    setTimeout(() => setShowNext(true), 350);
  }

  const progress = (idx / total) * 100;

  return (
    <div className="w-full max-w-sm mx-auto space-y-4">
      {/* Top bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${progress}%`, background: "linear-gradient(90deg, #00f5ff, #bf00ff)" }}
          />
        </div>
        <span className="text-xs text-gray-500 shrink-0" style={{ fontFamily: "var(--font-mono)" }}>
          {idx + 1}/{total}
        </span>
        {streak >= 2 && (
          <span className="text-xs font-bold text-orange-400 shrink-0" style={{ fontFamily: "var(--font-mono)" }}>
            🔥 x{streak}
          </span>
        )}
      </div>

      {/* XP badge */}
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-600 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
          {q.type === "mcq" ? "MCQ" : "FILL-IN"}
        </span>
        <span className="text-xs text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2.5 py-0.5 rounded-full" style={{ fontFamily: "var(--font-mono)" }}>
          ⚡ +{q.xp} XP
        </span>
      </div>

      {q.type === "mcq" ? (
        <>
          {/* Question */}
          <div className="glass-card rounded-2xl p-5 border border-cyan-500/20 text-center">
            <p className="text-base font-bold text-white leading-snug">{q.q}</p>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {q.options.map((opt, i) => {
              let cls = "border-gray-700/50 text-gray-300 active:scale-98";
              if (!isAnswered) cls += " hover:border-cyan-500/50 hover:bg-cyan-500/5";
              else if (i === q.correct) cls = "border-green-500 bg-green-500/10 text-green-300";
              else if (i === answered) cls = "border-red-500 bg-red-500/10 text-red-300";
              else cls = "border-gray-800 text-gray-600 opacity-40";

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-xl border text-left text-sm font-medium transition-all duration-200 ${cls}`}
                >
                  <span className="font-black mr-2.5 text-xs opacity-60" style={{ fontFamily: "var(--font-mono)" }}>
                    {["A", "B", "C", "D"][i]}
                  </span>
                  {opt}
                  {isAnswered && i === q.correct && (
                    <span className="float-right text-green-400 font-bold">✓</span>
                  )}
                  {isAnswered && i === answered && i !== q.correct && (
                    <span className="float-right text-red-400 font-bold">✗</span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <>
          {/* Fill-in sentence */}
          <div className="glass-card rounded-2xl p-5 border border-cyan-500/20 text-center">
            <p className="text-base font-bold text-white leading-relaxed">
              {q.prefix}{" "}
              <span
                className={`inline-block min-w-[110px] px-3 py-0.5 rounded-lg border-b-2 text-center transition-all duration-300 ${
                  !isAnswered
                    ? "border-cyan-500 text-cyan-400"
                    : isCorrect
                    ? "border-green-500 text-green-400 bg-green-500/10"
                    : "border-red-500 text-red-400 bg-red-500/10"
                }`}
              >
                {answered ? String(answered) : "??????"}
              </span>{" "}
              {q.suffix}
            </p>
          </div>

          {/* Chips */}
          <div className="flex flex-wrap gap-3 justify-center">
            {q.chips.map((chip) => {
              let cls = "border-gray-700 text-gray-300";
              if (!isAnswered) cls += " hover:border-cyan-500/60 hover:bg-cyan-500/5 active:scale-95";
              else if (chip === q.correct) cls = "border-green-500 bg-green-500/10 text-green-300";
              else if (chip === answered) cls = "border-red-500 bg-red-500/10 text-red-300";
              else cls = "border-gray-800 text-gray-600 opacity-40";

              return (
                <button
                  key={chip}
                  onClick={() => handleSelect(chip)}
                  disabled={isAnswered}
                  className={`px-5 py-3 rounded-xl border text-sm font-bold transition-all duration-200 ${cls}`}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Feedback */}
      {isAnswered && (
        <div
          className={`rounded-xl p-4 border text-sm leading-relaxed transition-all duration-300 ${
            isCorrect
              ? "bg-green-500/8 border-green-500/25 text-green-300"
              : "bg-orange-500/8 border-orange-500/25 text-orange-300"
          }`}
        >
          <span className="font-bold mr-1">{isCorrect ? "✓ ถูกต้อง!" : "✗ ไม่ใช่ —"}</span>
          {q.explain}
        </div>
      )}

      {/* Next button */}
      {showNext && (
        <button
          onClick={() => onNext(isCorrect, isCorrect ? q.xp : 0)}
          className="w-full btn-neon-pink py-4 text-xs font-bold tracking-widest rounded-xl"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          {idx < total - 1 ? "ถัดไป ▶" : "ดูผลลัพธ์ ▶"}
        </button>
      )}
    </div>
  );
}

// ─── Result Screen ─────────────────────────────────────────────────────────────

function ResultScreen({
  correctCount, totalXP, onClaim,
}: {
  correctCount: number; totalXP: number; onClaim: () => void;
}) {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 80); }, []);
  const total = QUESTIONS.length;
  const tier = getTier(correctCount, total);
  const tc = TIER_CFG[tier];
  const pct = Math.round((correctCount / total) * 100);

  return (
    <div className={`w-full max-w-sm mx-auto space-y-4 transition-all duration-500 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
      {/* Score ring */}
      <div className="glass-card rounded-2xl p-6 border border-cyan-500/20 text-center space-y-4">
        <p className="text-xs text-gray-500 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>// MISSION_COMPLETE</p>
        <div className="relative w-28 h-28 mx-auto">
          <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="40" fill="none"
              stroke={tc.color}
              strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${(pct / 100) * 251} 251`}
              style={{ transition: "stroke-dasharray 1.4s ease", filter: `drop-shadow(0 0 8px ${tc.color})` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-orbitron)" }}>{correctCount}/{total}</p>
            <p className="text-xs text-gray-500" style={{ fontFamily: "var(--font-mono)" }}>ถูก</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-3">
          <div className="text-5xl font-black" style={{ fontFamily: "var(--font-orbitron)", color: tc.color, filter: `drop-shadow(0 0 12px ${tc.color})` }}>
            {tier}
          </div>
          <div className="text-left">
            <p className="text-xs text-gray-500" style={{ fontFamily: "var(--font-mono)" }}>GRADE</p>
            <p className="text-sm font-bold" style={{ color: tc.color, fontFamily: "var(--font-mono)" }}>{tc.label}</p>
          </div>
        </div>
      </div>

      {/* Rewards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card rounded-xl p-4 border border-yellow-500/20 text-center">
          <p className="text-xl mb-1">⚡</p>
          <p className="text-xl font-black text-yellow-400" style={{ fontFamily: "var(--font-orbitron)" }}>+{totalXP}</p>
          <p className="text-xs text-gray-500 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>XP EARNED</p>
        </div>
        <div className="glass-card rounded-xl p-4 border border-purple-500/20 text-center">
          <p className="text-xl mb-1">💎</p>
          <p className="text-xl font-black text-purple-400" style={{ fontFamily: "var(--font-orbitron)" }}>+{Math.round(totalXP * 0.2)}</p>
          <p className="text-xs text-gray-500 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>CREDITS</p>
        </div>
      </div>

      <button
        onClick={onClaim}
        className="w-full btn-neon-pink py-4 text-sm font-bold tracking-widest rounded-xl"
        style={{ fontFamily: "var(--font-orbitron)" }}
      >
        ▶ รับรางวัล
      </button>
    </div>
  );
}

// ─── Complete Screen ───────────────────────────────────────────────────────────

function CompleteScreen({ totalXP }: { totalXP: number }) {
  return (
    <div className="w-full max-w-sm mx-auto text-center space-y-5">
      <p className="text-xs tracking-widest text-cyan-400" style={{ fontFamily: "var(--font-mono)" }}>// MISSION_DEBRIEF</p>
      <h2 className="text-3xl font-black" style={{ fontFamily: "var(--font-orbitron)" }}>
        <span className="neon-text-cyan">MISSION</span><br />
        <span className="neon-text-pink">ACCOMPLISHED</span>
      </h2>
      <p className="text-gray-400 text-sm">คุณผ่านภารกิจ <span className="text-white font-bold">What is AI?</span> แล้ว!</p>

      <div className="glass-card rounded-2xl p-5 text-left space-y-2.5">
        <p className="text-xs font-bold tracking-widest text-gray-400 mb-3" style={{ fontFamily: "var(--font-orbitron)" }}>SKILLS ACQUIRED:</p>
        {[
          { icon: "🧠", skill: "AI Fundamentals", desc: "รู้จัก AI และวิธีที่มันเรียนรู้" },
          { icon: "🌍", skill: "Real-World AI", desc: "จำแนก AI ในชีวิตจริงได้" },
          { icon: "⚙️", skill: "Machine Learning", desc: "เข้าใจ concept ของ ML พื้นฐาน" },
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
          ← กลับ HQ
        </Link>
        <Link href="/missions/ml-101" className="btn-neon-pink py-3 text-xs font-bold tracking-widest rounded-xl text-center" style={{ fontFamily: "var(--font-orbitron)" }}>
          ภารกิจถัดไป: ML 101 →
        </Link>
      </div>
    </div>
  );
}

// ─── Reward Popup ──────────────────────────────────────────────────────────────

function RewardPopup({ totalXP, tier, onClose }: { totalXP: number; tier: Tier; onClose: () => void }) {
  const [animIn, setAnimIn] = useState(false);
  const tc = TIER_CFG[tier];
  useEffect(() => { setTimeout(() => setAnimIn(true), 50); }, []);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className={`glass-card rounded-3xl p-8 max-w-sm w-full text-center border border-cyan-500/30 transition-all duration-500 ${animIn ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}
        style={{ boxShadow: "0 0 60px rgba(0,245,255,0.2)" }}>
        <p className="text-6xl mb-4" style={{ animation: "float 3s ease-in-out infinite" }}>🏆</p>
        <p className="text-xs tracking-widest text-cyan-400 mb-2" style={{ fontFamily: "var(--font-mono)" }}>MISSION COMPLETE!</p>
        <p className="text-2xl font-black text-white mb-1" style={{ fontFamily: "var(--font-orbitron)" }}>WHAT IS AI?</p>
        <p className="text-xl font-black mb-5" style={{ fontFamily: "var(--font-orbitron)", color: tc.color }}>
          {tc.label}
        </p>
        <div className="flex justify-between p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 mb-5">
          <span className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-orbitron)" }}>⚡ XP EARNED</span>
          <span className="text-xl font-black text-yellow-400" style={{ fontFamily: "var(--font-orbitron)" }}>+{totalXP}</span>
        </div>
        <button onClick={onClose} className="w-full btn-neon-pink py-3 text-sm font-bold tracking-widest rounded-xl" style={{ fontFamily: "var(--font-orbitron)" }}>
          ▶ ต่อไป
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function WhatIsAIMissionPage() {
  const [phase, setPhase] = useState<Phase>("briefing");
  const [qIdx, setQIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showReward, setShowReward] = useState(false);

  function handleNext(correct: boolean, xp: number) {
    setTotalXP((t) => t + xp);
    setCorrectCount((c) => c + (correct ? 1 : 0));
    setStreak((s) => (correct ? s + 1 : 0));

    if (qIdx < QUESTIONS.length - 1) {
      setQIdx((i) => i + 1);
    } else {
      setPhase("result");
    }
  }

  const tier = getTier(correctCount, QUESTIONS.length);

  return (
    <div className="min-h-screen bg-[#050510] cyber-grid">
      <Navbar />

      {showReward && (
        <RewardPopup
          totalXP={totalXP}
          tier={tier}
          onClose={() => { setShowReward(false); setPhase("complete"); }}
        />
      )}

      <div className="pt-20 pb-12 px-4">
        {/* Mission header */}
        <div className="max-w-sm mx-auto mb-5">
          <div className="glass-card rounded-xl p-3 border border-cyan-500/15">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-lg">
                  {MISSION.icon}
                </div>
                <div>
                  <p className="text-xs text-cyan-400 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
                    {MISSION.code} • {MISSION.difficulty}
                  </p>
                  <p className="text-sm font-black text-white" style={{ fontFamily: "var(--font-orbitron)" }}>
                    {MISSION.title}
                  </p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-lg tracking-widest ${
                phase === "briefing" ? "bg-gray-800 text-gray-500"
                : phase === "playing" ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                : phase === "result" ? "bg-pink-500/15 text-pink-400 border border-pink-500/30"
                : "bg-green-500/15 text-green-400 border border-green-500/30"
              }`} style={{ fontFamily: "var(--font-mono)" }}>
                {phase === "briefing" && "BRIEFING"}
                {phase === "playing" && `● Q${qIdx + 1}/${QUESTIONS.length}`}
                {phase === "result" && "RESULTS"}
                {phase === "complete" && "✓ DONE"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          {phase === "briefing" && (
            <div className="w-full flex flex-col items-center justify-center min-h-[60vh]">
              <BriefingCard onStart={() => setPhase("playing")} />
            </div>
          )}
          {phase === "playing" && (
            <QuestionCard
              key={qIdx}
              q={QUESTIONS[qIdx]}
              idx={qIdx}
              total={QUESTIONS.length}
              streak={streak}
              onNext={handleNext}
            />
          )}
          {phase === "result" && (
            <ResultScreen correctCount={correctCount} totalXP={totalXP} onClaim={() => setShowReward(true)} />
          )}
          {phase === "complete" && <CompleteScreen totalXP={totalXP} />}
        </div>
      </div>
    </div>
  );
}
