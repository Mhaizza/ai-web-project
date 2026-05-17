"use client";

import Link from "next/link";
import { useGameStore } from "@/store/gameStore";
import {
  MISSIONS,
  isMissionUnlocked,
  missionsInWorld,
} from "@/lib/missions";
import type { Mission, MissionDifficulty } from "@/lib/types";

// ─── Difficulty palette ────────────────────────────────────────────────────

const DIFF: Record<
  MissionDifficulty,
  { color: string; glow: string; dim: string; label: string }
> = {
  EASY: {
    color: "#4ade80",
    glow: "rgba(74,222,128,0.5)",
    dim: "rgba(74,222,128,0.07)",
    label: "EASY",
  },
  MEDIUM: {
    color: "#facc15",
    glow: "rgba(250,204,21,0.5)",
    dim: "rgba(250,204,21,0.07)",
    label: "MEDIUM",
  },
  HARD: {
    color: "#fb923c",
    glow: "rgba(251,146,60,0.5)",
    dim: "rgba(251,146,60,0.07)",
    label: "HARD",
  },
  BOSS: {
    color: "#ff0080",
    glow: "rgba(255,0,128,0.6)",
    dim: "rgba(255,0,128,0.08)",
    label: "★ BOSS",
  },
};

// ─── Card ──────────────────────────────────────────────────────────────────

