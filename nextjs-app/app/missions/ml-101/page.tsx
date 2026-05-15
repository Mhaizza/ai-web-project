"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  playSound,
  useTypewriter,
  useCountUp,
  XPFloaters,
  ScreenFlash,
  CORRECT_LINES,
  WRONG_LINES,
  type Floater,
} from "@/lib/game-utils";

type Phase = "briefing" | "quiz" | "result" | "complete";

const MISSION = {
  code: "M-002",
  title: "MACHINE LEARNING 101",
  icon: "⚙️",
  xp: 200,
  credits: 40,
  difficulty: "EASY",
  color: "#facc15",
};

const NPC_DIALOGUE = [
  {
    speaker: "NEXUS",
    mood: "🤖",
    text: "กลับมาแล้ว AGENT_001! ตอนนี้คุณรู้จัก AI พื้นฐานแล้ว — ถึงเวลาเจาะลึก Machine Learning!",
    sub: "MISSION RESUMING...",
  },
  {
    speaker: "DR. ALGO",
    mood: "👨‍🔬",
    text: "สวัสดี! ฉันชื่อ Dr. Algo ผู้เชี่ยวชาญด้าน Machine Learning — วันนี้ฉันจะสอนให้คุณเข้าใจว่า AI เรียนรู้จาก data ได้อย่างไร",
    sub: "EXPERT ONLINE",
  },
  {
    speaker: "NEXUS",
    mood: "🤖",
    text: "ตอบคำถาม 4 ข้อเกี่ยวกับ Machine Learning ให้ถูกต้องเพื่อปลดล็อก Neural Network Basics!",
    sub: "QUIZ READY — GO AGENT",
  },
];

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  icon: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Machine Learning (ML) คืออะไร?",
    icon: "🤖",
    options: [
      "การเขียนโปรแกรมแบบดั้งเดิมที่ใช้ if-else",
      "สาขาของ AI ที่ให้คอมพิวเตอร์เรียนรู้จากข้อมูลโดยไม่ต้องโปรแกรมทุกอย่าง",
      "การซ่อมเครื่องจักรในโรงงาน",
      "ระบบปฏิบัติการของคอมพิวเตอร์",
    ],
    correct: 1,
    explanation: "ML คือการให้คอมพิวเตอร์ 'เรียนรู้' จากข้อมูลด้วยตัวเอง แทนที่จะเขียนกฎทุกอย่างด้วยมือ",
  },
  {
    id: 2,
    question: "Training Data คืออะไร?",
    icon: "📊",
    options: [
      "ข้อมูลที่ใช้ทดสอบว่า AI ทำงานได้ดีแค่ไหน",
      "ข้อมูลที่ใช้สอน AI ให้เรียนรู้ pattern",
      "ข้อมูลส่วนตัวของผู้ใช้",
      "คู่มือการใช้งาน AI",
    ],
    correct: 1,
    explanation: "Training Data คือชุดข้อมูลตัวอย่างที่เราใช้สอน AI เปรียบเหมือนแบบฝึกหัดที่นักเรียนใช้เรียน",
  },
  {
    id: 3,
    question: "Overfitting ใน ML หมายความว่าอะไร?",
    icon: "⚠️",
    options: [
      "โมเดลทำงานเร็วเกินไปจนไม่แม่นยำ",
      "โมเดลจำข้อมูล training ดีเกินไป แต่ทำงานกับข้อมูลใหม่ได้ไม่ดี",
      "โมเดลใช้ RAM มากเกินไป",
      "โมเดลเรียนรู้ได้น้อยเกินไป",
    ],
    correct: 1,
    explanation: "Overfitting เหมือนนักเรียนที่จำเฉลยข้อสอบเก่าได้หมด แต่พอเจอข้อสอบใหม่กลับทำไม่ได้!",
  },
  {
    id: 4,
    question: "อัลกอริทึม ML แบบ Classification ใช้ทำอะไร?",
    icon: "🏷️",
    options: [
      "ทำนายตัวเลขต่อเนื่อง เช่น ราคาบ้าน",
      "จัดกลุ่มข้อมูลออกเป็นประเภท เช่น สแปม/ไม่สแปม",
      "บีบอัดข้อมูลให้มีขนาดเล็กลง",
      "สร้างข้อมูลใหม่จากข้อมูลเก่า",
    ],
    correct: 1,
    explanation: "Classification ใช้จัดประเภทข้อมูล เช่น อีเมล spam หรือ ham, รูปภาพเป็น แมว หรือ หมา",
  },
];

