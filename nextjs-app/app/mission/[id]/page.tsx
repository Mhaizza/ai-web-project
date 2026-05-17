"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { getMission, getWorld } from "@/lib/missions";
import { useGameStore } from "@/store/gameStore";
import { useTypewriter, playSound } from "@/lib/game-utils";

type Phase = "briefing" | "input" | "evaluating" | "result";

interface PageProps {
  params: Promise<{ id: string }>;
}

const BRIEFINGS: Record<
  string,
  { speaker: string; mood: string; lines: string[] }
> = {
  default: {
    speaker: "ORACLE",
    mood: "🤖",
    lines: [
      "ภารกิจใหม่เข้ามาในระบบ AGENT_001 ลองอ่านภารกิจให้เข้าใจก่อนรับ",
      "เขียน prompt หรือคำตอบของคุณให้ดีที่สุด — AI จะประเมินคุณภาพแล้วให้ XP ตามผลงาน",
      "ใช้พลังงานเพื่อเริ่มภารกิจ ถ้าทำสำเร็จคุณจะได้ XP, credits, และปลดล็อกภารกิจถัดไป",
    ],
  },
  "boss-chatbot": {
    speaker: "MASTERMIND.exe",
    mood: "👾",
    lines: [
      "AGENT_001 — นี่คือภารกิจ BOSS ของ AI ORIGINS",
      "หน้าที่ของคุณคือออกแบบ system prompt สำหรับ AI Chatbot ขายของออนไลน์",
      "คิดให้รอบด้าน: บทบาท, ลำดับการพูดคุย, การจัดการลูกค้าที่ดื้อ และจรรยาบรรณ",
      "ผ่านได้คุณคือ MASTER OF WORLD 1 — พลาดได้ก็ลองใหม่ได้",
    ],
  },
  "deep-learning": {
    speaker: "DR. NEURON",
    mood: "🧠",
    lines: [
      "ยินดีต้อนรับสู่ MACHINE MIND, AGENT_001",
      "Deep Learning ไม่ใช่แค่ Machine Learning ที่ลึกขึ้น — มันคือสถาปัตยกรรมใหม่ทั้งหมด",
      "อธิบายให้ฉันฟัง: ทำไม Deep Network ถึงทำงานได้ดีกับข้อมูลขนาดใหญ่?",
    ],
  },
  transformers: {
    speaker: "ATTN-9",
    mood: "🌀",
    lines: [
      "Transformer คือสมองเบื้องหลัง LLM ทุกตัว",
      "อธิบายแนวคิด 'Attention is All You Need' ในแบบของคุณ",
      "ภารกิจระดับสูง — ใช้ความรู้ที่ได้สะสมมาทั้งหมด",
    ],
  },
};

function getBriefing(id: string) {
  return BRIEFINGS[id] ?? BRIEFINGS.default;
}

function DialogBox({
  text,
  onNext,
  current,
  total,
  speaker,
  mood,
}: {
  text: string;
  onNext: () => void;
  current: number;
  total: number;
  speaker: string;
  mood: string;
}) {
  const { displayed, done, skip } = useTypewriter(text);

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-lg mx-auto">
      <div className="relative">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
          style={{
            animation: "float 4s ease-in-out infinite",
            background:
              "linear-gradient(135deg, rgba(0,245,255,0.18), rgba(191,0,255,0.12))",
            border: "2px solid rgba(0,245,255,0.45)",
          }}
        >
          {mood}
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#050510] border border-cyan-500/40 whitespace-nowrap">
          <span
            className="text-xs font-bold text-cyan-400 tracking-widest"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {speaker}
          </span>
        </div>
      </div>

      <div
        className="w-full glass-card rounded-2xl p-5 border border-cyan-500/15 min-h-[100px] cursor-pointer"
        onClick={() => !done && skip()}
      >
        <p className="text-white text-sm sm:text-base leading-relaxed text-center">
          {displayed}
          {!done && (
            <span
              className="inline-block w-0.5 h-4 bg-cyan-400 ml-1 align-middle"
              style={{ animation: "pulse 1s infinite" }}
            />
          )}
        </p>
        {!done && (
          <p
            className="text-xs text-gray-600 text-center mt-2 tracking-widest"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            TAP TO SKIP
          </p>
        )}
      </div>

      <div className="flex gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: i === current ? 24 : 8,
              background:
                i === current
                  ? "#00f5ff"
                  : i < current
                  ? "rgba(0,245,255,0.4)"
                  : "#374151",
            }}
          />
        ))}
      </div>

      <button
        onClick={() => {
          playSound("click");
          onNext();
        }}
        disabled={!done}
        className={`px-8 py-3 text-xs font-bold tracking-widest rounded-xl w-full sm:w-auto ${
          done
            ? "btn-neon-cyan"
            : "border border-gray-800 text-gray-700 cursor-not-allowed"
        }`}
        style={{ fontFamily: "var(--font-orbitron)" }}
      >
        {current < total - 1 ? "NEXT ▶" : "เริ่มภารกิจ ▶"}
      </button>
    </div>
  );
}