function MissionCard({
  mission,
  unlocked,
  completed,
  bossReady,
}: {
  mission: Mission;
  unlocked: boolean;
  completed: boolean;
  bossReady: boolean;
}) {
  const d = DIFF[mission.difficulty];
  const isBoss = mission.difficulty === "BOSS";
  const locked = !unlocked;

  // Boss card is more visually prominent when ready to fight
  const bossActive = isBoss && unlocked && !completed;

  const card = (
    <div
      className={`relative rounded-2xl overflow-hidden transition-all duration-300 group ${
        locked
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:-translate-y-1"
      }`}
      style={{
        background: `linear-gradient(140deg, ${d.dim} 0%, rgba(5,5,16,0.97) 60%)`,
        border: `1px solid ${
          locked ? "rgba(255,255,255,0.07)" : d.color + (bossActive ? "70" : "30")
        }`,
        boxShadow: locked
          ? "none"
          : completed
          ? "0 0 16px rgba(74,222,128,0.1)"
          : bossActive
          ? `0 0 30px ${d.glow}, 0 0 60px ${d.glow}55`
          : isBoss
          ? `0 0 20px ${d.glow}33`
          : `0 0 16px ${d.dim}`,
      }}
    >
      {completed && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(140deg, rgba(74,222,128,0.06) 0%, transparent 50%)",
          }}
        />
      )}

      {bossActive && (
        <>
          <div className="absolute inset-0 scan-line-anim pointer-events-none opacity-50" />
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              background: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${d.color}22 10px, ${d.color}22 11px)`,
            }}
          />
        </>
      )}

      {!locked && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at top left, ${d.dim}, transparent 60%)`,
          }}
        />
      )}

      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center text-2xl relative"
            style={{
              background: completed ? "rgba(74,222,128,0.12)" : d.dim,
              border: `1px solid ${
                completed ? "rgba(74,222,128,0.3)" : d.color + "30"
              }`,
              boxShadow: bossActive ? `0 0 14px ${d.glow}` : "none",
            }}
          >
            {locked ? "🔒" : mission.icon}
            {bossActive && (
              <div
                className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full animate-glow-pulse"
                style={{ background: d.color, boxShadow: `0 0 6px ${d.color}` }}
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[9px] text-white/25 tracking-widest font-mono">
                {mission.code}
              </span>
              <span
                className="text-[9px] px-2 py-0.5 rounded-full border font-bold tracking-widest"
                style={{
                  color: d.color,
                  borderColor: `${d.color}40`,
                  background: `${d.color}12`,
                }}
              >
                {d.label}
              </span>
              {completed && (
                <span
                  className="text-[9px] px-2 py-0.5 rounded-full border font-bold tracking-widest"
                  style={{
                    color: "#4ade80",
                    borderColor: "rgba(74,222,128,0.35)",
                    background: "rgba(74,222,128,0.1)",
                  }}
                >
                  ✓ DONE
                </span>
              )}
              {bossReady && bossActive && (
                <span
                  className="text-[9px] px-2 py-0.5 rounded-full border font-bold tracking-widest animate-glow-pulse"
                  style={{
                    color: d.color,
                    borderColor: `${d.color}80`,
                    background: `${d.color}22`,
                  }}
                >
                  ⚠ READY
                </span>
              )}
            </div>

            <h3
              className="font-black text-sm sm:text-base mb-1.5 tracking-wide"
              style={{
                color: completed
                  ? "rgba(255,255,255,0.3)"
                  : isBoss
                  ? d.color
                  : "#fff",
                textDecoration: completed ? "line-through" : "none",
                textShadow: bossActive ? `0 0 16px ${d.color}88` : "none",
              }}
            >
              {mission.title}
            </h3>

            <p className="text-[11px] text-white/38 mb-3 leading-relaxed">
              {mission.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span style={{ color: "#facc15", fontSize: "13px" }}>⚡</span>
                  <span
                    className="text-[10px] font-black tracking-widest"
                    style={{ color: "#facc15" }}
                  >
                    +{mission.reward.xp} XP
                  </span>
                </div>
                <div
                  className="text-[10px] font-bold tracking-widest"
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  ⚡ {mission.energyCost}
                </div>
              </div>

              {!locked && !completed && (
                <span
                  className="text-[10px] px-3 py-1.5 rounded-xl border font-bold tracking-widest transition-all duration-200 active:scale-95"
                  style={{
                    color: d.color,
                    borderColor: `${d.color}40`,
                    background: `${d.color}10`,
                  }}
                >
                  {bossActive ? "▶ ENTER BATTLE" : "▶ START"}
                </span>
              )}

              {completed && (
                <span
                  className="text-[10px] px-3 py-1.5 rounded-xl border font-bold tracking-widest transition-all duration-200 active:scale-95"
                  style={{
                    color: "#4ade80",
                    borderColor: "rgba(74,222,128,0.3)",
                    background: "rgba(74,222,128,0.08)",
                  }}
                >
                  🔄 REPLAY
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (locked) return card;
  return (
    <Link href={mission.href} className="block">
      {card}
    </Link>
  );
}

// ─── Section ────────────────────────────────────────────────────────────────

export default function MissionsSection() {
  const completedIds = useGameStore((s) => s.completed);
  const hydrated = useGameStore((s) => s.hydrated);

  // For the landing page we showcase World 1 (AI ORIGINS) only — the closing
  // loop the player will see most often. Other worlds are explored via /world.
  const world1 = missionsInWorld("ai-origins");

  // Pre-hydration: show "default" availability so SSR/CSR match without flash.
  const visibleCompleted = hydrated ? completedIds : [];

  // Boss is "ready" the moment all earlier missions in the world are done.
  const boss = world1.find((m) => m.difficulty === "BOSS");
  const bossReady =
    !!boss && isMissionUnlocked(boss, visibleCompleted) && !visibleCompleted.includes(boss.id);

  const totalAvailable = world1.filter((m) =>
    isMissionUnlocked(m, visibleCompleted)
  ).length;
  const totalCompleted = world1.filter((m) =>
    visibleCompleted.includes(m.id)
  ).length;
  const totalLocked = world1.length - totalAvailable;
  const totalMissions = MISSIONS.length;

  return (
    <section className="py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div
            className="text-[9px] tracking-[0.3em] font-bold mb-2 animate-glow-pulse"
            style={{ color: "#ff0080" }}
          >
            // MISSION_BOARD.sys
          </div>
          <h2
            className="text-3xl sm:text-4xl font-black tracking-wider mb-3"
            style={{ color: "#fff", textShadow: "0 0 30px rgba(255,0,128,0.4)" }}
          >
            ACTIVE <span style={{ color: "#ff0080" }}>MISSIONS</span>
          </h2>
          <p className="text-white/35 text-sm mb-4">
            เลือกภารกิจ เรียนรู้ทักษะ AI และสะสม XP เพื่ออัพเลเวลตัวเอง
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span
              className="text-[9px] px-3 py-1 rounded-full font-bold tracking-widest"
              style={{
                color: "#00f5ff",
                background: "rgba(0,245,255,0.1)",
                border: "1px solid rgba(0,245,255,0.25)",
              }}
            >
              {totalAvailable} AVAILABLE
            </span>
            <span
              className="text-[9px] px-3 py-1 rounded-full font-bold tracking-widest"
              style={{
                color: "#4ade80",
                background: "rgba(74,222,128,0.1)",
                border: "1px solid rgba(74,222,128,0.25)",
              }}
            >
              {totalCompleted} COMPLETED
            </span>
            <span
              className="text-[9px] px-3 py-1 rounded-full font-bold tracking-widest"
              style={{
                color: "rgba(255,255,255,0.3)",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {totalLocked} LOCKED
            </span>
          </div>

          {bossReady && (
            <div
              className="mt-6 inline-block px-5 py-3 rounded-2xl border-2 animate-glow-pulse"
              style={{
                borderColor: "rgba(255,0,128,0.6)",
                background:
                  "linear-gradient(135deg, rgba(255,0,128,0.18), rgba(191,0,255,0.08))",
                boxShadow: "0 0 30px rgba(255,0,128,0.4)",
              }}
            >
              <p
                className="text-[10px] tracking-widest font-bold"
                style={{ color: "#ff0080", fontFamily: "var(--font-mono)" }}
              >
                ⚠ BOSS THREAT DETECTED
              </p>
              <p
                className="text-sm font-black text-white mt-0.5"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                ROGUE.AI พร้อมการต่อสู้ — เข้าโจมตีได้แล้ว!
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {world1.map((mission) => {
            const unlocked = isMissionUnlocked(mission, visibleCompleted);
            const done = visibleCompleted.includes(mission.id);
            return (
              <MissionCard
                key={mission.id}
                mission={mission}
                unlocked={unlocked}
                completed={done}
                bossReady={bossReady}
              />
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/world"
            className="inline-block px-8 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all duration-200 active:scale-95"
            style={{
              background: "rgba(0,245,255,0.06)",
              color: "#00f5ff",
              border: "1px solid rgba(0,245,255,0.25)",
            }}
          >
            VIEW ALL {totalMissions} MISSIONS →
          </Link>
        </div>
      </div>
    </section>
  );
}
