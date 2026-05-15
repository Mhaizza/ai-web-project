"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

type Phase = "briefing" | "quiz" | "result" | "complete";

const MISSION = { code: "M-002", title: "MACHINE LEARNING 101", icon: "⚙️", xp: 200, credits: 40, difficulty: "EASY" };

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
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400/40 flex items-center justify-center text-4xl animate-float">
          {dialogue.mood}
        </div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#050510] border border-yellow-500/40 whitespace-nowrap">
          <span className="text-xs font-bold text-yellow-400 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
            {dialogue.speaker}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-glow-pulse" />
        <span className="text-xs tracking-widest text-yellow-500" style={{ fontFamily: "var(--font-mono)" }}>
          {dialogue.sub}
        </span>
      </div>
      <div className="w-full glass-card rounded-2xl p-6 border border-yellow-500/20 min-h-[90px]">
        <p className="text-white text-base sm:text-lg leading-relaxed text-center">
          {displayed}
          {!done && <span className="inline-block w-0.5 h-5 bg-yellow-400 ml-1 animate-pulse align-middle" />}
        </p>
      </div>
      <div className="flex gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={`h-2 rounded-full transition-all ${i === index ? "bg-yellow-400 w-6" : i < index ? "bg-yellow-700 w-2" : "bg-gray-700 w-2"}`} />
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
    setTimeout(() => onAnswer(idx === q.correct), 1400);
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
          QUESTION {qIndex + 1}/{total}
        </span>
        <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-400 rounded-full transition-all duration-500"
            style={{ width: `${(qIndex / total) * 100}%` }} />
        </div>
      </div>
      <div className="glass-card rounded-2xl p-6 border border-yellow-500/20">
        <div className="text-3xl mb-4 text-center">{q.icon}</div>
        <h3 className="text-base sm:text-lg font-bold text-white text-center leading-relaxed" style={{ fontFamily: "var(--font-orbitron)" }}>
          {q.question}
        </h3>
      </div>
      <div className="space-y-3">
        {q.options.map((opt, i) => {
          let style = "border-gray-700/50 bg-gray-900/30 text-gray-300 hover:border-yellow-500/40 hover:bg-yellow-500/5 cursor-pointer";
          if (revealed) {
            if (i === q.correct) style = "border-green-500/60 bg-green-500/15 text-green-300 cursor-default";
            else if (i === selected) style = "border-red-500/60 bg-red-500/10 text-red-400 cursor-default";
            else style = "border-gray-800/30 bg-transparent text-gray-600 cursor-default opacity-50";
          }
          return (
            <button key={i} onClick={() => handleSelect(i)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 text-sm leading-relaxed ${style}`}
              style={{ fontFamily: "var(--font-mono)" }}>
              <span className="mr-3 font-bold text-xs tracking-widest">{["A", "B", "C", "D"][i]}.</span>
              {opt}
              {revealed && i === q.correct && <span className="float-right">✓</span>}
              {revealed && i === selected && i !== q.correct && <span className="float-right">✗</span>}
            </button>
          );
        })}
      </div>
      {revealed && (
        <div className={`p-4 rounded-xl border text-sm leading-relaxed ${selected === q.correct ? "border-green-500/30 bg-green-500/10 text-green-300" : "border-orange-500/30 bg-orange-500/10 text-orange-300"}`}>
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
  const grade = pct === 100 ? "S" : pct >= 75 ? "A" : pct >= 50 ? "B" : "C";
  const gradeColor = { S: "text-yellow-300", A: "text-cyan-300", B: "text-green-400", C: "text-orange-400" }[grade];
  const earnedXP = Math.round(MISSION.xp * (score / total));
  const earnedCredits = Math.round(MISSION.credits * (score / total));
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <div className={`w-full max-w-2xl mx-auto space-y-5 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      <div className="glass-card rounded-2xl p-6 border border-yellow-500/20 text-center">
        <div className="text-xs tracking-widest text-gray-500 mb-3" style={{ fontFamily: "var(--font-mono)" }}>// QUIZ_COMPLETE</div>
        <div className="flex items-center justify-center gap-8 mb-4">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <circle cx="50" cy="50" r="42" fill="none" stroke={pct >= 75 ? "#00f5ff" : pct >= 50 ? "#4ade80" : "#fb923c"}
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
            <div className={`text-5xl font-black ${gradeColor} drop-shadow-[0_0_15px_currentColor] mb-1`} style={{ fontFamily: "var(--font-orbitron)" }}>{grade}</div>
            <div className="text-xs text-gray-500 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>GRADE</div>
            <div className="text-xs text-gray-400 mt-1">{pct === 100 ? "PERFECT!" : pct >= 75 ? "EXCELLENT!" : pct >= 50 ? "GOOD JOB!" : "KEEP TRYING!"}</div>
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
      <div className="text-xs tracking-widest text-yellow-400" style={{ fontFamily: "var(--font-mono)" }}>// MISSION_DEBRIEF</div>
      <h2 className="text-3xl sm:text-4xl font-black" style={{ fontFamily: "var(--font-orbitron)" }}>
        <span className="neon-text-cyan">MISSION</span><br /><span className="neon-text-pink">ACCOMPLISHED</span>
      </h2>
      <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
        คุณสำเร็จภารกิจ <span className="text-white font-bold">Machine Learning 101</span> แล้ว!
        {pct >= 75 ? " ความเข้าใจ ML ของคุณแข็งแกร่งมาก! 🔥" : " เดินหน้าต่อสู่ Neural Networks!"}
      </p>
      <div className="glass-card rounded-2xl p-6 text-left space-y-3">
        <div className="text-xs font-bold tracking-widest text-gray-400 mb-4" style={{ fontFamily: "var(--font-orbitron)" }}>SKILLS ACQUIRED:</div>
        {[
          { icon: "⚙️", skill: "Machine Learning Concepts", desc: "เข้าใจหลักการพื้นฐานของ ML" },
          { icon: "📊", skill: "Training Data Literacy", desc: "รู้จักบทบาทของ data ในการสอน AI" },
          { icon: "🏷️", skill: "Classification Basics", desc: "เข้าใจ task ประเภท Classification" },
        ].map((item) => (
          <div key={item.skill} className="flex items-start gap-3 p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/10">
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
        <Link href="/missions/neural-network" className="flex-1 btn-neon-pink py-3 text-xs font-bold tracking-widest rounded-xl text-center" style={{ fontFamily: "var(--font-orbitron)" }}>
          NEXT MISSION →
        </Link>
      </div>
    </div>
  );
}

export default function ML101MissionPage() {
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
          <div className="glass-card rounded-3xl p-8 max-w-sm w-full text-center border border-yellow-500/30"
            style={{ boxShadow: "0 0 60px rgba(250,204,21,0.15), 0 0 120px rgba(255,0,128,0.1)" }}>
            <div className="text-6xl mb-4 animate-float">⚙️</div>
            <div className="text-xs tracking-widest text-yellow-400 mb-2" style={{ fontFamily: "var(--font-mono)" }}>MISSION COMPLETE!</div>
            <div className="text-2xl font-black text-white mb-6" style={{ fontFamily: "var(--font-orbitron)" }}>
              ML 101<br /><span className="neon-text-pink">CLEARED</span>
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
        <div className="max-w-2xl mx-auto mb-8">
          <div className="glass-card rounded-2xl p-4 border border-yellow-500/20">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center text-xl">{MISSION.icon}</div>
                <div>
                  <div className="text-xs text-yellow-400 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>{MISSION.code} • {MISSION.difficulty}</div>
                  <div className="text-sm font-black text-white" style={{ fontFamily: "var(--font-orbitron)" }}>{MISSION.title}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs" style={{ fontFamily: "var(--font-mono)" }}>
                <span className="text-yellow-400">⚡ {MISSION.xp} XP</span>
                <span className="text-purple-400">💎 {MISSION.credits} Credits</span>
                <span className={`px-2 py-1 rounded-lg tracking-widest ${phase === "briefing" ? "bg-gray-700/50 text-gray-500" : phase === "quiz" ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30" : phase === "result" ? "bg-pink-500/15 text-pink-400 border border-pink-500/30" : "bg-green-500/15 text-green-400 border border-green-500/30"}`}>
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
        {phase === "result" && <ResultScreen score={score} total={QUESTIONS.length} onClaim={() => setShowReward(true)} />}
        {phase === "complete" && <CompleteScreen score={score} total={QUESTIONS.length} />}
      </div>
    </div>
  );
}
