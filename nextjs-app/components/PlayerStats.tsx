"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// ─── Data ─────────────────────────────────────────────────────────────────────

const ACTIVE_HERO = {
  avatar: "🧙‍♂️",
  name: "PROMPT MAGE",
  title: "Weaver of Words",
  color: "#00f5ff",
  glowColor: "rgba(0,245,255,0.5)",
  faction: "FREE AI COLLECTIVE",
  factionIcon: "⚡",
  factionColor: "#00f5ff",
  rarity: "Epic",
};

const SKILLS = [
  { name: "PROMPT ENGINEERING", level: 4, xp: 80, color: "#00f5ff" },
  { name: "MACHINE LEARNING", level: 3, xp: 60, color: "#bf00ff" },
  { name: "DATA SCIENCE", level: 2, xp: 40, color: "#00ff88" },
  { name: "NEURAL NETWORKS", level: 1, xp: 20, color: "#ff0080" },
];

const ACHIEVEMENTS = [
  { icon: "🏆", value: "12", label: "MISSIONS DONE" },
  { icon: "🔥", value: "5", label: "DAY STREAK" },
  { icon: "💎", value: "340", label: "CREDITS" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ text, color }: { text: string; color: string }) {
  return (
    <div
      className="text-[9px] font-bold tracking-[0.22em] mb-3 flex items-center gap-2"
      style={{ color }}
    >
      <span className="inline-block w-4 h-px" style={{ background: color }} />
      {text}
      <span className="flex-1 h-px opacity-20" style={{ background: color }} />
    </div>
  );
}

function XPBar({ xp, maxXp, color }: { xp: number; maxXp: number; color: string }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth((xp / maxXp) * 100);
    }, 300);
    return () => clearTimeout(timer);
  }, [xp, maxXp, color]);

  return (
    <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
      <div
        className="h-full rounded-full transition-all duration-1000"
        style={{
          width: `${width}%`,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          boxShadow: `0 0 8px ${color}`,
        }}
      />
    </div>
  );
}

