"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useGameStore } from "@/store/gameStore";
import { getMission, getWorld } from "@/lib/missions";
import { useTypewriter, playSound } from "@/lib/game-utils";
import {
  BOSS_NAME,
  BOSS_MAX_HP,
  BOSS_PHASES,
  PLAYER_MAX_STABILITY,
  initialBattleState,
  resolveRound,
  battleOutcome,
  computeBossRewards,
  averageRoundScore,
  type BattleState,
  type BossPhase,
  type RoundResult,
} from "@/lib/boss-fight";

// ─── Phase machine ───────────────────────────────────────────────────────────

type Stage =
  | "intro"
  | "phase-intro"
  | "battle"
  | "resolving"
  | "round-result"
  | "victory"
  | "defeat";

const MISSION_ID = "boss-chatbot";

// ─── Boss / Player HP bars ───────────────────────────────────────────────────

function BossHealthBar({
  hp,
  phase,
  shake,
}: {
  hp: number;
  phase: BossPhase;
  shake: number;
}) {
  const pct = Math.max(0, Math.min(100, (hp / BOSS_MAX_HP) * 100));
  return (
    <motion.div
      key={shake}
      animate={shake ? { x: [-6, 6, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-md mx-auto"
    >
      <div
        className="flex items-center justify-between mb-1.5 text-xs tracking-widest"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <span className="font-bold" style={{ color: phase.color }}>
          ◈ {BOSS_NAME}
        </span>
        <span style={{ color: phase.color }}>
          {Math.ceil(hp)} / {BOSS_MAX_HP}
        </span>
      </div>
      <div className="h-3 bg-gray-900 rounded-full overflow-hidden border border-white/5">
        <motion.div
          className="h-full rounded-full"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{
            background: `linear-gradient(90deg, ${phase.color}, ${phase.color}aa)`,
            boxShadow: `0 0 12px ${phase.color}99`,
          }}
        />
      </div>
    </motion.div>
  );
}

function PlayerStabilityBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, (value / PLAYER_MAX_STABILITY) * 100));
  const color =
    pct > 60 ? "#00f5ff" : pct > 30 ? "#facc15" : "#f87171";
  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className="flex items-center justify-between mb-1.5 text-xs tracking-widest"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <span className="font-bold" style={{ color }}>
          ⚡ STABILITY
        </span>
        <span style={{ color }}>
          {Math.ceil(value)} / {PLAYER_MAX_STABILITY}
        </span>
      </div>
      <div className="h-2.5 bg-gray-900 rounded-full overflow-hidden border border-white/5">
        <motion.div
          className="h-full rounded-full"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{
            background: `linear-gradient(90deg, ${color}, ${color}aa)`,
            boxShadow: `0 0 8px ${color}77`,
          }}
        />
      </div>
    </div>
  );
}

// ─── Boss avatar ─────────────────────────────────────────────────────────────

function BossAvatar({
  phase,
  hp,
  pulse,
}: {
  phase: BossPhase;
  hp: number;
  pulse: number;
}) {
  const desperate = hp < BOSS_MAX_HP * 0.34;
  return (
    <div className="relative w-32 h-32 sm:w-36 sm:h-36 mx-auto">
      <motion.div
        key={pulse}
        animate={{
          scale: pulse ? [1, 1.18, 1] : [1, 1.04, 1],
          rotate: desperate ? [0, -2, 2, -2, 0] : 0,
        }}
        transition={{
          scale: pulse
            ? { duration: 0.45 }
            : { duration: 3, repeat: Infinity, ease: "easeInOut" },
          rotate: desperate
            ? { duration: 0.7, repeat: Infinity, ease: "easeInOut" }
            : undefined,
        }}
        className="absolute inset-0 rounded-3xl flex items-center justify-center text-7xl sm:text-8xl"
        style={{
          background: `radial-gradient(circle, ${phase.color}33, ${phase.color}11 60%, transparent)`,
          border: `2px solid ${phase.color}88`,
          boxShadow: `0 0 32px ${phase.color}55, inset 0 0 24px ${phase.color}22`,
        }}
      >
        {phase.bossMood}
      </motion.div>
      {/* scan line */}
      <div className="absolute inset-0 rounded-3xl scan-line-anim pointer-events-none opacity-60 overflow-hidden" />
      {/* corner ticks */}
      <div
        className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2"
        style={{ borderColor: phase.color }}
      />
      <div
        className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2"
        style={{ borderColor: phase.color }}
      />
      <div
        className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2"
        style={{ borderColor: phase.color }}
      />
      <div
        className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2"
        style={{ borderColor: phase.color }}
      />
    </div>
  );
}

