"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { getMission, getWorld } from "@/lib/missions";
import { useGameStore } from "@/store/gameStore";
import { useTypewriter, playSound } from "@/lib/game-utils";
import { getGenericMissionFlow } from "@/lib/generic-mission-flows";
import type { GenericMissionFlow } from "@/lib/mission-flow-types";
import { TapMissionSteps } from "@/components/missions/TapMissionSteps";
import { MissionCoachBanner } from "@/components/missions/MissionCoachBanner";

type Phase = "briefing" | "tap" | "scaffold" | "input" | "evaluating" | "result";

interface PageProps {
  params: Promise<{ id: string }>;
}

/** Blend tap calibration into final writing score */
const STRUCTURED_TAP_WEIGHT = 0.42;
const MASTERY_TAP_WEIGHT = 0.28;

const BRIEFINGS: Record<
  string,
  { speaker: string; mood: string; lines: string[] }
> = {
  default: {
    speaker: "ORACLE",
    mood: "🤖",
    lines: [
      "ปฏิบัติการใหม่ลงทะเบียนแล้ว AGENT_001 — อ่านบรีฟให้จบแล้วกดเริ่ม",
      "ระบบจะสอบปฏิกิริยาแบบแตะก่อน จากนั้นจึงให้คุณเขียนดีบรีฟสั้น ๆ — ไม่มีหน้ากระดาษเปล่า",
      "ใช้ ⚡ ตามภารกิจ — ผ่านแล้วรับ XP / credits และปลดล็อกด่านถัดไป",
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
      "MACHINE MIND ออนไลน์ — ด่าน Deep Learning",
      "รอบแรก: สแกนสัญญาณด้วยการแตะ (MCQ / เติมคำ) — รวดเร็ว ไม่มีการบ้านยาว",
      "รอบสอง: เขียนดีบรีฟสั้นเชื่อมสัญญาณ — ORACLE ช่วยใส่คำกระตุ้นได้",
    ],
  },
  transformers: {
    speaker: "ATTN-9",
    mood: "🌀",
    lines: [
      "PROTOCOL: TRANSFORMER CORE",
      "สัญญาณเริ่มจากแคลิเบรชันแบบแตะ แล้วค่อยเข้าโหมดเหตุผลเชิงลึก",
      "พร้อมแล้วกดเริ่ม — อย่ากลัวหน้าเปล่า เราคุมจังหวะให้",
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
  finalCta,
}: {
  text: string;
  onNext: () => void;
  current: number;
  total: number;
  speaker: string;
  mood: string;
  finalCta: string;
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
        className={`px-8 py-3 text-xs font-bold tracking-widest rounded-xl w-full sm:w-auto min-h-[48px] touch-manipulation ${
          done
            ? "btn-neon-cyan"
            : "border border-gray-800 text-gray-700 cursor-not-allowed"
        }`}
        style={{ fontFamily: "var(--font-orbitron)" }}
      >
        {current < total - 1 ? "NEXT ▶" : finalCta}
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

function tierFromBlended(score: number): "S" | "A" | "B" | "C" | "D" {
  if (score >= 85) return "S";
  if (score >= 70) return "A";
  if (score >= 50) return "B";
  if (score >= 30) return "C";
  return "D";
}

function composeFeedback(
  tapPct: number | null,
  essayFeedback: string,
  hadTap: boolean
) {
  if (!hadTap) return essayFeedback;
  return `[SYNC ${tapPct}%] ${essayFeedback}`;
}

export default function GenericMissionPage({ params }: PageProps) {
  const { id } = use(params);
  const mission = getMission(id);
  const world = mission ? getWorld(mission.worldId) : undefined;
  const flow: GenericMissionFlow | null = mission
    ? getGenericMissionFlow(mission.id)
    : null;
  const accent = flow?.briefingAccent ?? world?.color ?? "#00f5ff";

  const rewardMission = useGameStore((s) => s.rewardMission);
  const spendEnergy = useGameStore((s) => s.spendEnergy);
  const energy = useGameStore((s) => s.energy);
  const completed = useGameStore((s) => s.completed);
  const hydrated = useGameStore((s) => s.hydrated);

  const [phase, setPhase] = useState<Phase>("briefing");
  const [dlgIdx, setDlgIdx] = useState(0);
  const [tapCorrectCount, setTapCorrectCount] = useState(0);
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
    const spendHere = flow ? phase === "tap" : phase === "input";
    if (!spendHere) return;
    if (completed.includes(mission.id)) return;
    const ok = spendEnergy(mission.energyCost);
    if (!ok) {
      setInsufficientEnergy(true);
      setPhase("briefing");
    }
  }, [phase, mission, spendEnergy, completed, hydrated, flow]);

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

  function beginAfterBriefing() {
    if (flow) setPhase("tap");
    else setPhase("input");
  }

  function handleTapComplete(correct: number) {
    setTapCorrectCount(correct);
    playSound("click");
    if (flow?.band === "structured") setPhase("scaffold");
    else setPhase("input");
  }

  function minWritingChars(): number {
    if (!flow) return 20;
    if (flow.band === "structured") return flow.scaffoldMinChars;
    return flow.essayMinChars;
  }

  function submitWriting() {
    if (answer.trim().length < minWritingChars()) return;
    setPhase("evaluating");
    playSound("click");
    setTimeout(() => {
      const essay = evaluateAnswer(answer);
      let blended = essay.score;
      let tier = essay.tier;
      let feedback = essay.feedback;
      const hadTap = Boolean(flow?.tapWarmup.length);

      if (flow && hadTap) {
        const tapPct = Math.round(
          (tapCorrectCount / flow.tapWarmup.length) * 100
        );
        const w =
          flow.band === "structured" ? STRUCTURED_TAP_WEIGHT : MASTERY_TAP_WEIGHT;
        blended = Math.round(w * tapPct + (1 - w) * essay.score);
        tier = tierFromBlended(blended);
        feedback = composeFeedback(tapPct, essay.feedback, true);
      } else if (flow && !hadTap) {
        tier = tierFromBlended(blended);
      }

      setResult({ score: blended, tier, feedback });
      playSound(blended >= 50 ? "correct" : "wrong");
      setPhase("result");
    }, 1400);
  }

  const writingReady = answer.trim().length >= minWritingChars();
  const bandLabel =
    mission.interactionBand === "foundation"
      ? "FOUNDATION"
      : mission.interactionBand === "structured"
      ? "STRUCTURED"
      : mission.interactionBand === "mastery"
      ? "MASTERY"
      : "STANDARD";

  return (
    <div className="min-h-screen bg-[#050510] cyber-grid">
      <Navbar />

      <div className="pt-20 pb-12 px-4">
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
              <div className="flex flex-col items-end gap-1">
                <span
                  className="text-[10px] tracking-[0.2em] px-2 py-0.5 rounded border text-gray-400"
                  style={{
                    fontFamily: "var(--font-mono)",
                    borderColor: `${accent}44`,
                  }}
                >
                  {bandLabel}
                </span>
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
        </div>

        <div className="flex flex-col items-center">
          <AnimatePresence mode="wait">
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
                      beginAfterBriefing();
                    }
                  }}
                  current={dlgIdx}
                  total={briefing.lines.length}
                  speaker={briefing.speaker}
                  mood={briefing.mood}
                  finalCta={flow ? "▶ เข้าสู่การสแกน" : "▶ เริ่มภารกิจ"}
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

            {phase === "tap" && flow && (
              <motion.div
                key="tap"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="w-full"
              >
                <p
                  className="text-center text-xs tracking-[0.35em] mb-4 font-bold"
                  style={{ fontFamily: "var(--font-mono)", color: accent }}
                >
                  // TAP_CALIBRATION
                </p>
                <TapMissionSteps
                  steps={flow.tapWarmup}
                  accentColor={accent}
                  onComplete={handleTapComplete}
                />
              </motion.div>
            )}

            {phase === "scaffold" && flow && flow.band === "structured" && (
              <motion.div
                key="scaffold"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="w-full max-w-lg mx-auto space-y-4"
              >
                <MissionCoachBanner
                  tips={[
                    ...flow.scaffoldBullets,
                    "กดชิปด้านล่างเพื่อแทรกคำศัพท์ — แล้วแก้ให้เป็นประโยคของคุณ",
                  ]}
                  accent={accent}
                />

                <div
                  className="glass-card rounded-2xl p-5 border space-y-3"
                  style={{ borderColor: `${accent}33` }}
                >
                  <p
                    className="text-xs font-bold tracking-widest"
                    style={{ fontFamily: "var(--font-mono)", color: accent }}
                  >
                    {flow.scaffoldTitle}
                  </p>
                  <p className="text-base text-white leading-relaxed">
                    {mission.description}
                  </p>
                  <ul className="text-sm text-gray-400 space-y-1.5 list-disc pl-4">
                    {flow.scaffoldBullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>

                {flow.chipInserts && flow.chipInserts.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {flow.chipInserts.map((c) => (
                      <button
                        key={c.label}
                        type="button"
                        onClick={() => {
                          playSound("click");
                          setAnswer((a) =>
                            a ? `${a.trimEnd()} ${c.insert}` : c.insert
                          );
                        }}
                        className="px-4 py-2.5 rounded-xl border border-gray-700 text-sm font-bold text-gray-200 bg-black/30 hover:border-cyan-500/45 min-h-[48px] touch-manipulation"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {c.icon ? `${c.icon} ` : ""}
                        {c.label}
                      </button>
                    ))}
                  </div>
                )}

                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={7}
                  placeholder={flow.scaffoldPlaceholder}
                  className="w-full bg-black/40 border border-cyan-500/20 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-700 resize-none outline-none focus:border-cyan-500/50 transition-colors touch-manipulation"
                  style={{ fontFamily: "var(--font-mono)" }}
                />
                <div
                  className="flex items-center justify-between text-xs"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  <span className="text-gray-500">
                    {answer.trim().length} / {flow.scaffoldMinChars}+ ตัวอักษร
                  </span>
                  <span
                    className={
                      writingReady ? "text-green-400" : "text-gray-600"
                    }
                  >
                    {writingReady ? "✓ READY" : "● COMPOSING..."}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={submitWriting}
                  disabled={!writingReady}
                  className={`w-full py-4 text-xs font-bold tracking-widest rounded-xl transition-all min-h-[52px] touch-manipulation ${
                    writingReady
                      ? "btn-neon-pink"
                      : "border border-gray-800 text-gray-700 cursor-not-allowed"
                  }`}
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  ▶ ส่งดีบรีฟปฏิบัติการ
                </button>
              </motion.div>
            )}

            {phase === "input" && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-lg mx-auto space-y-4"
              >
                {flow && flow.band === "mastery" && (
                  <MissionCoachBanner
                    tips={flow.oracleTips}
                    accent={accent}
                  />
                )}

                <div className="glass-card rounded-2xl p-5 border border-cyan-500/25">
                  <p
                    className="text-xs text-cyan-400 tracking-widest mb-3"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    // MISSION_OBJECTIVE
                  </p>
                  <p className="text-base text-white leading-relaxed mb-4">
                    {!flow && mission.description}
                    {flow && flow.band === "mastery" && flow.essayPrompt}
                  </p>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    rows={flow?.band === "mastery" ? 10 : 8}
                    placeholder={
                      flow && flow.band === "mastery"
                        ? flow.essayPlaceholder
                        : "เขียนคำตอบของคุณที่นี่... อธิบายให้ละเอียด ยกตัวอย่าง และเชื่อมโยงกับสิ่งที่คุณรู้"
                    }
                    className="w-full bg-black/40 border border-cyan-500/20 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-700 resize-none outline-none focus:border-cyan-500/50 transition-colors touch-manipulation"
                    style={{ fontFamily: "var(--font-mono)" }}
                  />
                  <div
                    className="flex items-center justify-between mt-2 text-xs"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    <span className="text-gray-500">
                      {answer.trim().length} ตัวอักษร (
                      {flow ? minWritingChars() : 20}+)
                    </span>
                    <span
                      className={
                        writingReady ? "text-green-400" : "text-gray-600"
                      }
                    >
                      {writingReady ? "✓ READY" : "● TYPING..."}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={submitWriting}
                  disabled={!writingReady}
                  className={`w-full py-4 text-xs font-bold tracking-widest rounded-xl transition-all min-h-[52px] touch-manipulation ${
                    writingReady
                      ? "btn-neon-pink"
                      : "border border-gray-800 text-gray-700 cursor-not-allowed"
                  }`}
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  ▶ ส่งให้ระบบประเมิน
                </button>
              </motion.div>
            )}

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
                  // NEURAL_DEBRIEF...
                </p>
                <p className="text-xs text-gray-500">
                  รวมคะแนนการสแกน + ดีบรีฟเป็นสัญญาณเดียว
                </p>
              </motion.div>
            )}

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
                    className="btn-neon-cyan py-3 text-xs font-bold tracking-widest rounded-xl text-center min-h-[48px] flex items-center justify-center touch-manipulation"
                    style={{ fontFamily: "var(--font-orbitron)" }}
                  >
                    🗺 WORLD MAP
                  </Link>
                  <Link
                    href="/dashboard"
                    className="btn-neon-pink py-3 text-xs font-bold tracking-widest rounded-xl text-center min-h-[48px] flex items-center justify-center touch-manipulation"
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
