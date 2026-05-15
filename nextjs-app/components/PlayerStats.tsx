"use client";

import { useEffect, useState } from "react";

const SKILLS = [
  { name: "MACHINE LEARNING", level: 3, color: "cyan" },
  { name: "NEURAL NETWORKS", level: 1, color: "pink" },
  { name: "DATA SCIENCE", level: 2, color: "purple" },
  { name: "PROMPT ENGINEERING", level: 4, color: "cyan" },
];

const MAX_LEVEL = 5;

function XPBar({ xp, maxXp }: { xp: number; maxXp: number }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth((xp / maxXp) * 100);
    }, 300);
    return () => clearTimeout(timer);
  }, [xp, maxXp]);

  return (
    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
      <div
        className="xp-bar-fill h-full rounded-full"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

function SkillBar({
  name,
  level,
  color,
}: {
  name: string;
  level: number;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    cyan: "bg-cyan-400 shadow-cyan-400/50",
    pink: "bg-pink-500 shadow-pink-500/50",
    purple: "bg-purple-500 shadow-purple-500/50",
  };
  const textMap: Record<string, string> = {
    cyan: "text-cyan-400",
    pink: "text-pink-500",
    purple: "text-purple-500",
  };

  return (
    <div className="flex items-center gap-3">
      <span
        className={`text-xs tracking-widest w-44 shrink-0 ${textMap[color]}`}
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {name}
      </span>
      <div className="flex gap-1 flex-1">
        {Array.from({ length: MAX_LEVEL }).map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-sm transition-all duration-500 ${
              i < level
                ? `${colorMap[color]} shadow`
                : "bg-gray-800"
            }`}
            style={{ transitionDelay: `${i * 80}ms` }}
          />
        ))}
      </div>
      <span
        className="text-xs text-gray-500 w-8 text-right"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {level}/{MAX_LEVEL}
      </span>
    </div>
  );
}

export default function PlayerStats() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <div
            className="text-xs tracking-widest text-cyan-400 mb-3"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            // PLAYER_PROFILE.sys
          </div>
          <h2
            className="text-3xl sm:text-4xl font-black neon-text-cyan mb-4"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            YOUR STATS
          </h2>
          <p className="text-gray-400 text-sm">
            ติดตามความก้าวหน้า เก็บ XP และอัพเลเวลทักษะ AI ของคุณ
          </p>
        </div>

        {/* Player card */}
        <div className="glass-card neon-border-cyan rounded-2xl p-6 sm:p-8 relative corner-tl corner-br">
          {/* Profile row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-cyan-400/20 to-purple-500/20 border-2 border-cyan-400/50 flex items-center justify-center">
                <span className="text-3xl">🤖</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#050510] border-2 border-cyan-400 rounded-full flex items-center justify-center">
                <span className="text-xs font-black text-cyan-400" style={{ fontFamily: "var(--font-orbitron)" }}>7</span>
              </div>
            </div>

            {/* Name + Level */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <span
                  className="text-xl font-black text-white"
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  AGENT_001
                </span>
                <span className="px-2 py-0.5 text-xs rounded bg-pink-500/20 text-pink-400 border border-pink-500/30 tracking-widest"
                  style={{ fontFamily: "var(--font-mono)" }}>
                  HACKER
                </span>
              </div>
              <div
                className="text-xs text-gray-500 mb-3 tracking-widest"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                LEVEL 7 — NEURAL INITIATE
              </div>

              {/* XP Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs" style={{ fontFamily: "var(--font-mono)" }}>
                  <span className="text-gray-500">XP PROGRESS</span>
                  <span className="text-cyan-400">2,450 / 3,000</span>
                </div>
                <XPBar xp={2450} maxXp={3000} />
                <div className="text-xs text-gray-600 text-right" style={{ fontFamily: "var(--font-mono)" }}>
                  550 XP TO LEVEL 8
                </div>
              </div>
            </div>

            {/* Energy */}
            <div className="shrink-0 text-center p-4 rounded-xl bg-yellow-400/5 border border-yellow-400/20">
              <div className="text-2xl mb-1">⚡</div>
              <div
                className="text-xl font-black text-yellow-400"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                4/5
              </div>
              <div
                className="text-xs text-gray-500 tracking-widest"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                ENERGY
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-cyan-500/10 mb-6" />

          {/* Skills */}
          <div>
            <div
              className="text-xs text-gray-500 tracking-widest mb-4"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              SKILL_TREE:
            </div>
            <div className="space-y-3">
              {SKILLS.map((skill) => (
                <SkillBar key={skill.name} {...skill} />
              ))}
            </div>
          </div>

          {/* Bottom stats row */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-cyan-500/10">
            {[
              { icon: "🏆", value: "12", label: "MISSIONS DONE" },
              { icon: "🔥", value: "5", label: "DAY STREAK" },
              { icon: "💎", value: "340", label: "CREDITS" },
            ].map(({ icon, value, label }) => (
              <div key={label} className="text-center">
                <div className="text-xl mb-1">{icon}</div>
                <div
                  className="text-lg font-black text-white"
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  {value}
                </div>
                <div
                  className="text-xs text-gray-500 tracking-widest"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