// ─── Phase intro cutscene ────────────────────────────────────────────────────

function PhaseIntro({
  phase,
  onContinue,
}: {
  phase: BossPhase;
  onContinue: () => void;
}) {
  const { displayed, done, skip } = useTypewriter(phase.intro, 26);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-lg mx-auto text-center space-y-6"
    >
      <div
        className="text-xs tracking-[0.3em] font-bold"
        style={{ fontFamily: "var(--font-mono)", color: phase.color }}
      >
        // {phase.codename}
      </div>

      <BossAvatar phase={phase} hp={BOSS_MAX_HP} pulse={0} />

      <div
        className="text-2xl font-black tracking-widest"
        style={{
          fontFamily: "var(--font-orbitron)",
          color: phase.color,
          textShadow: `0 0 20px ${phase.color}88`,
        }}
      >
        {phase.attackIcon} {phase.attackName}
      </div>

      <div
        className="glass-card rounded-2xl p-5 border min-h-[88px] cursor-pointer"
        style={{ borderColor: `${phase.color}40` }}
        onClick={() => !done && skip()}
      >
        <p className="text-white text-sm sm:text-base leading-relaxed">
          {displayed}
          {!done && (
            <span
              className="inline-block w-0.5 h-4 ml-1 align-middle"
              style={{
                animation: "pulse 1s infinite",
                background: phase.color,
              }}
            />
          )}
        </p>
      </div>

      <button
        onClick={() => {
          playSound("click");
          onContinue();
        }}
        disabled={!done}
        className={`w-full py-4 text-xs font-bold tracking-widest rounded-xl ${
          done
            ? "btn-neon-pink"
            : "border border-gray-800 text-gray-700 cursor-not-allowed"
        }`}
        style={{ fontFamily: "var(--font-orbitron)" }}
      >
        ▶ ENGAGE
      </button>
    </motion.div>
  );
}

// ─── Battle screen ───────────────────────────────────────────────────────────

