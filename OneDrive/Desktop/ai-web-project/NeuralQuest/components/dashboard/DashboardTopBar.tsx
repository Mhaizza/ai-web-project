"use client";

import { useState } from "react";

const ENERGY_MAX = 5;
const ENERGY_CURRENT = 3;

function EnergyGems({ current, max }: { current: number; max: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={`w-4 h-4 rounded-sm rotate-45 transition-all duration-300 ${
            i < current
              ? "bg-yellow-400 shadow-[0_0_6px_#facc15,0_0_12px_rgba(250,204,21,0.4)]"
              : "bg-gray-700 border border-gray-600"
          }`}
        />
      ))}
    </div>
  );
}

function XPBar({ xp, maxXp }: { xp: number; maxXp: number }) {
  const pct = Math.round((xp / maxXp) * 100);
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1" style={{ fontFamily: "var(--font-mono)" }}>
        <span className="text-gray-500">XP</span>
        <span className="text-cyan-400">{xp.toLocaleString()} / {maxXp.toLocaleString()}</span>
      </div>
      <div className="h-2.5 bg-gray-800/80 rounded-full overflow-hidden border border-gray-700/50">
        <div
          className="xp-bar-fill h-full rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function DashboardTopBar() {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <div className="glass-card border-b border-cyan-500/10 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center gap-4">

        {/* Left: Avatar + Player info */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border-2 border-cyan-400/50 flex items-center justify-center text-2xl">
              🤖
            </div>
            {/* Level badge */}
            <div className="absolute -bottom-1.5 -right-1.5 min-w-[22px] h-[22px] px-1 bg-[#050510] border-2 border-pink-500 rounded-full flex items-center justify-center">
              <span
                className="text-[10px] font-black text-pink-400"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                7
              </span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <span
                className="text-sm font-black text-white truncate"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                AGENT_001
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded bg-pink-500/15 text-pink-400 border border-pink-500/30 tracking-widest shrink-0"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                HACKER
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded bg-orange-500/15 text-orange-400 border border-orange-500/30 tracking-widest shrink-0"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                🔥 5
              </span>
            </div>
            {/* XP Bar */}
            <div className="max-w-xs">
              <XPBar xp={2450} maxXp={3000} />
            </div>
          </div>
        </div>

        {/* Right: Energy + Stats + Notif */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          {/* Energy */}
          <div className="flex flex-col items-center gap-1">
            <EnergyGems current={ENERGY_CURRENT} max={ENERGY_MAX} />
            <span
              className="text-xs text-gray-500 tracking-widest"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              ENERGY {ENERGY_CURRENT}/{ENERGY_MAX}
            </span>
          </div>

          {/* Credits */}
          <div className="text-center">
            <div
              className="text-base font-black text-purple-400"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              340
            </div>
            <div
              className="text-xs text-gray-500 tracking-widest"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              💎 CREDITS
            </div>
          </div>

          {/* Notification bell */}
          <button
            className="relative p-2 rounded-lg border border-gray-700/50 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors"
            onClick={() => setNotifOpen(!notifOpen)}
          >
            🔔
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">
              3
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
