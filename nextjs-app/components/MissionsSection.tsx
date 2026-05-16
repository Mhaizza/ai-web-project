import React from "react";
import Link from "next/link";

// ─── Types ─────────────────────────────────────────────────────────────────

type Difficulty = "EASY" | "MEDIUM" | "HARD" | "BOSS";

interface Mission {
  id: string;
  code: string;
  title: string;
  description: string;
  xp: number;
  difficulty: Difficulty;
  tags: string[];
  locked: boolean;
  completed: boolean;
  icon: string;
  href?: string;
}

// ─── Data ──────────────────────────────────────────────────────────────────

const MISSIONS: Mission[] = [
  {
    id: "m1",
    code: "M-001",
    title: "What is AI?",
    description: "ค้นพบโลกของ AI — เรียนรู้พื้นฐานและแนวคิดหลักที่จะเปลี่ยนโลก",
    xp: 100,
    difficulty: "EASY",
    tags: ["AI BASICS", "INTRO"],
    locked: false,
    completed: true,
    icon: "🧠",
    href: "/missions/what-is-ai",
  },
  {
    id: "m2",
    code: "M-002",
    title: "Machine Learning 101",
    description: "เข้าใจวิธีที่ Machine Learning ทำงาน ผ่านตัวอย่างจริงที่เข้าใจได้ง่าย",
    xp: 200,
    difficulty: "EASY",
    tags: ["ML", "TRAINING DATA"],
    locked: false,
    completed: false,
    icon: "⚙️",
    href: "/missions/ml-101",
  },
  {
    id: "m3",
    code: "M-003",
    title: "Neural Network Basics",
    description: "สำรวจโครงสร้าง Neural Network และเข้าใจว่า AI 'เรียนรู้' ได้อย่างไร",
    xp: 350,
    difficulty: "MEDIUM",
    tags: ["NEURAL NET", "DEEP LEARNING"],
    locked: false,
    completed: false,
    icon: "🔗",
    href: "/missions/neural-network",
  },
  {
    id: "m4",
    code: "M-004",
    title: "Social AI Agent",
    description: "เขียน prompt ให้ AI สร้างโพสต์โซเชียลมีเดีย — ภารกิจแรกที่เล่นได้!",
    xp: 500,
    difficulty: "MEDIUM",
    tags: ["LLM", "PROMPTS", "PLAYABLE"],
    locked: false,
    completed: false,
    icon: "✍️",
    href: "/missions/social-post",
  },
  {
    id: "m5",
    code: "M-005",
    title: "AI Ethics Protocol",
    description: "ทำความเข้าใจจริยธรรม bias และความรับผิดชอบในยุค AI",
    xp: 400,
    difficulty: "HARD",
    tags: ["ETHICS", "BIAS", "SAFETY"],
    locked: true,
    completed: false,
    icon: "⚖️",
  },
  {
    id: "m6",
    code: "BOSS-01",
    title: "AI BOSS: Build a Chatbot",
    description: "สร้าง AI Chatbot ของคุณเองตั้งแต่ต้น — การทดสอบขั้นสูงสุดของทักษะคุณ",
    xp: 1000,
    difficulty: "BOSS",
    tags: ["PROJECT", "CHATBOT", "FINAL"],
    locked: true,
    completed: false,
    icon: "👾",
  },
];

// ─── Difficulty config ──────────────────────────────────────────────────────

const DIFF: Record<Difficulty, { color: string; glow: string; dim: string; label: string }> = {
  EASY:   { color: "#4ade80", glow: "rgba(74,222,128,0.5)",   dim: "rgba(74,222,128,0.07)",   label: "EASY" },
  MEDIUM: { color: "#facc15", glow: "rgba(250,204,21,0.5)",   dim: "rgba(250,204,21,0.07)",   label: "MEDIUM" },
  HARD:   { color: "#fb923c", glow: "rgba(251,146,60,0.5)",   dim: "rgba(251,146,60,0.07)",   label: "HARD" },
  BOSS:   { color: "#ff0080", glow: "rgba(255,0,128,0.6)",    dim: "rgba(255,0,128,0.08)",    label: "★ BOSS" },
};

// ─── MissionCard ───────────────────────────────────────────────────────────