// ─── NPC Dialogue box ────────────────────────────────────────────────────────
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
  const { displayed, done, skip } = useTypewriter(dialogue.text, 22);

  function handleBoxClick() {
    if (!done) skip();
    else onNext();
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto phase-enter">
      {/* NPC Avatar */}
      <div className="relative">
        <div
          className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl animate-float relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(250,204,21,0.18), rgba(249,115,22,0.12))",
            border: "2px solid rgba(250,204,21,0.55)",
            boxShadow: "0 0 28px rgba(250,204,21,0.28), 0 0 55px rgba(250,204,21,0.12)",
          }}
        >
          {dialogue.mood}
          <div className="scan-line-anim absolute inset-0" />
        </div>
        <div
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#050510] whitespace-nowrap"
          style={{ border: "1px solid rgba(250,204,21,0.55)" }}
        >
          <span
            className="text-xs font-bold text-yellow-400 tracking-widest"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            ◆ {dialogue.speaker}
          </span>
        </div>
      </div>

      {/* Status badge */}
      <div className="flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-glow-pulse" />
        <span
          className="text-xs tracking-widest text-yellow-500/70"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {dialogue.sub}
        </span>
      </div>

      {/* Text bubble — click to skip or advance */}
      <button
        onClick={handleBoxClick}
        className="w-full glass-card rounded-2xl p-6 min-h-[105px] text-left group hover:bg-white/[0.018] transition-colors"
        style={{ borderColor: "rgba(250,204,21,0.22)" }}
      >
        <p className="text-white text-base sm:text-lg leading-relaxed text-center">
          {displayed}
          {!done && (
            <span className="inline-block w-0.5 h-5 bg-yellow-400 ml-1 animate-pulse align-middle" />
          )}
        </p>
        {done && (
          <p
            className="text-center mt-3 text-xs tracking-widest text-yellow-500/40 group-hover:text-yellow-500/65 transition-colors"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            ▶ {index < total - 1 ? "CLICK TO CONTINUE" : "CLICK TO START QUIZ"}
          </p>
        )}
      </button>

      {/* Progress dots */}
      <div className="flex gap-2 items-center">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              height: 8,
              width: i === index ? 24 : 8,
              background:
                i === index ? "#facc15" : i < index ? "rgba(250,204,21,0.5)" : "#374151",
            }}
          />
        ))}
      </div>

      {/* Action button */}
      <button
        onClick={() => { playSound("click"); onNext(); }}
        className="btn-neon-cyan px-8 py-3 text-xs font-bold tracking-widest rounded-xl active:scale-95 transition-transform"
        style={{ fontFamily: "var(--font-orbitron)" }}
      >
        {index < total - 1 ? "NEXT ▶" : "START QUIZ ▶"}
      </button>
    </div>
  );
}