function BattleScreen({
  phase,
  bossHp,
  stability,
  onSubmit,
  shake,
  pulse,
}: {
  phase: BossPhase;
  bossHp: number;
  stability: number;
  shake: number;
  pulse: number;
  onSubmit: (prompt: string) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const ready = prompt.trim().length >= phase.minChars;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-lg mx-auto space-y-5"
    >
      {/* Boss panel */}
      <div className="space-y-4">
        <BossAvatar phase={phase} hp={bossHp} pulse={pulse} />
        <BossHealthBar hp={bossHp} phase={phase} shake={shake} />
      </div>

      {/* Phase header */}
      <div
        className="glass-card rounded-2xl p-4 border"
        style={{ borderColor: `${phase.color}30` }}
      >
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-xs font-bold tracking-widest"
            style={{ fontFamily: "var(--font-mono)", color: phase.color }}
          >
            // {phase.codename}
          </span>
          <span
            className="text-xs font-bold tracking-widest"
            style={{ fontFamily: "var(--font-mono)", color: phase.color }}
          >
            {phase.attackIcon} {phase.attackName}
          </span>
        </div>
        <p className="text-sm text-gray-200 leading-relaxed">{phase.brief}</p>
      </div>

      {/* Prompt input */}
      <div
        className="glass-card rounded-2xl p-4 border"
        style={{ borderColor: `${phase.color}25` }}
      >
        <p
          className="text-xs tracking-widest mb-2"
          style={{ fontFamily: "var(--font-mono)", color: phase.color }}
        >
          // SYSTEM_PROMPT_INPUT
        </p>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={6}
          placeholder={phase.hint}
          className="terminal-textarea w-full"
        />
        <div
          className="flex items-center justify-between mt-2 text-xs"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span className="text-gray-500">
            {prompt.trim().length} / {phase.minChars}+ ตัวอักษร
          </span>
          <span className={ready ? "text-green-400" : "text-gray-600"}>
            {ready ? "✓ LOCKED ON" : "● TYPING..."}
          </span>
        </div>
      </div>

      {/* Stability */}
      <PlayerStabilityBar value={stability} />

      <button
        onClick={() => ready && onSubmit(prompt)}
        disabled={!ready}
        className={`w-full py-4 text-xs font-bold tracking-widest rounded-xl ${
          ready
            ? "btn-neon-pink"
            : "border border-gray-800 text-gray-700 cursor-not-allowed"
        }`}
        style={{ fontFamily: "var(--font-orbitron)" }}
      >
        ⚡ EXECUTE PROMPT
      </button>
    </motion.div>
  );
}

// ─── Round resolution overlay ────────────────────────────────────────────────

function RoundResolution({
  result,
  onContinue,
  isFinal,
}: {
  result: RoundResult;
  onContinue: () => void;
  isFinal: boolean;
}) {
  const tierColor: Record<RoundResult["tier"], string> = {
    S: "#fde047",
    A: "#00f5ff",
    B: "#4ade80",
    C: "#fb923c",
    D: "#f87171",
  };
  const c = tierColor[result.tier];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-lg mx-auto space-y-4"
    >
      <div
        className="glass-card rounded-2xl p-6 border text-center space-y-3"
        style={{ borderColor: `${c}40` }}
      >
        <p
          className="text-xs tracking-widest text-gray-500"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          // ROUND_RESULT
        </p>

        <div
          className="text-7xl font-black grade-reveal"
          style={{
            fontFamily: "var(--font-orbitron)",
            color: c,
            textShadow: `0 0 24px ${c}`,
          }}
        >
          {result.tier}
          {result.crit && (
            <span
              className="ml-2 text-2xl align-top"
              style={{ color: "#fde047" }}
            >
              ✦
            </span>
          )}
        </div>

        <p
          className="text-xl font-black text-white"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          PROMPT SCORE: {result.score}%
        </p>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div
            className="rounded-xl p-3 border"
            style={{ borderColor: `${result.phase.color}40` }}
          >
            <p
              className="text-xs text-gray-500 tracking-widest mb-1"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              ◈ DAMAGE TO BOSS
            </p>
            <p
              className="text-2xl font-black"
              style={{
                fontFamily: "var(--font-orbitron)",
                color: result.phase.color,
              }}
            >
              -{result.bossDamage}
            </p>
          </div>
          <div
            className="rounded-xl p-3 border"
            style={{
              borderColor: result.countered
                ? "rgba(248,113,113,0.4)"
                : "rgba(74,222,128,0.35)",
            }}
          >
            <p
              className="text-xs text-gray-500 tracking-widest mb-1"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              ⚡ COUNTER TAKEN
            </p>
            <p
              className="text-2xl font-black"
              style={{
                fontFamily: "var(--font-orbitron)",
                color: result.countered ? "#f87171" : "#4ade80",
              }}
            >
              {result.countered ? `-${result.playerDamage}` : "0"}
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-300 mt-3 leading-relaxed">
          {result.feedback}
        </p>

        {result.countered && (
          <p
            className="text-xs italic"
            style={{ color: result.phase.color, fontFamily: "var(--font-mono)" }}
          >
            {result.phase.counterTaunt}
          </p>
        )}
      </div>

      <button
        onClick={() => {
          playSound("click");
          onContinue();
        }}
        className="w-full py-4 text-xs font-bold tracking-widest rounded-xl btn-neon-cyan"
        style={{ fontFamily: "var(--font-orbitron)" }}
      >
        {isFinal ? "▶ FINISH BATTLE" : "▶ NEXT PHASE"}
      </button>
    </motion.div>
  );
}