function evaluateAnswer(answer: string): {
  score: number;
  tier: "S" | "A" | "B" | "C" | "D";
  feedback: string;
} {
  const trimmed = answer.trim();
  const len = trimmed.length;
  const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
  const hasExample = /เช่น|ตัวอย่าง|เหมือน|คล้าย|เปรียบ|ก็คือ/.test(trimmed);
  const hasStructure = /\n|—|:|;|,/.test(trimmed);

  const lengthScore = Math.min(50, Math.floor(len / 8));
  const wordScore = Math.min(25, wordCount * 2);
  const exampleScore = hasExample ? 15 : 0;
  const structureScore = hasStructure ? 10 : 0;
  const score = Math.min(
    100,
    lengthScore + wordScore + exampleScore + structureScore
  );

  let tier: "S" | "A" | "B" | "C" | "D" = "D";
  let feedback = "ลองเขียนให้ละเอียดขึ้น และยกตัวอย่างประกอบ";
  if (score >= 85) {
    tier = "S";
    feedback =
      "ยอดเยี่ยม! คำตอบของคุณครอบคลุม มีตัวอย่างประกอบ และมีโครงสร้างชัดเจน — ELITE TIER";
  } else if (score >= 70) {
    tier = "A";
    feedback = "ดีมาก! ครบถ้วนและชัดเจน เพิ่มตัวอย่างเล็กน้อยจะสมบูรณ์แบบ";
  } else if (score >= 50) {
    tier = "B";
    feedback = "ดี เข้าใจคอนเซ็ปต์แล้ว ลองเพิ่มตัวอย่างและรายละเอียด";
  } else if (score >= 30) {
    tier = "C";
    feedback = "เริ่มต้นได้ ลองอธิบายให้ลึกขึ้นและยาวขึ้น";
  }

  return { score, tier, feedback };
}

