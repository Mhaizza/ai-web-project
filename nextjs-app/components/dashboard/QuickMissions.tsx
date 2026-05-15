"use client";

import { useState } from "react";
import Link from "next/link";

type MissionStatus = "available" | "in_progress" | "locked" | "completed";
type Difficulty = "EASY" | "MEDIUM" | "HARD" | "BOSS";

interface Mission {
  id: string;
  code: string;
  title: string;
  description: string;
  xp: number;
  energy: number;
  difficulty: Difficulty;
  status: MissionStatus;
  icon: string;
  world: string;
  progress?: number;
  href?: string;
}

const MISSIONS: Mission[] = [
  {
    id: "m1",
    code: "M-001",
    title: "What is AI?",
    description: "เรียนพื้นฐาน AI และแนวคิดหลักที่เปลี่ยนโลก",
    xp: 100,
    energy: 1,
    difficulty: "EASY",
    status: "completed",
    icon: "🧠",
    world: "WORLD 1",
    href: "/missions/what-is-ai",
  },
  {
    id: "m2",
    code: "M-002",
    title: "Machine Learning 101",
    description: "เข้าใจวิธีที่ Machine Learning ทำงาน",
    xp: 200,
    energy: 1,
    difficulty: "EASY",
    status: "in_progress",
    icon: "⚙️",
    world: "WORLD 1",
    progress: 60,
    href: "/missions/ml-101",
  },
  {
    id: "m3",
    code: "M-003",
    title: "Neural Network Basics",
    description: "สำรวจโครงสร้าง Neural Network",
    xp: 350,
    energy: 2,
    difficulty: "MEDIUM",
    status: "available",
    icon: "🔗",
    world: "WORLD 1",
    href: "/missions/neural-network",
  },
  {
    id: "m4",
    code: "M-004",
    title: "Social AI Agent",
    description: "เขียน prompt ให้ AI สร้างโพสต์โซเชียลมีเดีย",
    xp: 500,
    energy: 2,
    difficulty: "MEDIUM",
    status: "available",
    icon: "✍️",
    world: "WORLD 1",
    href: "/missions/social-post",
  },
  {
    id: "m5",
    code: "BOSS-01",
    title: "AI BOSS: Build a Chatbot",
    description: "สร้าง AI Chatbot ของคุณเองตั้งแต่ต้น",
    xp: 1000,
    energy: 3,
    difficulty: "BOSS",
    status: "locked",
    icon: "👾",
    world: "WORLD 1",
  },
];

const DIFF_STYLE: Record<Difficulty, { text: string; border: string; bg: string }> = {
  EASY:   { text: "text-green-400",  border: "border-green-400/30",  bg: "bg-green-400/10" },
  MEDIUM: { text: "text-yellow-400", border: "border-yellow-400/30", bg: "bg-yellow-400/10" },
  HARD:   { text: "text-orange-400", border: "border-orange-400/30", bg: "bg-orange-400/10" },
  BOSS:   { text: "text-pink-400",   border: "border-pink-500/50",   bg: "bg-pink-400/10" },
};

const STATUS_CONFIG: Record<MissionStatus, { label: string; labelColor: string }> = {
  available:   { label: "AVAILABLE", labelColor: "text-cyan-400" },
  in_progress: { label: "IN PROGRESS", labelColor: "text-yellow-400" },
  locked:      { label: "LOCKED", labelColor: "text-gray-600" },
  completed:   { label: "COMPLETED", labelColor: "text-green-400" },
};