function MissionCard({ mission }: { mission: Mission }) {
  const d = DIFF[mission.difficulty];
  const isBoss = mission.difficulty === "BOSS";

  return (
    <div
      className={`relative rounded-2xl overflow-hidden transition-all duration-300 group ${
        mission.locked ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:-translate-y-1"
      }`}
      style={{
        background: `linear-gradient(140deg, ${d.dim} 0%, rgba(5,5,16,0.97) 60%)`,
        border: `1px solid ${mission.locked ? "rgba(255,255,255,0.07)" : d.color + "30"}`,
        boxShadow: mission.locked
          ? "none"
          : mission.completed
          ? "0 0 16px rgba(74,222,128,0.1)"
          : isBoss
          ? `0 0 30px ${d.glow}22, 0 0 60px ${d.glow}11`
          : `0 0 16px ${d.dim}`,
      }}
    >
      {/* Completed overlay stripe */}
      {mission.completed && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(140deg, rgba(74,222,128,0.06) 0%, transparent 50%)",
          }}
        />
      )}

      {/* BOSS: scan-line effect */}
      {isBoss && !mission.locked && (
        <div className="absolute inset-0 scan-line-anim pointer-events-none opacity-50" />
      )}

      {/* BOSS: diagonal shimmer */}
      {isBoss && !mission.locked && (
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            background: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${d.color}11 10px, ${d.color}11 11px)`,
          }}
        />
      )}

      {/* Hover glow */}
      {!mission.locked && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at top left, ${d.dim}, transparent 60%)`,
          }}
        />
      )}

      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-4">

          {/* Icon bubble */}
          <div
            className="w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center text-2xl relative"
            style={{
              background: mission.completed
                ? "rgba(74,222,128,0.12)"
                : `${d.dim}`,
              border: `1px solid ${mission.completed ? "rgba(74,222,128,0.3)" : d.color + "30"}`,
              boxShadow: isBoss && !mission.locked ? `0 0 14px ${d.glow}44` : "none",
            }}
          >
            {mission.locked ? "🔒" : mission.icon}
            {isBoss && !mission.locked && (
              <div
                className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full animate-glow-pulse"
                style={{ background: d.color, boxShadow: `0 0 6px ${d.color}` }}
              />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">

            {/* Header badges */}
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
              {mission.completed && (
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
            </div>

            {/* Title */}
            <h3
              className="font-black text-sm sm:text-base mb-1.5 tracking-wide"
              style={{
                color: mission.completed
                  ? "rgba(255,255,255,0.3)"
                  : isBoss
                  ? d.color
                  : "#fff",
                textDecoration: mission.completed ? "line-through" : "none",
                textShadow:
                  isBoss && !mission.locked ? `0 0 16px ${d.color}66` : "none",
              }}
            >
              {mission.title}
            </h3>

            {/* Description */}
            <p className="text-[11px] text-white/38 mb-3 leading-relaxed">
              {mission.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {mission.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[8px] px-2 py-0.5 rounded-full font-bold tracking-widest"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.35)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Footer: XP + action */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span style={{ color: "#facc15", fontSize: "13px" }}>⚡</span>
                <span
                  className="text-[10px] font-black tracking-widest"
                  style={{ color: "#facc15" }}
                >
                  +{mission.xp} XP
                </span>
              </div>

              {!mission.locked && !mission.completed && mission.href && (
                <Link
                  href={mission.href}
                  className="text-[10px] px-3 py-1.5 rounded-xl border font-bold tracking-widest transition-all duration-200 active:scale-95 focus:outline-none"
                  style={{
                    color: d.color,
                    borderColor: `${d.color}40`,
                    background: `${d.color}10`,
                  }}
                >
                  ▶ START
                </Link>
              )}

              {!mission.locked && !mission.completed && !mission.href && (
                <button
                  className="text-[10px] px-3 py-1.5 rounded-xl border font-bold tracking-widest transition-all duration-200 active:scale-95 focus:outline-none"
                  style={{
                    color: "rgba(255,255,255,0.3)",
                    borderColor: "rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.04)",
                  }}
                >
                  COMING SOON
                </button>
              )}

              {mission.completed && mission.href && (
                <Link
                  href={mission.href}
                  className="text-[10px] px-3 py-1.5 rounded-xl border font-bold tracking-widest transition-all duration-200 active:scale-95 focus:outline-none"
                  style={{
                    color: "#4ade80",
                    borderColor: "rgba(74,222,128,0.3)",
                    background: "rgba(74,222,128,0.08)",
                  }}
                >
                  🔄 REPLAY
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Section ───────────────────────────────────────────────────────────

export default function MissionsSection() {
  const available = MISSIONS.filter((m) => !m.locked).length;
  const completed = MISSIONS.filter((m) => m.completed).length;

  return (
    <section className="py-20 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Section header */}
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

          {/* Mission status pills */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span
              className="text-[9px] px-3 py-1 rounded-full font-bold tracking-widest"
              style={{
                color: "#00f5ff",
                background: "rgba(0,245,255,0.1)",
                border: "1px solid rgba(0,245,255,0.25)",
              }}
            >
              {available} AVAILABLE
            </span>
            <span
              className="text-[9px] px-3 py-1 rounded-full font-bold tracking-widest"
              style={{
                color: "#4ade80",
                background: "rgba(74,222,128,0.1)",
                border: "1px solid rgba(74,222,128,0.25)",
              }}
            >
              {completed} COMPLETED
            </span>
            <span
              className="text-[9px] px-3 py-1 rounded-full font-bold tracking-widest"
              style={{
                color: "rgba(255,255,255,0.3)",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {MISSIONS.length - available} LOCKED
            </span>
          </div>
        </div>

        {/* Mission grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MISSIONS.map((mission) => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </div>

        {/* View all button */}
        <div className="text-center mt-8">
          <button
            className="px-8 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all duration-200 active:scale-95 focus:outline-none"
            style={{
              background: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.4)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            VIEW ALL MISSIONS →
          </button>
        </div>
      </div>
    </section>
  );
}