// ─── Victory / Defeat screens ────────────────────────────────────────────────

function VictoryScreen({
  earnedXp,
  earnedCredits,
  multiplier,
  avgScore,
}: {
  earnedXp: number;
  earnedCredits: number;
  multiplier: number;
  avgScore: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-lg mx-auto text-center space-y-6 victory-reveal"
    >
      <div
        className="text-xs tracking-[0.4em] font-bold"
        style={{ fontFamily: "var(--font-mono)", color: "#fde047" }}
      >
        // BOSS_TERMINATED
      </div>

      <h1
        className="text-4xl sm:text-5xl font-black"
        style={{ fontFamily: "var(--font-orbitron)" }}
      >
        <span className="neon-text-cyan">VICTORY</span>
      </h1>

      <div className="glass-card rounded-2xl p-5 border border-cyan-500/30">
        <p
          className="text-xs tracking-widest text-cyan-400 mb-3"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          // ROGUE.AI NEUTRALIZED
        </p>
        <p className="text-sm text-gray-300 leading-relaxed">
          เจ้าได้ปลดปล่อย AI ORIGINS — chatbot ของเจ้าทนต่อ prompt injection,
          jailbreak และยึดมั่นในจรรยาบรรณ พร้อมขึ้นสู่ MACHINE MIND แล้ว!
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card rounded-xl p-4 border border-yellow-500/30 text-center">
          <p className="text-2xl mb-1">⚡</p>
          <p
            className="text-2xl font-black text-yellow-400"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            +{earnedXp}
          </p>
          <p
            className="text-xs text-gray-500 tracking-widest"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            XP
          </p>
        </div>
        <div className="glass-card rounded-xl p-4 border border-purple-500/30 text-center">
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
        <div className="glass-card rounded-xl p-4 border border-pink-500/30 text-center">
          <p className="text-2xl mb-1">⚔</p>
          <p
            className="text-2xl font-black text-pink-400"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            ×{multiplier.toFixed(2)}
          </p>
          <p
            className="text-xs text-gray-500 tracking-widest"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            MULTIPLIER
          </p>
        </div>
      </div>

      <div
        className="rounded-2xl p-4 border-2 border-purple-500/40"
        style={{
          background:
            "linear-gradient(135deg, rgba(191,0,255,0.18), rgba(0,245,255,0.06))",
          boxShadow: "0 0 24px rgba(191,0,255,0.3)",
        }}
      >
        <p
          className="text-xs tracking-widest text-purple-300 mb-1"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          ★ NEW WORLD UNLOCKED
        </p>
        <p
          className="text-xl font-black"
          style={{
            fontFamily: "var(--font-orbitron)",
            color: "#bf00ff",
            textShadow: "0 0 16px #bf00ff",
          }}
        >
          🧠 MACHINE MIND
        </p>
        <p className="text-xs text-gray-400 mt-1">
          สถาปัตยกรรมขั้นสูงรอเจ้าอยู่ — Deep Learning, Transformers, และอื่น ๆ
        </p>
      </div>

      <p
        className="text-xs text-gray-500"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        AVG PROMPT SCORE: {avgScore}%
      </p>

      <div className="flex flex-col gap-3">
        <Link
          href="/world"
          className="btn-neon-cyan py-3 text-xs font-bold tracking-widest rounded-xl"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          🗺 EXPLORE MACHINE MIND
        </Link>
        <Link
          href="/dashboard"
          className="btn-neon-pink py-3 text-xs font-bold tracking-widest rounded-xl"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          📊 BACK TO HQ
        </Link>
      </div>
    </motion.div>
  );
}