export default function GenericMissionPage({ params }: PageProps) {
  const { id } = use(params);
  const mission = getMission(id);
  const world = mission ? getWorld(mission.worldId) : undefined;

  const rewardMission = useGameStore((s) => s.rewardMission);
  const spendEnergy = useGameStore((s) => s.spendEnergy);
  const energy = useGameStore((s) => s.energy);
  const completed = useGameStore((s) => s.completed);
  const hydrated = useGameStore((s) => s.hydrated);

  const [phase, setPhase] = useState<Phase>("briefing");
  const [dlgIdx, setDlgIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<ReturnType<typeof evaluateAnswer> | null>(
    null
  );
  const [earnedXP, setEarnedXP] = useState(0);
  const [earnedCredits, setEarnedCredits] = useState(0);
  const [claimed, setClaimed] = useState(false);
  const [insufficientEnergy, setInsufficientEnergy] = useState(false);

  const briefing = getBriefing(id);

  useEffect(() => {
    if (!hydrated || !mission) return;
    if (phase !== "input") return;
    if (completed.includes(mission.id)) return;
    const ok = spendEnergy(mission.energyCost);
    if (!ok) {
      setInsufficientEnergy(true);
      setPhase("briefing");
    }
  }, [phase, mission, spendEnergy, completed, hydrated]);

  useEffect(() => {
    if (phase !== "result" || !result || !mission || claimed) return;
    const xp = Math.round(mission.reward.xp * (result.score / 100));
    const credits = Math.round(mission.reward.credits * (result.score / 100));
    setEarnedXP(xp);
    setEarnedCredits(credits);
    rewardMission(xp, credits, mission.id, mission.title);
    playSound("complete");
    setClaimed(true);
  }, [phase, result, mission, claimed, rewardMission]);

  if (!mission) {
    return (
      <div className="min-h-screen bg-[#050510] cyber-grid">
        <Navbar />
        <main className="pt-32 px-4 max-w-md mx-auto text-center">
          <h1
            className="text-3xl font-black neon-text-pink mb-4"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            MISSION NOT FOUND
          </h1>
          <p className="text-gray-400 mb-6">
            ID นี้ไม่อยู่ในระบบ ภารกิจอาจถูกลบหรือยังไม่ได้สร้าง
          </p>
          <Link
            href="/world"
            className="btn-neon-cyan px-6 py-3 text-xs font-bold tracking-widest rounded-xl inline-block"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            ← BACK TO WORLD MAP
          </Link>
        </main>
      </div>
    );
  }

  const handleSubmit = () => {
    if (answer.trim().length < 20) return;
    setPhase("evaluating");
    playSound("click");
    setTimeout(() => {
      const r = evaluateAnswer(answer);
      setResult(r);
      setPhase("result");
    }, 1600);
  };

  return (
    <div className="min-h-screen bg-[#050510] cyber-grid">
      <Navbar />

      <div className="pt-20 pb-12 px-4">
        {/* Mission header card */}
        <div className="max-w-lg mx-auto mb-6">
          <div className="glass-card rounded-2xl p-4 border border-cyan-500/15">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-xl">
                  {mission.icon}
                </div>
                <div>
                  <p
                    className="text-xs text-cyan-400 tracking-widest"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {mission.code} • {mission.difficulty} • {world?.name ?? ""}
                  </p>
                  <p
                    className="text-sm font-black text-white"
                    style={{ fontFamily: "var(--font-orbitron)" }}
                  >
                    {mission.title}
                  </p>
                </div>
              </div>
              <div
                className="flex items-center gap-3 text-xs"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <span className="text-yellow-400">⚡ {mission.reward.xp} XP</span>
                <span className="text-purple-400">
                  💎 {mission.reward.credits}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <AnimatePresence mode="wait">
            {/* ─── Briefing ── */}
            {phase === "briefing" && (
              <motion.div
                key="briefing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col items-center justify-center min-h-[55vh] gap-4"
              >
                <DialogBox
                  text={briefing.lines[dlgIdx]}
                  onNext={() => {
                    if (dlgIdx < briefing.lines.length - 1) {
                      setDlgIdx((i) => i + 1);
                    } else {
                      setPhase("input");
                    }
                  }}
                  current={dlgIdx}
                  total={briefing.lines.length}
                  speaker={briefing.speaker}
                  mood={briefing.mood}
                />

                {insufficientEnergy && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-card rounded-xl p-4 border border-yellow-500/40 max-w-sm text-center"
                  >
                    <p
                      className="text-xs tracking-widest text-yellow-400 mb-1"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      // INSUFFICIENT_ENERGY
                    </p>
                    <p className="text-sm text-gray-300">
                      ต้องการ ⚡{mission.energyCost} แต่คุณมีเพียง {energy}
                      <br />
                      <span className="text-xs text-gray-500">
                        รอพลังงานเติม หรือเล่นภารกิจที่ใช้พลังงานน้อยกว่า
                      </span>
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ─── Input ── */}
            {phase === "input" && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-lg mx-auto space-y-4"
              >
                <div className="glass-card rounded-2xl p-5 border border-cyan-500/25">
                  <p
                    className="text-xs text-cyan-400 tracking-widest mb-3"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    // MISSION_OBJECTIVE
                  </p>
                  <p className="text-base text-white leading-relaxed mb-4">
                    {mission.description}
                  </p>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    rows={8}
                    placeholder="เขียนคำตอบของคุณที่นี่... อธิบายให้ละเอียด ยกตัวอย่าง และเชื่อมโยงกับสิ่งที่คุณรู้"
                    className="w-full bg-black/40 border border-cyan-500/20 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-700 resize-none outline-none focus:border-cyan-500/50 transition-colors"
                    style={{ fontFamily: "var(--font-mono)" }}
                  />
                  <div
                    className="flex items-center justify-between mt-2 text-xs"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    <span className="text-gray-500">
                      {answer.trim().length} ตัวอักษร (ต้องการ 20+)
                    </span>
                    <span
                      className={
                        answer.trim().length >= 20
                          ? "text-green-400"
                          : "text-gray-600"
                      }
                    >
                      {answer.trim().length >= 20 ? "✓ READY" : "● TYPING..."}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={answer.trim().length < 20}
                  className={`w-full py-4 text-xs font-bold tracking-widest rounded-xl transition-all ${
                    answer.trim().length >= 20
                      ? "btn-neon-pink"
                      : "border border-gray-800 text-gray-700 cursor-not-allowed"
                  }`}
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  ▶ ส่งให้ AI ประเมิน
                </button>
              </motion.div>
            )}

            {/* ─── Evaluating ── */}
            {phase === "evaluating" && (
              <motion.div
                key="evaluating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-md mx-auto py-12 text-center space-y-4"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.4,
                    ease: "linear",
                  }}
                  className="w-16 h-16 mx-auto rounded-full border-4 border-cyan-500/20 border-t-cyan-400"
                />
                <p
                  className="text-sm text-cyan-400 tracking-widest"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  // AI_NEURAL_ANALYSIS...
                </p>
                <p className="text-xs text-gray-500">
                  ระบบกำลังประเมินคำตอบของคุณ
                </p>
              </motion.div>
            )}

            {/* ─── Result ── */}
            {phase === "result" && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-lg mx-auto space-y-4"
              >
                <div className="glass-card rounded-2xl p-6 border border-cyan-500/30 text-center space-y-4">
                  <p
                    className="text-xs text-gray-500 tracking-widest"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    // MISSION_RESULT
                  </p>
                  <div
                    className="text-7xl font-black"
                    style={{
                      fontFamily: "var(--font-orbitron)",
                      color:
                        result.tier === "S"
                          ? "#fde047"
                          : result.tier === "A"
                          ? "#00f5ff"
                          : result.tier === "B"
                          ? "#4ade80"
                          : result.tier === "C"
                          ? "#fb923c"
                          : "#f87171",
                      textShadow: "0 0 24px currentColor",
                    }}
                  >
                    {result.tier}
                  </div>
                  <p
                    className="text-2xl font-black text-white"
                    style={{ fontFamily: "var(--font-orbitron)" }}
                  >
                    SCORE: {result.score}%
                  </p>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {result.feedback}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-card rounded-xl p-4 text-center border border-yellow-500/30">
                    <p className="text-2xl mb-1">⚡</p>
                    <p
                      className="text-2xl font-black text-yellow-400"
                      style={{ fontFamily: "var(--font-orbitron)" }}
                    >
                      +{earnedXP}
                    </p>
                    <p
                      className="text-xs text-gray-500 tracking-widest"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      XP EARNED
                    </p>
                  </div>
                  <div className="glass-card rounded-xl p-4 text-center border border-purple-500/30">
                    <p className="text-2xl mb-1">💎</p>
                    <p
                      className="text-2xl font-black text-purple-400"
                      style={{ fontFamily: "var(--font-orbitron)" }}
                    >
                      +{earnedCredits}
                    </p>
                    <p
                      className="text-xs text-gray-500 tracking-widest"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      CREDITS
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Link
                    href="/world"
                    className="btn-neon-cyan py-3 text-xs font-bold tracking-widest rounded-xl text-center"
                    style={{ fontFamily: "var(--font-orbitron)" }}
                  >
                    🗺 WORLD MAP
                  </Link>
                  <Link
                    href="/dashboard"
                    className="btn-neon-pink py-3 text-xs font-bold tracking-widest rounded-xl text-center"
                    style={{ fontFamily: "var(--font-orbitron)" }}
                  >
                    📊 DASHBOARD
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