function SkillBar({ name, level, xp, color }: { name: string; level: number; xp: number; color: string }) {
  const [barWidth, setBarWidth] = useState(0);
  const MAX = 5;

  useEffect(() => {
    const t = setTimeout(() => setBarWidth(xp), 400);
    return () => clearTimeout(t);
  }, [xp]);

  return (
    <div className="flex items-center gap-3">
      <span
        className="text-[9px] font-bold tracking-widest shrink-0 w-36"
        style={{ color }}
      >
        {name}
      </span>
      {/* Segment bars */}
      <div className="flex gap-1 flex-1">
        {Array.from({ length: MAX }).map((_, i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-sm transition-all duration-500"
            style={{
              background: i < level ? color : "rgba(255,255,255,0.06)",
              boxShadow: i < level ? `0 0 4px ${color}` : "none",
              transitionDelay: `${i * 70}ms`,
            }}
          />
        ))}
      </div>
      <span className="text-[9px] font-mono w-8 text-right" style={{ color: `${color}99` }}>
        {level}/{MAX}
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PlayerStats() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Section header */}
        <div className="text-center mb-10">
          <div
            className="text-[9px] tracking-[0.3em] font-bold mb-2 animate-glow-pulse"
            style={{ color: "#00f5ff" }}
          >
            // PLAYER_PROFILE.sys
          </div>
          <h2
            className="text-3xl sm:text-4xl font-black tracking-wider mb-3"
            style={{ color: "#fff", textShadow: "0 0 30px rgba(0,245,255,0.5)" }}
          >
            YOUR <span style={{ color: "#00f5ff" }}>STATS</span>
          </h2>
          <p className="text-white/35 text-sm">
            ติดตามความก้าวหน้า เก็บ XP และอัพเลเวลทักษะ AI ของคุณ
          </p>
        </div>

        {/* Player card */}
        <div
          className="rounded-2xl overflow-hidden relative"
          style={{
            background: "linear-gradient(140deg, rgba(0,245,255,0.08) 0%, rgba(5,5,16,0.97) 55%)",
            border: "1px solid rgba(0,245,255,0.25)",
            boxShadow: "0 0 40px rgba(0,245,255,0.08)",
          }}
        >
          {/* Scan line */}
          <div className="absolute inset-0 scan-line-anim pointer-events-none" />

          {/* Corner accents */}
          <div
            className="absolute top-0 left-0 w-8 h-8 pointer-events-none"
            style={{ borderTop: "2px solid rgba(0,245,255,0.4)", borderLeft: "2px solid rgba(0,245,255,0.4)" }}
          />
          <div
            className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none"
            style={{ borderBottom: "2px solid rgba(0,245,255,0.4)", borderRight: "2px solid rgba(0,245,255,0.4)" }}
          />

          <div className="p-5 sm:p-7 space-y-6">

            {/* ── Active hero row ── */}
            <div
              className="flex items-center gap-4 p-4 rounded-2xl"
              style={{
                background: `${ACTIVE_HERO.color}08`,
                border: `1px solid ${ACTIVE_HERO.color}22`,
              }}
            >
              {/* Hero avatar */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                style={{
                  background: `radial-gradient(circle, ${ACTIVE_HERO.color}22, transparent)`,
                  border: `2px solid ${ACTIVE_HERO.color}44`,
                  boxShadow: `0 0 16px ${ACTIVE_HERO.glowColor}44`,
                }}
              >
                <span
                  className="animate-float"
                  style={{ filter: `drop-shadow(0 0 8px ${ACTIVE_HERO.color})` }}
                >
                  {ACTIVE_HERO.avatar}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div
                  className="text-[8px] font-bold tracking-[0.25em] mb-0.5"
                  style={{ color: ACTIVE_HERO.factionColor }}
                >
                  {ACTIVE_HERO.factionIcon} {ACTIVE_HERO.faction} · ACTIVE HERO
                </div>
                <div
                  className="text-base font-black tracking-wider text-white mb-0.5"
                  style={{ textShadow: `0 0 14px ${ACTIVE_HERO.color}88` }}
                >
                  {ACTIVE_HERO.name}
                </div>
                <div className="text-[10px] text-white/40 italic">&ldquo;{ACTIVE_HERO.title}&rdquo;</div>
              </div>

              <Link
                href="/heroes"
                className="shrink-0 px-3 py-1.5 rounded-xl text-[9px] font-bold tracking-widest transition-all active:scale-95 focus:outline-none"
                style={{
                  background: `${ACTIVE_HERO.color}14`,
                  border: `1px solid ${ACTIVE_HERO.color}35`,
                  color: ACTIVE_HERO.color,
                }}
              >
                CHANGE
              </Link>
            </div>

            {/* ── Profile row ── */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">

              {/* Avatar */}
              <div className="relative shrink-0">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl"
                  style={{
                    background: "linear-gradient(135deg, rgba(0,245,255,0.15), rgba(191,0,255,0.1))",
                    border: "2px solid rgba(0,245,255,0.35)",
                    boxShadow: "0 0 16px rgba(0,245,255,0.2)",
                  }}
                >
                  🤖
                </div>
                <div
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center font-black text-xs"
                  style={{
                    background: "#050510",
                    border: "2px solid #00f5ff",
                    color: "#00f5ff",
                    boxShadow: "0 0 8px rgba(0,245,255,0.5)",
                  }}
                >
                  7
                </div>
              </div>

              {/* Name + XP */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-lg font-black text-white tracking-wider">AGENT_001</span>
                  <span
                    className="text-[9px] px-2 py-0.5 rounded-full border font-bold tracking-widest"
                    style={{
                      color: "#ff0080",
                      borderColor: "rgba(255,0,128,0.3)",
                      background: "rgba(255,0,128,0.1)",
                    }}
                  >
                    HACKER
                  </span>
                </div>
                <div className="text-[10px] text-white/35 mb-3 tracking-widest">
                  LEVEL 7 — NEURAL INITIATE
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-white/35 tracking-wider">XP PROGRESS</span>
                    <span style={{ color: "#00f5ff" }}>2,450 / 3,000</span>
                  </div>
                  <XPBar xp={2450} maxXp={3000} color="#00f5ff" />
                  <div className="text-[9px] text-white/25 text-right tracking-widest">
                    550 XP TO LEVEL 8
                  </div>
                </div>
              </div>

              {/* Energy */}
              <div
                className="shrink-0 text-center p-4 rounded-2xl"
                style={{
                  background: "rgba(250,204,21,0.06)",
                  border: "1px solid rgba(250,204,21,0.2)",
                }}
              >
                <div className="text-xl mb-1">⚡</div>
                <div
                  className="text-xl font-black"
                  style={{ color: "#facc15", textShadow: "0 0 10px rgba(250,204,21,0.6)" }}
                >
                  4/5
                </div>
                <div className="text-[9px] text-white/30 tracking-widest mt-0.5">ENERGY</div>
              </div>
            </div>

            {/* ── Divider ── */}
            <div style={{ borderTop: "1px solid rgba(0,245,255,0.08)" }} />

            {/* ── Skill tree ── */}
            <div>
              <SectionLabel text="SKILL TREE" color="#00f5ff" />
              <div className="space-y-3">
                {SKILLS.map((skill) => (
                  <SkillBar key={skill.name} {...skill} />
                ))}
              </div>
            </div>

            {/* ── Divider ── */}
            <div style={{ borderTop: "1px solid rgba(0,245,255,0.08)" }} />

            {/* ── Achievement stats ── */}
            <div>
              <SectionLabel text="ACHIEVEMENTS" color="#00f5ff" />
              <div className="grid grid-cols-3 gap-3">
                {ACHIEVEMENTS.map(({ icon, value, label }) => (
                  <div
                    key={label}
                    className="text-center py-4 rounded-2xl"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <div className="text-xl mb-1">{icon}</div>
                    <div
                      className="text-lg font-black text-white mb-0.5"
                      style={{ textShadow: "0 0 10px rgba(0,245,255,0.3)" }}
                    >
                      {value}
                    </div>
                    <div className="text-[8px] text-white/28 tracking-widest">{label}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