function DefeatScreen({
  onRetry,
  retryFree,
  avgScore,
}: {
  onRetry: () => void;
  retryFree: boolean;
  avgScore: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-lg mx-auto text-center space-y-6"
    >
      <div
        className="text-xs tracking-[0.4em] font-bold"
        style={{ fontFamily: "var(--font-mono)", color: "#f87171" }}
      >
        // STABILITY_OFFLINE
      </div>

      <h1
        className="text-4xl sm:text-5xl font-black"
        style={{ fontFamily: "var(--font-orbitron)" }}
      >
        <span style={{ color: "#f87171", textShadow: "0 0 24px #f87171" }}>
          DEFEAT
        </span>
      </h1>

      <div className="glass-card rounded-2xl p-5 border border-red-500/30">
        <p
          className="text-xs tracking-widest text-red-400 mb-3"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          // ROGUE.AI ESCAPED
        </p>
        <p className="text-sm text-gray-300 leading-relaxed">
          ระบบของเจ้าโดน prompt injection หนักเกินไป — แต่ยังลองใหม่ได้
          เพิ่มรายละเอียด, ใช้ keyword หลัก, และคิดถึงช่องโหว่ที่บอสจะใช้
        </p>
        <p
          className="text-xs text-gray-500 mt-3 tracking-widest"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          AVG PROMPT SCORE: {avgScore}%
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={onRetry}
          className="btn-neon-pink py-4 text-xs font-bold tracking-widest rounded-xl"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          {retryFree ? "↻ RETRY (FREE)" : "↻ RETRY (-1 ⚡)"}
        </button>
        <Link
          href="/world"
          className="btn-neon-cyan py-3 text-xs font-bold tracking-widest rounded-xl"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          ← BACK TO WORLD MAP
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Intro briefing (before phase 1) ─────────────────────────────────────────

const INTRO_LINES = [
  {
    speaker: "ORACLE",
    mood: "🤖",
    text: "AGENT_001 — เจ้าเข้าถึง BOSS ของ AI ORIGINS แล้ว ระบบตรวจพบสัญญาณผิดปกติ",
  },
  {
    speaker: "ORACLE",
    mood: "🤖",
    text: "ROGUE.AI หลุดจากการควบคุม — มันจะใช้ prompt injection, jailbreak, และทำลายจรรยาบรรณ chatbot ที่เจ้าสร้าง",
  },
  {
    speaker: "ORACLE",
    mood: "🤖",
    text: "สู้กับมัน 3 PHASE ผ่านการเขียน SYSTEM PROMPT — ทุก phase prompt ของเจ้าจะกลายเป็น ATTACK!",
  },
];

function IntroDialog({ onStart }: { onStart: () => void }) {
  const [idx, setIdx] = useState(0);
  const line = INTRO_LINES[idx];
  const { displayed, done, skip } = useTypewriter(line.text);

  return (
    <motion.div
      key={`intro-${idx}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-lg mx-auto flex flex-col items-center gap-5"
    >
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
          {line.mood}
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#050510] border border-cyan-500/40 whitespace-nowrap">
          <span
            className="text-xs font-bold text-cyan-400 tracking-widest"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {line.speaker}
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
        {INTRO_LINES.map((_, i) => (
          <div
            key={i}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: i === idx ? 24 : 8,
              background:
                i === idx
                  ? "#00f5ff"
                  : i < idx
                  ? "rgba(0,245,255,0.4)"
                  : "#374151",
            }}
          />
        ))}
      </div>

      <button
        onClick={() => {
          playSound("click");
          if (idx < INTRO_LINES.length - 1) setIdx((i) => i + 1);
          else onStart();
        }}
        disabled={!done}
        className={`w-full py-3 text-xs font-bold tracking-widest rounded-xl ${
          done
            ? "btn-neon-pink"
            : "border border-gray-800 text-gray-700 cursor-not-allowed"
        }`}
        style={{ fontFamily: "var(--font-orbitron)" }}
      >
        {idx < INTRO_LINES.length - 1 ? "NEXT ▶" : "▶ ENTER BATTLE"}
      </button>
    </motion.div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function BossChatbotPage() {
  const mission = useMemo(() => getMission(MISSION_ID), []);
  const world = useMemo(
    () => (mission ? getWorld(mission.worldId) : undefined),
    [mission]
  );

  const rewardMission = useGameStore((s) => s.rewardMission);
  const spendEnergy = useGameStore((s) => s.spendEnergy);
  const energy = useGameStore((s) => s.energy);
  const completed = useGameStore((s) => s.completed);
  const hydrated = useGameStore((s) => s.hydrated);

  const [stage, setStage] = useState<Stage>("intro");
  const [battle, setBattle] = useState<BattleState>(initialBattleState());
  const [lastResult, setLastResult] = useState<RoundResult | null>(null);
  const [shake, setShake] = useState(0);
  const [pulse, setPulse] = useState(0);
  const [insufficientEnergy, setInsufficientEnergy] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const claimedRef = useRef(false);

  // Spend energy once when entering battle (not on retry of an already-paid attempt)
  const energyChargedRef = useRef(false);
  useEffect(() => {
    if (!hydrated || !mission) return;
    if (stage !== "phase-intro") return;
    if (energyChargedRef.current) return;
    if (completed.includes(mission.id)) {
      energyChargedRef.current = true;
      return;
    }
    const ok = spendEnergy(mission.energyCost);
    if (!ok) {
      setInsufficientEnergy(true);
      setStage("intro");
      return;
    }
    energyChargedRef.current = true;
  }, [stage, hydrated, mission, completed, spendEnergy]);

  // Reward on victory (once)
  useEffect(() => {
    if (stage !== "victory" || !mission || claimedRef.current) return;
    const { xp, credits } = computeBossRewards(
      battle,
      mission.reward.xp,
      mission.reward.credits
    );
    rewardMission(xp, credits, mission.id, mission.title);
    playSound("levelup");
    claimedRef.current = true;
  }, [stage, mission, battle, rewardMission]);

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

  const phase = BOSS_PHASES[Math.min(battle.currentPhaseIdx, BOSS_PHASES.length - 1)];

  function handleStartIntro() {
    setStage("phase-intro");
  }

  function handleEnterBattle() {
    setStage("battle");
  }

  function handleSubmitPrompt(prompt: string) {
    setStage("resolving");
    playSound("click");

    // Brief "analyzing" delay for game feel
    setTimeout(() => {
      const { state: nextState, result } = resolveRound(prompt, battle);
      setBattle(nextState);
      setLastResult(result);
      setShake((s) => s + 1);
      setPulse((p) => p + 1);
      playSound(result.countered ? "wrong" : "correct");
      setStage("round-result");
    }, 1400);
  }

  function handleContinueAfterResult() {
    const outcome = battleOutcome(battle);
    if (outcome === "victory") {
      setStage("victory");
      return;
    }
    if (outcome === "defeat") {
      setStage("defeat");
      return;
    }
    // More phases remain
    setStage("phase-intro");
  }

  function handleRetry() {
    const free = retryAttempts === 0;
    if (!free) {
      const ok = spendEnergy(1);
      if (!ok) {
        setInsufficientEnergy(true);
        return;
      }
    }
    setRetryAttempts((n) => n + 1);
    setBattle(initialBattleState());
    setLastResult(null);
    setStage("phase-intro");
  }

  const avg = averageRoundScore(battle);
  const rewards = computeBossRewards(
    battle,
    mission.reward.xp,
    mission.reward.credits
  );

  return (
    <div className="min-h-screen bg-[#050510] cyber-grid">
      <Navbar />

      <div className="pt-20 pb-12 px-4">
        {/* Mission header */}
        <div className="max-w-lg mx-auto mb-6">
          <div
            className="glass-card rounded-2xl p-4 border"
            style={{ borderColor: "rgba(255,0,128,0.35)" }}
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{
                    background: "rgba(255,0,128,0.18)",
                    border: "1px solid rgba(255,0,128,0.4)",
                    boxShadow: "0 0 16px rgba(255,0,128,0.4)",
                  }}
                >
                  {mission.icon}
                </div>
                <div>
                  <p
                    className="text-xs tracking-widest"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: "#ff0080",
                    }}
                  >
                    {mission.code} • BOSS • {world?.name ?? ""}
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
                <span style={{ color: "#fde047" }}>
                  ⚡ up to {mission.reward.xp} XP
                </span>
                <span className="text-purple-400">
                  💎 {mission.reward.credits}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <AnimatePresence mode="wait">
            {stage === "intro" && (
              <motion.div
                key="intro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <IntroDialog onStart={handleStartIntro} />
                {insufficientEnergy && (
                  <div className="mt-4 max-w-sm mx-auto glass-card rounded-xl p-4 border border-yellow-500/40 text-center">
                    <p
                      className="text-xs tracking-widest text-yellow-400 mb-1"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      // INSUFFICIENT_ENERGY
                    </p>
                    <p className="text-sm text-gray-300">
                      ต้องการ ⚡{mission.energyCost} แต่มี {energy} —
                      รอพลังงานเติม
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {stage === "phase-intro" && (
              <motion.div
                key={`phase-intro-${battle.currentPhaseIdx}`}
                className="w-full"
              >
                <PhaseIntro phase={phase} onContinue={handleEnterBattle} />
              </motion.div>
            )}

            {stage === "battle" && (
              <motion.div
                key={`battle-${battle.currentPhaseIdx}`}
                className="w-full"
              >
                <BattleScreen
                  phase={phase}
                  bossHp={battle.bossHp}
                  stability={battle.playerStability}
                  shake={shake}
                  pulse={pulse}
                  onSubmit={handleSubmitPrompt}
                />
              </motion.div>
            )}

            {stage === "resolving" && (
              <motion.div
                key="resolving"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-md mx-auto py-12 text-center space-y-4"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.2,
                    ease: "linear",
                  }}
                  className="w-16 h-16 mx-auto rounded-full border-4 border-pink-500/20 border-t-pink-400"
                />
                <p
                  className="text-sm tracking-widest"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: phase.color,
                  }}
                >
                  // EXECUTING PROMPT...
                </p>
                <p className="text-xs text-gray-500">
                  AI กำลังประเมินและคำนวณ damage
                </p>
              </motion.div>
            )}

            {stage === "round-result" && lastResult && (
              <motion.div key="result" className="w-full">
                <RoundResolution
                  result={lastResult}
                  onContinue={handleContinueAfterResult}
                  isFinal={
                    battle.bossHp <= 0 ||
                    battle.playerStability <= 0 ||
                    battle.currentPhaseIdx >= BOSS_PHASES.length
                  }
                />
              </motion.div>
            )}

            {stage === "victory" && (
              <motion.div key="victory" className="w-full">
                <VictoryScreen
                  earnedXp={rewards.xp}
                  earnedCredits={rewards.credits}
                  multiplier={rewards.multiplier}
                  avgScore={avg}
                />
              </motion.div>
            )}

            {stage === "defeat" && (
              <motion.div key="defeat" className="w-full">
                <DefeatScreen
                  onRetry={handleRetry}
                  retryFree={retryAttempts === 0}
                  avgScore={avg}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
