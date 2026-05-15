"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

type Phase = "briefing" | "quiz" | "result" | "complete";

const MISSION = { code: "M-001", title: "WHAT IS AI?", icon: "🧠", xp: 100, credits: 20, difficulty: "EASY" };

const NPC_DIALOGUE = [
  {
    speaker: "NEXUS",
    mood: "🤖",
    text: "ยินดีต้อนรับสู่ NeuralQuest, AGENT_001 — ถึงเวลาเริ่มภารกิจแรกของคุณแล้ว!",
    sub: "SYSTEM INITIALIZED",
  },
  {
    speaker: "NEXUS",
    mood: "🤖",
    text: "ภารกิจนี้จะทดสอบความรู้พื้นฐานเกี่ยวกับ AI ตอบให้ถูกต้องเพื่อรับ XP และปลดล็อกภารกิจถัดไป!",
    sub: "BRIEFING COMPLETE — QUIZ LOADING",
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
    question: "AI (Artificial Intelligence) คืออะไร?",
    icon: "🧠",
    options: [
      "โปรแกรมที่ทำตามคำสั่งที่กำหนดไว้ตายตัว",
      "ระบบคอมพิวเตอร์ที่จำลองความฉลาดของมนุษย์",
      "หุ่นยนต์ที่มีร่างกายเหมือนคน",
      "อินเทอร์เน็ตความเร็วสูงพิเศษ",
    ],
    correct: 1,
    explanation: "AI คือระบบที่จำลองความสามารถทางปัญญาของมนุษย์ เช่น การเรียนรู้ การใช้เหตุผล และการแก้ปัญหา",
  },
  {
    id: 2,
    question: "อะไรคือตัวอย่างของ AI ที่เราใช้ในชีวิตประจำวัน?",
    icon: "📱",
    options: [
      "ตู้เย็นทั่วไป",
      "ระบบแนะนำคอนเทนต์ของ Netflix",
      "หลอดไฟ LED",
      "รีโมทคอนโทรล",
    ],
    correct: 1,
    explanation: "Netflix ใช้ AI วิเคราะห์พฤติกรรมการดูของคุณแล้วแนะนำเนื้อหาที่คุณน่าจะชอบ — นี่คือ AI ในชีวิตจริง!",
  },
  {
    id: 3,
    question: "AI 'เรียนรู้' ได้อย่างไร?",
    icon: "📚",
    options: [
      "โปรแกรมเมอร์เขียนคำตอบทุกอย่างไว้ล่วงหน้า",
      "AI อ่านหนังสือเหมือนมนุษย์",
      "จากการวิเคราะห์ข้อมูลจำนวนมากและหา pattern",
      "จากการดูโทรทัศน์ตลอดวัน",
    ],
    correct: 2,
    explanation: "AI เรียนรู้จาก data จำนวนมาก โดยหา pattern และความสัมพันธ์ในข้อมูล แล้วนำมาทำนายหรือตัดสินใจ",
  },
];

function useTypewriter(text: string, speed = 28) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(interval); setDone(true); }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return { displayed, done };
}

function DialogueBox({ dialogue, onNext, index, total }: {
  dialogue: (typeof NPC_DIALOGUE)[0]; onNext: () => void; index: number; total: number;
}) {
  const { displayed, done } = useTypewriter(dialogue.text);
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
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
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-glow-pulse" />
        <span className="text-xs tracking-widest text-cyan-500" style={{ fontFamily: "var(--font-mono)" }}>
          {dialogue.sub}
        </span>
      </div>
      <div className="w-full glass-card rounded-2xl p-6 border border-cyan-500/20 min-h-[90px]">
        <p className="text-white text-base sm:text-lg leading-relaxed text-center">
          {displayed}
          {!done && <span className="inline-block w-0.5 h-5 bg-cyan-400 ml-1 animate-pulse align-middle" />}
        </p>
      </div>
      <div className="flex gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={`h-2 rounded-full transition-all ${i === index ? "bg-cyan-400 w-6" : i < index ? "bg-cyan-700 w-2" : "bg-gray-700 w-2"}`} />
        ))}
      </div>
      <button onClick={onNext} className="btn-neon-cyan px-8 py-3 text-xs font-bold tracking-widest rounded-xl" style={{ fontFamily: "var(--font-orbitron)" }}>
        {index < total - 1 ? "NEXT ▶" : "START QUIZ ▶"}
      </button>
    </div>
  );
}

