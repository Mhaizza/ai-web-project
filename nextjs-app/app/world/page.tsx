"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useGameStore } from "@/store/gameStore";
import {
  WORLDS,
  missionsInWorld,
  isMissionUnlocked,
  isWorldUnlocked,
} from "@/lib/missions";
import { levelForXp } from "@/lib/level";
import type { World, Mission } from "@/lib/types";

const DIFF_COLOR: Record<Mission["difficulty"], string> = {
  EASY: "#4ade80",
  MEDIUM: "#facc15",
  HARD: "#fb923c",
  BOSS: "#ff0080",
};

function WorldCard({
  world,
  playerLevel,
  completedIds,
}: {
  world: World;
  playerLevel: number;
  completedIds: string[];
}) {
  const missions = missionsInWorld(world.id);
  const completedCount = missions.filter((m) =>
    completedIds.includes(m.id)
  ).length;
  const worldUnlocked = isWorldUnlocked(world, playerLevel, completedIds);
  const unlockedByBoss =
    worldUnlocked && playerLevel < world.unlockLevel;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-3xl overflow-hidden"
      style={{
        background: `linear-gradient(140deg, ${world.color}15, rgba(5,5,16,0.95) 60%)`,
        border: `1px solid ${worldUnlocked ? world.color + "55" : "#374151"}`,
        boxShadow: worldUnlocked ? `0 0 30px ${world.color}22` : "none",
        opacity: worldUnlocked ? 1 : 0.55,
      }}
    >
      {/* Top header */}
      <div
        className="px-5 py-4 flex items-center gap-4 border-b"
        style={{ borderColor: `${world.color}22` }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
          style={{
            background: `radial-gradient(circle, ${world.color}30, transparent)`,
            border: `2px solid ${world.color}55`,
            boxShadow: `0 0 18px ${world.color}40`,
          }}
        >
          {worldUnlocked ? world.icon : "🔒"}
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="text-xs tracking-widest mb-0.5"
            style={{ color: world.color, fontFamily: "var(--font-mono)" }}
          >
            // WORLD_ZONE
          </div>
          <h3
            className="text-lg sm:text-xl font-black text-white truncate"
            style={{
              fontFamily: "var(--font-orbitron)",
              textShadow: `0 0 12px ${world.color}77`,
            }}
          >
            {world.name}
          </h3>
          <p className="text-xs text-gray-400 italic truncate">
            &ldquo;{world.tagline}&rdquo;
          </p>
        </div>
        <div className="text-right shrink-0">
          <div
            className="text-xs text-gray-500 tracking-widest"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            PROGRESS
          </div>
          <div
            className="text-base font-black"
            style={{ color: world.color, fontFamily: "var(--font-orbitron)" }}
          >
            {completedCount}/{missions.length}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-5 py-3 border-b border-gray-800/50">
        <p className="text-sm text-gray-300 leading-relaxed">
          {world.description}
        </p>
        {!worldUnlocked && (
          <p
            className="mt-2 text-xs tracking-widest text-yellow-400"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            🔒 UNLOCKS AT LVL {world.unlockLevel}
            {world.id === "machine-mind" && (
              <span className="block mt-0.5 text-pink-400/80">
                หรือเอาชนะ BOSS-01 ROGUE.AI ใน AI ORIGINS
              </span>
            )}
          </p>
        )}
        {unlockedByBoss && (
          <p
            className="mt-2 text-xs tracking-widest text-pink-400"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            ★ UNLOCKED VIA BOSS VICTORY
          </p>
        )}
      </div>

      {/* Mission list */}
      <div className="p-4 space-y-2">
        {missions.map((m) => {
          const done = completedIds.includes(m.id);
          const unlocked = worldUnlocked && isMissionUnlocked(m, completedIds);
          const diffColor = DIFF_COLOR[m.difficulty];

          const Inner = (
            <div
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                !unlocked
                  ? "border-gray-800/40 bg-gray-900/30 cursor-not-allowed"
                  : done
                  ? "border-green-500/25 bg-green-500/5"
                  : "border-cyan-500/20 bg-[#0a0a1a]/60 hover:border-cyan-500/50 hover:bg-[#0d0d22]/80"
              }`}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
                style={{
                  background: !unlocked ? "#1f2937" : `${diffColor}18`,
                  border: `1px solid ${
                    !unlocked ? "#374151" : diffColor + "55"
                  }`,
                }}
              >
                {!unlocked ? "🔒" : done ? "✅" : m.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span
                    className={`text-xs font-bold ${
                      done ? "text-gray-400 line-through" : "text-white"
                    } truncate`}
                    style={{ fontFamily: "var(--font-orbitron)" }}
                  >
                    {m.code} · {m.title}
                  </span>
                  <span
                    className="text-xs tracking-widest"
                    style={{ color: diffColor, fontFamily: "var(--font-mono)" }}
                  >
                    [{m.difficulty}]
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate">{m.description}</p>
              </div>
              <div className="text-right shrink-0">
                <div
                  className="text-xs text-yellow-400 font-bold"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  +{m.reward.xp} XP
                </div>
                <div
                  className="text-xs text-yellow-500 mt-0.5"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  ⚡ {m.energyCost}
                </div>
              </div>
              {unlocked && !done && (
                <span className="text-cyan-400 text-sm shrink-0">→</span>
              )}
            </div>
          );

          return unlocked ? (
            <Link key={m.id} href={m.href}>
              {Inner}
            </Link>
          ) : (
            <div key={m.id}>{Inner}</div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default function WorldPage() {
  const xp = useGameStore((s) => s.xp);
  const completedIds = useGameStore((s) => s.completed);
  const hydrated = useGameStore((s) => s.hydrated);

  const playerLevel = hydrated ? levelForXp(xp) : 1;

  return (
    <div className="min-h-screen bg-[#050510] cyber-grid">
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="text-xs tracking-[0.3em] font-bold mb-2 neon-text-cyan"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              // NEURAL_NETWORK_MAP
            </div>
            <h1
              className="text-3xl sm:text-5xl font-black tracking-wider mb-3 text-white"
              style={{
                fontFamily: "var(--font-orbitron)",
                textShadow: "0 0 30px rgba(0, 245, 255, 0.5)",
              }}
            >
              WORLD <span className="neon-text-pink">MAP</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto">
              เลือกเขตที่จะเข้าโจมตี — ปลดล็อกโลกใหม่ด้วยการเลเวลอัพและพิชิตภารกิจ
            </p>
          </div>

          {/* Player summary strip */}
          <div className="glass-card rounded-2xl p-4 mb-6 flex items-center justify-around gap-4 flex-wrap border border-cyan-500/20">
            <div className="text-center">
              <div
                className="text-xs text-gray-500 tracking-widest"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                CURRENT LEVEL
              </div>
              <div
                className="text-2xl font-black text-cyan-400"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                {hydrated ? playerLevel : "—"}
              </div>
            </div>
            <div className="text-center">
              <div
                className="text-xs text-gray-500 tracking-widest"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                MISSIONS DONE
              </div>
              <div
                className="text-2xl font-black text-pink-400"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                {hydrated ? completedIds.length : "—"}
              </div>
            </div>
            <div className="text-center">
              <div
                className="text-xs text-gray-500 tracking-widest"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                WORLDS UNLOCKED
              </div>
              <div
                className="text-2xl font-black text-purple-400"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                {hydrated
                  ? WORLDS.filter((w) =>
                      isWorldUnlocked(w, playerLevel, completedIds)
                    ).length
                  : "—"}
                /{WORLDS.length}
              </div>
            </div>
          </div>

          {/* World cards */}
          <div className="space-y-6">
            {WORLDS.map((w) => (
              <WorldCard
                key={w.id}
                world={w}
                playerLevel={playerLevel}
                completedIds={completedIds}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-cyan-500/10 py-6 px-4 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div
            className="text-sm font-black tracking-widest"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            <span className="neon-text-cyan">NEURAL</span>
            <span className="neon-text-pink">QUEST</span>
          </div>
          <p
            className="text-xs text-gray-600 tracking-widest"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            © 2077 NEURALQUEST SYSTEMS — WORLD MAP v0.2.0
          </p>
        </div>
      </footer>
    </div>
  );
}