function MissionRow({ mission }: { mission: Mission }) {
  const diff = DIFF_STYLE[mission.difficulty];
  const status = STATUS_CONFIG[mission.status];
  const isLocked = mission.status === "locked";
  const isCompleted = mission.status === "completed";

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 group
        ${isLocked
          ? "border-gray-800/50 bg-gray-900/30 opacity-50 cursor-not-allowed"
          : isCompleted
          ? "border-green-500/15 bg-green-500/3 cursor-default"
          : "border-cyan-500/15 bg-[#0a0a1a]/80 hover:border-cyan-500/30 hover:bg-[#0a0a22]/80 cursor-pointer"
        }`}
    >
      {/* Icon */}
      <div className={`w-11 h-11 shrink-0 rounded-lg flex items-center justify-center text-xl
        ${isLocked ? "bg-gray-800 border border-gray-700" : `${diff.bg} border ${diff.border}`}`}>
        {isLocked ? "🔒" : mission.icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <span
            className={`text-xs font-bold ${isCompleted ? "text-gray-400 line-through" : "text-white"}`}
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            {mission.title}
          </span>
          <span
            className={`text-xs tracking-widest ${diff.text}`}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            [{mission.difficulty}]
          </span>
        </div>

        <p className="text-xs text-gray-500 truncate mb-1">{mission.description}</p>

        {/* In-progress bar */}
        {mission.status === "in_progress" && mission.progress != null && (
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden w-full max-w-[160px]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-yellow-300 shadow-[0_0_6px_rgba(250,204,21,0.4)]"
              style={{ width: `${mission.progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Right: XP + energy + action */}
      <div className="shrink-0 flex flex-col items-end gap-1.5">
        <div className="flex items-center gap-2 text-xs" style={{ fontFamily: "var(--font-mono)" }}>
          <span className="text-yellow-400">+{mission.xp} XP</span>
          <span className="text-gray-600">|</span>
          <span className="text-yellow-500">⚡{mission.energy}</span>
        </div>
        <span className={`text-xs tracking-widest ${status.labelColor}`} style={{ fontFamily: "var(--font-mono)" }}>
          {status.label}
        </span>
        {!isLocked && !isCompleted && (
          mission.href ? (
            <Link
              href={mission.href}
              className="text-xs px-3 py-1 rounded border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-colors tracking-widest mt-0.5 inline-block"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              {mission.status === "in_progress" ? "CONTINUE" : "START"} →
            </Link>
          ) : (
            <button
              className="text-xs px-3 py-1 rounded border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-colors tracking-widest mt-0.5"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              {mission.status === "in_progress" ? "CONTINUE" : "START"} →
            </button>
          )
        )}
        {isCompleted && (
          <span className="text-green-400 text-sm">✅</span>
        )}
      </div>
    </div>
  );
}

const FILTERS = ["ALL", "AVAILABLE", "IN PROGRESS", "COMPLETED"] as const;
type Filter = (typeof FILTERS)[number];

export default function QuickMissions() {
  const [filter, setFilter] = useState<Filter>("ALL");

  const filtered = MISSIONS.filter((m) => {
    if (filter === "ALL") return true;
    if (filter === "AVAILABLE") return m.status === "available";
    if (filter === "IN PROGRESS") return m.status === "in_progress";
    if (filter === "COMPLETED") return m.status === "completed";
    return true;
  });

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-cyan-500/10">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-xl">⚔️</span>
            <div>
              <div
                className="text-sm font-black neon-text-pink"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                MISSIONS
              </div>
              <div
                className="text-xs text-gray-500 tracking-widest"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {MISSIONS.filter((m) => m.status === "completed").length}/{MISSIONS.length} COMPLETED
              </div>
            </div>
          </div>
          {/* Filter tabs */}
          <div className="flex gap-1 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 text-xs rounded-lg transition-all tracking-widest ${
                  filter === f
                    ? "bg-cyan-400/15 text-cyan-400 border border-cyan-400/30"
                    : "text-gray-600 hover:text-gray-400 border border-transparent"
                }`}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mission list */}
      <div className="p-4 space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-gray-600 text-sm" style={{ fontFamily: "var(--font-mono)" }}>
            NO MISSIONS FOUND
          </div>
        ) : (
          filtered.map((mission) => (
            <MissionRow key={mission.id} mission={mission} />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-cyan-500/10">
        <button
          className="text-xs text-cyan-400 hover:text-cyan-300 tracking-widest transition-colors"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          VIEW ALL MISSIONS →
        </button>
      </div>
    </div>
  );
}