// ─── Quiz Card ───────────────────────────────────────────────────────────────
function QuizCard({
  q,
  qIndex,
  total,
  combo,
  onAnswer,
}: {
  q: Question;
  qIndex: number;
  total: number;
  combo: number;
  onAnswer: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 40);
    return () => clearTimeout(t);
  }, []);

  function handleSelect(idx: number) {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
    const correct = idx === q.correct;
    playSound(correct ? "correct" : "wrong");
    setTimeout(() => onAnswer(correct), 1250);
  }

  const reactionLine = revealed
    ? selected === q.correct
      ? CORRECT_LINES[q.id % CORRECT_LINES.length]
      : WRONG_LINES[q.id % WRONG_LINES.length]
    : null;

  return (
    <div
      className={`w-full max-w-2xl mx-auto space-y-5 transition-all duration-350 ${
        entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
    >
      {/* Progress row */}
      <div className="flex items-center gap-3">
        <span
          className="text-xs text-gray-500 tracking-widest shrink-0"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Q {qIndex + 1}/{total}
        </span>
        <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${((qIndex + 1) / total) * 100}%`,
              background: "linear-gradient(90deg, #facc15, #f97316)",
              boxShadow: "0 0 8px rgba(250,204,21,0.5)",
            }}
          />
        </div>
        {/* Pip dots */}
        <div className="flex gap-1 shrink-0">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                background: i < qIndex + 1 ? "#facc15" : "#374151",
                boxShadow: i === qIndex ? "0 0 6px #facc15" : "none",
              }}
            />
          ))}
        </div>
        {/* Combo badge */}
        {combo >= 2 && (
          <div
            className="combo-burst px-2 py-0.5 rounded-full text-xs font-black tracking-widest shrink-0"
            style={{
              fontFamily: "var(--font-orbitron)",
              background: "rgba(250,204,21,0.15)",
              border: "1px solid rgba(250,204,21,0.5)",
              color: "#facc15",
              textShadow: "0 0 8px #facc15",
            }}
          >
            🔥 ×{combo}
          </div>
        )}
      </div>

      {/* AI reaction */}
      {reactionLine && (
        <div
          className="text-xs tracking-widest text-center py-2 px-4 rounded-lg phase-enter-fast"
          style={{
            fontFamily: "var(--font-mono)",
            color: selected === q.correct ? "#4ade80" : "#f97316",
            background:
              selected === q.correct
                ? "rgba(74,222,128,0.06)"
                : "rgba(249,115,22,0.06)",
            border: `1px solid ${
              selected === q.correct
                ? "rgba(74,222,128,0.22)"
                : "rgba(249,115,22,0.22)"
            }`,
          }}
        >
          {reactionLine}
        </div>
      )}

      {/* Question card */}
      <div
        className="glass-card rounded-2xl p-6"
        style={{ borderColor: "rgba(250,204,21,0.22)" }}
      >
        <div className="text-4xl mb-4 text-center">{q.icon}</div>
        <h3
          className="text-base sm:text-lg font-bold text-white text-center leading-relaxed"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          {q.question}
        </h3>
      </div>

      {/* Answer options */}
      <div className="space-y-2.5">
        {q.options.map((opt, i) => {
          const labels = ["A", "B", "C", "D"];
          let borderColor = "rgba(55,65,81,0.8)";
          let bg = "rgba(17,24,39,0.55)";
          let textColor = "#d1d5db";
          let labelColor = "#facc15";
          let shadow = "none";
          let shakeClass = "";

          if (revealed) {
            if (i === q.correct) {
              borderColor = "#22c55e";
              bg = "rgba(34,197,94,0.11)";
              textColor = "#86efac";
              labelColor = "#22c55e";
              shadow = "0 0 18px rgba(34,197,94,0.28)";
            } else if (i === selected) {
              borderColor = "#ef4444";
              bg = "rgba(239,68,68,0.09)";
              textColor = "#fca5a5";
              labelColor = "#ef4444";
              shadow = "0 0 12px rgba(239,68,68,0.22)";
              shakeClass = "quiz-wrong-shake";
            } else {
              borderColor = "rgba(31,41,55,0.5)";
              bg = "transparent";
              textColor = "#374151";
              labelColor = "#374151";
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={revealed}
              className={`w-full text-left p-4 rounded-xl border text-sm leading-relaxed transition-all duration-200
                ${!revealed ? "hover-lift hover:border-yellow-500/40 hover:bg-yellow-500/5 cursor-pointer" : "cursor-default"}
                ${revealed && i === q.correct ? "quiz-correct-glow" : ""}
                ${shakeClass}`}
              style={{
                borderColor,
                backgroundColor: bg,
                color: textColor,
                fontFamily: "var(--font-mono)",
                boxShadow: shadow,
              }}
            >
              <span className="mr-3 font-black text-xs tracking-widest" style={{ color: labelColor }}>
                {labels[i]}.
              </span>
              {opt}
              {revealed && i === q.correct && <span className="float-right">✓</span>}
              {revealed && i === selected && i !== q.correct && (
                <span className="float-right">✗</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {revealed && (
        <div
          className="p-4 rounded-xl border text-sm leading-relaxed phase-enter"
          style={{
            borderColor:
              selected === q.correct ? "rgba(34,197,94,0.3)" : "rgba(249,115,22,0.3)",
            background:
              selected === q.correct ? "rgba(34,197,94,0.07)" : "rgba(249,115,22,0.07)",
            color: selected === q.correct ? "#86efac" : "#fdba74",
          }}
        >
          <span
            className="font-bold tracking-widest text-xs block mb-1.5"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            {selected === q.correct ? "✓ CORRECT — SYNAPSE ACTIVATED" : "✗ INCORRECT — REVIEW PROTOCOL"}
          </span>
          💡 {q.explanation}
        </div>
      )}
    </div>
  );
}

// ─── Result Screen ───────────────────────────────────────────────────────────
function ResultScreen({
  score,
  total,
  onClaim,
}: {
  score: number;
  total: number;
  onClaim: () => void;
}) {
  const pct = Math.round((score / total) * 100);
  const grade = pct === 100 ? "S" : pct >= 75 ? "A" : pct >= 50 ? "B" : "C";
  const gradeColors: Record<string, string> = {
    S: "#fde047",
    A: "#00f5ff",
    B: "#4ade80",
    C: "#fb923c",
  };
  const earnedXP = Math.round(MISSION.xp * (score / total));
  const earnedCredits = Math.round(MISSION.credits * (score / total));
  const xpCount = useCountUp(earnedXP, 1200, 400);
  const creditsCount = useCountUp(earnedCredits, 1100, 500);
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  return (
    <div
      className={`w-full max-w-2xl mx-auto space-y-5 transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
    >
      <div
        className="glass-card rounded-2xl p-6 border border-yellow-500/20 text-center"
      >
        <div
          className="text-xs tracking-widest text-gray-500 mb-4"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          // QUIZ_COMPLETE
        </div>

        <div className="flex items-center justify-center gap-10 mb-2">
          {/* Score ring */}
          <div className="relative w-24 h-24 shrink-0">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42" fill="none"
                stroke={gradeColors[grade]}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(pct / 100) * 264} 264`}
                style={{
                  transition: "stroke-dasharray 1.3s cubic-bezier(0.22,1,0.36,1)",
                  filter: `drop-shadow(0 0 8px ${gradeColors[grade]})`,
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="text-2xl font-black text-white"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                {score}/{total}
              </span>
              <span className="text-xs text-gray-500">CORRECT</span>
            </div>
          </div>

          {/* Grade */}
          <div className="text-left">
            <div
              className="text-6xl font-black grade-reveal"
              style={{
                fontFamily: "var(--font-orbitron)",
                color: gradeColors[grade],
                filter: `drop-shadow(0 0 14px ${gradeColors[grade]})`,
              }}
            >
              {grade}
            </div>
            <div
              className="text-xs text-gray-500 tracking-widest"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              GRADE
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {pct === 100
                ? "PERFECT SCORE!"
                : pct >= 75
                ? "EXCELLENT!"
                : pct >= 50
                ? "GOOD JOB!"
                : "KEEP TRAINING!"}
            </div>
          </div>
        </div>
      </div>

      {/* XP / Credits */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card rounded-xl p-4 border border-yellow-500/20 text-center">
          <div className="text-2xl mb-1">⚡</div>
          <div
            className="text-xl font-black text-yellow-400"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            +{xpCount}
          </div>
          <div
            className="text-xs text-gray-500 tracking-widest mt-0.5"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            XP EARNED
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 border border-purple-500/20 text-center">
          <div className="text-2xl mb-1">💎</div>
          <div
            className="text-xl font-black text-purple-400"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            +{creditsCount}
          </div>
          <div
            className="text-xs text-gray-500 tracking-widest mt-0.5"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            CREDITS
          </div>
        </div>
      </div>

      <button
        onClick={() => { playSound("levelup"); onClaim(); }}
        className="w-full btn-neon-pink py-4 text-sm font-bold tracking-widest rounded-xl active:scale-98 transition-transform"
        style={{ fontFamily: "var(--font-orbitron)" }}
      >
        ▶ CLAIM REWARDS
      </button>
    </div>
  );
}

// ─── Complete Screen ─────────────────────────────────────────────────────────
function CompleteScreen({ score, total }: { score: number; total: number }) {
  const pct = Math.round((score / total) * 100);
  const [skillsVisible, setSkillsVisible] = useState(false);
  useEffect(() => { setTimeout(() => setSkillsVisible(true), 300); }, []);

  const skills = [
    { icon: "⚙️", skill: "Machine Learning Concepts", desc: "เข้าใจหลักการพื้นฐานของ ML" },
    { icon: "📊", skill: "Training Data Literacy", desc: "รู้จักบทบาทของ data ในการสอน AI" },
    { icon: "🏷️", skill: "Classification Basics", desc: "เข้าใจ task ประเภท Classification" },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto text-center space-y-8 phase-enter">
      {/* Glow title area */}
      <div className="relative">
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(0,245,255,0.08) 0%, transparent 70%)" }}
        />
        <div
          className="text-xs tracking-widest text-yellow-400 mb-3"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          // MISSION_DEBRIEF
        </div>
        <h2
          className="text-3xl sm:text-4xl font-black"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          <span className="neon-text-cyan">MISSION</span>
          <br />
          <span className="neon-text-pink">ACCOMPLISHED</span>
        </h2>
        <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed mt-3">
          คุณสำเร็จภารกิจ{" "}
          <span className="text-white font-bold">Machine Learning 101</span> แล้ว!
          {pct >= 75
            ? " ความเข้าใจ ML ของคุณแข็งแกร่งมาก! 🔥"
            : " เดินหน้าต่อสู่ Neural Networks!"}
        </p>
      </div>

      {/* Skills acquired */}
      <div className="glass-card rounded-2xl p-6 text-left space-y-3">
        <div
          className="text-xs font-bold tracking-widest text-gray-400 mb-4"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          SKILLS ACQUIRED:
        </div>
        {skills.map((item, i) => (
          <div
            key={item.skill}
            className={`flex items-start gap-3 p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/10 skill-reveal ${skillsVisible ? "" : "opacity-0"}`}
            style={{ animationDelay: `${i * 0.12}s` }}
          >
            <span className="text-xl shrink-0">{item.icon}</span>
            <div>
              <div
                className="text-sm font-bold text-white mb-0.5"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                {item.skill}
              </div>
              <div className="text-xs text-gray-500">{item.desc}</div>
            </div>
            <span className="ml-auto text-green-400 text-sm shrink-0">✓</span>
          </div>
        ))}
      </div>

      {/* Nav buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/dashboard"
          className="flex-1 btn-neon-cyan py-3 text-xs font-bold tracking-widest rounded-xl text-center"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          ← BACK TO HQ
        </Link>
        <Link
          href="/missions/neural-network"
          className="flex-1 btn-neon-pink py-3 text-xs font-bold tracking-widest rounded-xl text-center"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          NEXT MISSION →
        </Link>
      </div>
    </div>
  );
}

// ─── Reward Modal ────────────────────────────────────────────────────────────
function RewardModal({
  score,
  total,
  onClose,
}: {
  score: number;
  total: number;
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 60); }, []);
  const xp = Math.round(MISSION.xp * (score / total));
  const credits = Math.round(MISSION.credits * (score / total));
  const xpCount = useCountUp(xp, 1000, 300);
  const credCount = useCountUp(credits, 900, 400);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div
        className={`relative glass-card rounded-3xl p-8 max-w-sm w-full text-center transition-all duration-400 ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
        style={{
          border: "1px solid rgba(250,204,21,0.35)",
          boxShadow: "0 0 60px rgba(250,204,21,0.18), 0 0 120px rgba(255,0,128,0.1)",
        }}
      >
        {/* Glow ring */}
        <div
          className="glow-ring"
          style={{ border: "2px solid rgba(250,204,21,0.3)" }}
        />

        <div className="text-6xl mb-4 animate-float">{MISSION.icon}</div>
        <div
          className="text-xs tracking-widest text-yellow-400 mb-2"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          // MISSION_COMPLETE
        </div>
        <div
          className="text-2xl font-black text-white mb-6"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          ML 101
          <br />
          <span className="neon-text-pink">CLEARED</span>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <span
              className="text-sm font-bold text-white"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              ⚡ XP EARNED
            </span>
            <span
              className="text-xl font-black text-yellow-400"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              +{xpCount}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <span
              className="text-sm font-bold text-white"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              💎 CREDITS
            </span>
            <span
              className="text-xl font-black text-purple-400"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              +{credCount}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full btn-neon-pink py-3 text-sm font-bold tracking-widest rounded-xl active:scale-97 transition-transform"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          ▶ CONTINUE
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function ML101MissionPage() {
  const [phase, setPhase] = useState<Phase>("briefing");
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [flashType, setFlashType] = useState<"correct" | "wrong" | "complete" | null>(null);
  const [flashKey, setFlashKey] = useState(0);
  const [floaters, setFloaters] = useState<Floater[]>([]);
  const floaterIdRef = useRef(0);

  function triggerFlash(type: "correct" | "wrong" | "complete") {
    setFlashType(type);
    setFlashKey((k) => k + 1);
    setTimeout(() => setFlashType(null), 600);
  }

  function spawnXPFloat(xp: number) {
    const id = ++floaterIdRef.current;
    const x = window.innerWidth / 2 - 40;
    const y = window.innerHeight * 0.38;
    setFloaters((prev) => [
      ...prev,
      { id, value: `+${xp} XP`, color: "#facc15", x, y },
    ]);
    setTimeout(() => setFloaters((prev) => prev.filter((f) => f.id !== id)), 1300);
  }

  function handleNextDialogue() {
    if (dialogueIndex < NPC_DIALOGUE.length - 1) {
      setDialogueIndex((i) => i + 1);
    } else {
      setPhase("quiz");
    }
  }

  function handleAnswer(correct: boolean) {
    if (correct) {
      setScore((s) => s + 1);
      setCombo((c) => c + 1);
      spawnXPFloat(Math.round(MISSION.xp / QUESTIONS.length));
      triggerFlash("correct");
    } else {
      setCombo(0);
      triggerFlash("wrong");
    }
    if (qIndex < QUESTIONS.length - 1) {
      setQIndex((i) => i + 1);
    } else {
      setTimeout(() => setPhase("result"), 200);
    }
  }

  function handleClaim() {
    setShowReward(false);
    triggerFlash("complete");
    playSound("complete");
    setTimeout(() => setPhase("complete"), 300);
  }

  const phaseLabel =
    phase === "briefing"
      ? "BRIEFING"
      : phase === "quiz"
      ? `● Q${qIndex + 1}/${QUESTIONS.length}`
      : phase === "result"
      ? "RESULTS"
      : "✓ COMPLETE";

  const phaseBadgeStyle =
    phase === "briefing"
      ? "bg-gray-700/50 text-gray-500"
      : phase === "quiz"
      ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
      : phase === "result"
      ? "bg-pink-500/15 text-pink-400 border border-pink-500/30"
      : "bg-green-500/15 text-green-400 border border-green-500/30";

  return (
    <div className="min-h-screen bg-[#050510] cyber-grid">
      <Navbar />
      <ScreenFlash type={flashType} flashKey={flashKey} />
      <XPFloaters floaters={floaters} />

      {showReward && (
        <RewardModal score={score} total={QUESTIONS.length} onClose={handleClaim} />
      )}

      <div className="pt-20 pb-12 px-4">
        {/* Mission header bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="glass-card rounded-2xl p-4 border border-yellow-500/20">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center text-xl">
                  {MISSION.icon}
                </div>
                <div>
                  <div
                    className="text-xs text-yellow-400 tracking-widest"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {MISSION.code} • {MISSION.difficulty}
                  </div>
                  <div
                    className="text-sm font-black text-white"
                    style={{ fontFamily: "var(--font-orbitron)" }}
                  >
                    {MISSION.title}
                  </div>
                </div>
              </div>
              <div
                className="flex items-center gap-4 text-xs"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <span className="text-yellow-400">⚡ {MISSION.xp} XP</span>
                <span className="text-purple-400">💎 {MISSION.credits}</span>
                <span className={`px-2 py-1 rounded-lg tracking-widest ${phaseBadgeStyle}`}>
                  {phaseLabel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Phase content */}
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
        {phase === "quiz" && (
          <div className="flex flex-col items-center min-h-[60vh] justify-center">
            <QuizCard
              key={qIndex}
              q={QUESTIONS[qIndex]}
              qIndex={qIndex}
              total={QUESTIONS.length}
              combo={combo}
              onAnswer={handleAnswer}
            />
          </div>
        )}
        {phase === "result" && (
          <ResultScreen
            score={score}
            total={QUESTIONS.length}
            onClaim={() => setShowReward(true)}
          />
        )}
        {phase === "complete" && (
          <CompleteScreen score={score} total={QUESTIONS.length} />
        )}
      </div>
    </div>
  );
}
