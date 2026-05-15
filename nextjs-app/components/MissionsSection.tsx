import React from "react";
import Link from "next/link";

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

const MISSIONS: Mission[] = [
  {
    id: "m1",
    code: "M-001",
    title: "What is AI?",
    description:
      "ค้นพบโลกของ AI — เรียนรู้พื้นฐานและแนวคิดหลักที่จะเปลี่ยนโลก",
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
    description:
      "เข้าใจวิธีที่ Machine Learning ทำงาน ผ่านตัวอย่างจริงที่เข้าใจได้ง่าย",
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
    difficulty: "MEDIUM",
    tags: ["ETHICS", "BIAS", "SAFETY"],
    locked: true,
    completed: false,
    icon: "⚖️",
  },
  {
    id: "m6",
    code: "BOSS-01",
    title: "AI BOSS: Build a Chatbot",
    description:
      "สร้าง AI Chatbot ของคุณเองตั้งแต่ต้น — การทดสอบขั้นสูงสุดของทักษะคุณ",
    xp: 1000,
    difficulty: "BOSS",
    tags: ["PROJECT", "CHATBOT", "FINAL"],
    locked: true,
    completed: false,
    icon: "👾",
  },
];

const DIFFICULTY_STYLES: Record<
  Difficulty,
  { text: string; bg: string; border: string; glow: string }
> = {
  EASY: {
    text: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/30",
    glow: "shadow-green-400/20",
  },
  MEDIUM: {
    text: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/30",
    glow: "shadow-yellow-400/20",
  },
  HARD: {
    text: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/30",
    glow: "shadow-orange-400/20",
  },
  BOSS: {
    text: "text-pink-400",
    bg: "bg-pink-400/10",
    border: "border-pink-500/50",
    glow: "shadow-pink-500/30",
  },
};

function MissionCard({ mission }: { mission: Mission }) {
  const diff = DIFFICULTY_STYLES[mission.difficulty];

  return (
    <div
      className={`
        glass-card rounded-xl p-5 relative overflow-hidden group transition-all duration-300
        ${mission.locked ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:-translate-y-1"}
        ${mission.difficulty === "BOSS" ? `border ${diff.border} shadow-lg ${diff.glow}` : ""}
        ${mission.completed ? "border border-green-500/20" : ""}
      `}
    >
      {/* Corner accent */}
      <div className={`absolute top-0 left-0 w-8 h-8 ${diff.bg} clip-corner pointer-events-none`} />

      {/* Hover shimmer */}
      {!mission.locked && (
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 via-transparent to-transparent opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" />
      )}

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={`w-12 h-12 shrink-0 rounded-lg flex items-center justify-center text-2xl
          ${mission.completed ? "bg-green-500/15 border border-green-500/30" : `${diff.bg} border ${diff.border}`}
        `}
        >
          {mission.locked ? "🔒" : mission.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className="text-xs text-gray-600 tracking-widest"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {mission.code}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded ${diff.bg} ${diff.text} ${diff.border} border tracking-widest`}
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {mission.difficulty}
            </span>
            {mission.completed && (
              <span
                className="text-xs px-2 py-0.5 rounded bg-green-500/15 text-green-400 border border-green-500/30 tracking-widest"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                ✓ DONE
              </span>
            )}
          </div>

          <h3
            className={`font-bold mb-1 text-sm sm:text-base ${mission.completed ? "text-gray-400 line-through" : "text-white"}`}
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            {mission.title}
          </h3>

          <p className="text-xs text-gray-500 mb-3 leading-relaxed">
            {mission.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {mission.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-500 border border-gray-700/50 tracking-widest"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-yellow-400 text-sm">⚡</span>
              <span
                className="text-xs font-bold text-yellow-400"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                +{mission.xp} XP
              </span>
            </div>
            {!mission.locked && !mission.completed && (
              mission.href ? (
                <Link
                  href={mission.href}
                  className="text-xs px-3 py-1.5 rounded border border-pink-500/50 text-pink-400 hover:bg-pink-400/10 transition-colors tracking-widest inline-block"
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  ▶ START →
                </Link>
              ) : (
                <button
                  className="text-xs px-3 py-1.5 rounded border border-cyan-500/40 text-cyan-400 hover:bg-cyan-400/10 transition-colors tracking-widest"
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  START →
                </button>
              )
            )}
            {mission.completed && mission.href && (
              <Link
                href={mission.href}
                className="text-xs px-3 py-1.5 rounded border border-green-500/30 text-green-400 hover:bg-green-400/10 transition-colors tracking-widest inline-block"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                🔄 REPLAY
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* BOSS special effect */}
      {mission.difficulty === "BOSS" && !mission.locked && (
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-pink-500 animate-glow-pulse" />
      )}
    </div>
  );
}

export default function MissionsSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="text-xs tracking-widest text-pink-400 mb-3"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            // MISSION_BOARD.sys
          </div>
          <h2
            className="text-3xl sm:text-4xl font-black neon-text-pink mb-4"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            ACTIVE MISSIONS
          </h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            เลือกภารกิจ เรียนรู้ทักษะ AI และสะสม XP เพื่ออัพเลเวลตัวเอง
          </p>
        </div>

        {/* Mission grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MISSIONS.map((mission) => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </div>

        {/* View all button */}
        <div className="text-center mt-8">
          <button
            className="btn-neon-cyan px-8 py-3 text-xs font-bold tracking-widest rounded-lg"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            VIEW ALL MISSIONS →
          </button>
        </div>
      </div>
    </section>
  );
}