function QuizCard({ q, qIndex, total, onAnswer }: {
  q: Question; qIndex: number; total: number; onAnswer: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  function handleSelect(idx: number) {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
    setTimeout(() => onAnswer(idx === q.correct), 1200);
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
          QUESTION {qIndex + 1}/{total}
        </span>
        <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full transition-all duration-500"
            style={{ width: `${((qIndex) / total) * 100}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="glass-card rounded-2xl p-6 border border-cyan-500/20">
        <div className="text-3xl mb-4 text-center">{q.icon}</div>
        <h3 className="text-base sm:text-lg font-bold text-white text-center leading-relaxed" style={{ fontFamily: "var(--font-orbitron)" }}>
          {q.question}
        </h3>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {q.options.map((opt, i) => {
          let style = "border-gray-700/50 bg-gray-900/30 text-gray-300 hover:border-cyan-500/40 hover:bg-cyan-500/5 cursor-pointer";
          if (revealed) {
            if (i === q.correct) style = "border-green-500/60 bg-green-500/15 text-green-300 cursor-default";
            else if (i === selected) style = "border-red-500/60 bg-red-500/10 text-red-400 cursor-default";
            else style = "border-gray-800/30 bg-transparent text-gray-600 cursor-default opacity-50";
          }
          return (
            <button key={i} onClick={() => handleSelect(i)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 text-sm leading-relaxed ${style}`}
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <span className="mr-3 font-bold text-xs tracking-widest">
                {["A", "B", "C", "D"][i]}.
              </span>
              {opt}
              {revealed && i === q.correct && <span className="float-right">✓</span>}
              {revealed && i === selected && i !== q.correct && <span className="float-right">✗</span>}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {revealed && (
        <div className={`p-4 rounded-xl border text-sm leading-relaxed transition-all duration-300 ${selected === q.correct ? "border-green-500/30 bg-green-500/10 text-green-300" : "border-orange-500/30 bg-orange-500/10 text-orange-300"}`}>
          <span className="font-bold tracking-widest text-xs block mb-1" style={{ fontFamily: "var(--font-orbitron)" }}>
            {selected === q.correct ? "✓ CORRECT!" : "✗ INCORRECT"}
          </span>
          💡 {q.explanation}
        </div>
      )}
    </div>
  );
}

function ResultScreen({ score, total, onClaim }: { score: number; total: number; onClaim: () => void }) {
  const pct = Math.round((score / total) * 100);
  const grade = pct === 100 ? "S" : pct >= 66 ? "A" : pct >= 33 ? "B" : "C";
  const gradeColor = { S: "text-yellow-300", A: "text-cyan-300", B: "text-green-400", C: "text-orange-400" }[grade];
  const earnedXP = Math.round(MISSION.xp * (score / total));
  const earnedCredits = Math.round(MISSION.credits * (score / total));
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <div className={`w-full max-w-2xl mx-auto space-y-5 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      <div className="glass-card rounded-2xl p-6 border border-cyan-500/20 text-center">
        <div className="text-xs tracking-widest text-gray-500 mb-3" style={{ fontFamily: "var(--font-mono)" }}>
          // QUIZ_COMPLETE
        </div>
        <div className="flex items-center justify-center gap-8 mb-4">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <circle cx="50" cy="50" r="42" fill="none" stroke={pct >= 66 ? "#00f5ff" : pct >= 33 ? "#4ade80" : "#fb923c"}
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${(pct / 100) * 264} 264`}
                style={{ transition: "stroke-dasharray 1.2s ease", filter: "drop-shadow(0 0 6px currentColor)" }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-orbitron)" }}>{score}/{total}</span>
              <span className="text-xs text-gray-500">CORRECT</span>
            </div>
          </div>
          <div className="text-left">
            <div className={`text-5xl font-black ${gradeColor} drop-shadow-[0_0_15px_currentColor] mb-1`} style={{ fontFamily: "var(--font-orbitron)" }}>
              {grade}
            </div>
            <div className="text-xs text-gray-500 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>GRADE</div>
            <div className="text-xs text-gray-400 mt-1">{pct === 100 ? "PERFECT SCORE!" : pct >= 66 ? "GREAT JOB!" : "KEEP GOING!"}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card rounded-xl p-4 border border-yellow-500/20 text-center">
          <div className="text-2xl mb-1">⚡</div>
          <div className="text-xl font-black text-yellow-400" style={{ fontFamily: "var(--font-orbitron)" }}>+{earnedXP}</div>
          <div className="text-xs text-gray-500 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>XP EARNED</div>
        </div>
        <div className="glass-card rounded-xl p-4 border border-purple-500/20 text-center">
          <div className="text-2xl mb-1">💎</div>
          <div className="text-xl font-black text-purple-400" style={{ fontFamily: "var(--font-orbitron)" }}>+{earnedCredits}</div>
          <div className="text-xs text-gray-500 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>CREDITS</div>
        </div>
      </div>

      <button onClick={onClaim} className="w-full btn-neon-pink py-4 text-sm font-bold tracking-widest rounded-xl" style={{ fontFamily: "var(--font-orbitron)" }}>
        ▶ CLAIM REWARDS
      </button>
    </div>
  );
}

function CompleteScreen({ score, total }: { score: number; total: number }) {
  const pct = Math.round((score / total) * 100);
  return (
    <div className="w-full max-w-2xl mx-auto text-center space-y-8">
      <div className="text-xs tracking-widest text-cyan-400" style={{ fontFamily: "var(--font-mono)" }}>// MISSION_DEBRIEF</div>
      <h2 className="text-3xl sm:text-4xl font-black" style={{ fontFamily: "var(--font-orbitron)" }}>
        <span className="neon-text-cyan">MISSION</span><br />
        <span className="neon-text-pink">ACCOMPLISHED</span>
      </h2>
      <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
        คุณสำเร็จภารกิจ <span className="text-white font-bold">What is AI?</span> แล้ว!
        {pct === 100 ? " คะแนนเต็ม 100% — คุณเป็น AI Pioneer ตัวจริง! 🏆" : " ทักษะความเข้าใจ AI ของคุณเริ่มพัฒนาแล้ว!"}
      </p>
      <div className="glass-card rounded-2xl p-6 text-left space-y-3">
        <div className="text-xs font-bold tracking-widest text-gray-400 mb-4" style={{ fontFamily: "var(--font-orbitron)" }}>SKILLS ACQUIRED:</div>
        {[
          { icon: "🧠", skill: "AI Fundamentals", desc: "รู้จักความหมายและแนวคิดพื้นฐานของ AI" },
          { icon: "🔍", skill: "AI Recognition", desc: "จดจำ AI ในชีวิตประจำวันได้" },
          { icon: "📊", skill: "Machine Learning Basics", desc: "เข้าใจหลักการเรียนรู้จากข้อมูลเบื้องต้น" },
        ].map((item) => (
          <div key={item.skill} className="flex items-start gap-3 p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
            <span className="text-xl shrink-0">{item.icon}</span>
            <div>
              <div className="text-sm font-bold text-white mb-0.5" style={{ fontFamily: "var(--font-orbitron)" }}>{item.skill}</div>
              <div className="text-xs text-gray-500">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/dashboard" className="flex-1 btn-neon-cyan py-3 text-xs font-bold tracking-widest rounded-xl text-center" style={{ fontFamily: "var(--font-orbitron)" }}>
          ← BACK TO HQ
        </Link>
        <Link href="/missions/ml-101" className="flex-1 btn-neon-pink py-3 text-xs font-bold tracking-widest rounded-xl text-center" style={{ fontFamily: "var(--font-orbitron)" }}>
          NEXT MISSION →
        </Link>
      </div>
    </div>
  );
}

export default function WhatIsAIMissionPage() {
  const [phase, setPhase] = useState<Phase>("briefing");
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showReward, setShowReward] = useState(false);

  function handleNextDialogue() {
    if (dialogueIndex < NPC_DIALOGUE.length - 1) {
      setDialogueIndex((i) => i + 1);
    } else {
      setPhase("quiz");
    }
  }

  function handleAnswer(correct: boolean) {
    if (correct) setScore((s) => s + 1);
    if (qIndex < QUESTIONS.length - 1) {
      setQIndex((i) => i + 1);
    } else {
      setPhase("result");
    }
  }

  return (
    <div className="min-h-screen bg-[#050510] cyber-grid">
      <Navbar />

      {showReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass-card rounded-3xl p-8 max-w-sm w-full text-center border border-cyan-500/30"
            style={{ boxShadow: "0 0 60px rgba(0,245,255,0.2), 0 0 120px rgba(255,0,128,0.1)" }}>
            <div className="text-6xl mb-4 animate-float">🏆</div>
            <div className="text-xs tracking-widest text-cyan-400 mb-2" style={{ fontFamily: "var(--font-mono)" }}>MISSION COMPLETE!</div>
            <div className="text-2xl font-black text-white mb-6" style={{ fontFamily: "var(--font-orbitron)" }}>
              WHAT IS AI?<br /><span className="neon-text-pink">CLEARED</span>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <span className="text-sm font-bold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-orbitron)" }}>⚡ XP EARNED</span>
                <span className="text-xl font-black text-yellow-400" style={{ fontFamily: "var(--font-orbitron)" }}>+{Math.round(MISSION.xp * (score / QUESTIONS.length))}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <span className="text-sm font-bold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-orbitron)" }}>💎 CREDITS</span>
                <span className="text-xl font-black text-purple-400" style={{ fontFamily: "var(--font-orbitron)" }}>+{Math.round(MISSION.credits * (score / QUESTIONS.length))}</span>
              </div>
            </div>
            <button onClick={() => { setShowReward(false); setPhase("complete"); }}
              className="w-full btn-neon-pink py-3 text-sm font-bold tracking-widest rounded-xl" style={{ fontFamily: "var(--font-orbitron)" }}>
              ▶ CONTINUE
            </button>
          </div>
        </div>
      )}

      <div className="pt-20 pb-12 px-4">
        {/* Mission header */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="glass-card rounded-2xl p-4 border border-cyan-500/20">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-xl">
                  {MISSION.icon}
                </div>
                <div>
                  <div className="text-xs text-cyan-400 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
                    {MISSION.code} • {MISSION.difficulty}
                  </div>
                  <div className="text-sm font-black text-white" style={{ fontFamily: "var(--font-orbitron)" }}>
                    {MISSION.title}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs" style={{ fontFamily: "var(--font-mono)" }}>
                <span className="text-yellow-400 flex items-center gap-1">⚡ {MISSION.xp} XP</span>
                <span className="text-purple-400 flex items-center gap-1">💎 {MISSION.credits} Credits</span>
                <span className={`px-2 py-1 rounded-lg tracking-widest ${phase === "briefing" ? "bg-gray-700/50 text-gray-500" : phase === "quiz" ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30" : phase === "result" ? "bg-pink-500/15 text-pink-400 border border-pink-500/30" : "bg-green-500/15 text-green-400 border border-green-500/30"}`}>
                  {phase === "briefing" && "BRIEFING"}
                  {phase === "quiz" && `● Q${qIndex + 1}/${QUESTIONS.length}`}
                  {phase === "result" && "RESULTS"}
                  {phase === "complete" && "✓ COMPLETE"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {phase === "briefing" && (
          <div className="flex flex-col items-center min-h-[60vh] justify-center">
            <DialogueBox dialogue={NPC_DIALOGUE[dialogueIndex]} onNext={handleNextDialogue} index={dialogueIndex} total={NPC_DIALOGUE.length} />
          </div>
        )}

        {phase === "quiz" && (
          <div className="flex flex-col items-center min-h-[60vh] justify-center">
            <QuizCard key={qIndex} q={QUESTIONS[qIndex]} qIndex={qIndex} total={QUESTIONS.length} onAnswer={handleAnswer} />
          </div>
        )}

        {phase === "result" && (
          <ResultScreen score={score} total={QUESTIONS.length} onClaim={() => setShowReward(true)} />
        )}

        {phase === "complete" && (
          <CompleteScreen score={score} total={QUESTIONS.length} />
        )}
      </div>
    </div>
  );
}
