"use client";

import { useEffect, useRef, useState } from "react";

const COMPANION_MESSAGES = [
  "สวัสดี AGENT_001! วันนี้พร้อมเรียนรู้แล้วใช่ไหม? 🚀",
  "คุณเหลืออีกแค่ 550 XP ก็จะขึ้น Level 8 แล้ว!",
  "Mission M-003 เกี่ยวกับ Neural Networks รอคุณอยู่นะ",
  "Streak 5 วันแล้ว! อย่าให้มันหยุดได้ 🔥",
  "Tip: การเรียนทุกวันแม้แค่ 10 นาที ดีกว่าเรียนนานๆ ทีเดียว",
];

const COMPANION_MOODS = ["😊", "🤩", "🧐", "💪", "🎯"];

interface Skill {
  name: string;
  level: number;
  max: number;
  color: string;
}

const COMPANION_SKILLS: Skill[] = [
  { name: "EMPATHY", level: 4, max: 5, color: "bg-cyan-400" },
  { name: "TEACHING", level: 5, max: 5, color: "bg-purple-400" },
  { name: "HUMOR", level: 3, max: 5, color: "bg-pink-400" },
  { name: "PATIENCE", level: 5, max: 5, color: "bg-green-400" },
];

export default function AICompanion() {
  const [msgIdx, setMsgIdx] = useState(0);
  const [moodIdx, setMoodIdx] = useState(0);
  const [typing, setTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  const nextMessage = () => {
    if (typing) return;
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    setTyping(true);
    typingTimeoutRef.current = setTimeout(() => {
      setMsgIdx((i) => (i + 1) % COMPANION_MESSAGES.length);
      setMoodIdx((i) => (i + 1) % COMPANION_MOODS.length);
      setTyping(false);
    }, 600);
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-purple-500/15 bg-purple-500/5">
        <div className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <div>
            <div
              className="text-sm font-black neon-text-purple"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              AI COMPANION
            </div>
            <div
              className="text-xs text-gray-500 tracking-widest"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              NEXUS — YOUR LEARNING GUIDE
            </div>
          </div>
          {/* Online indicator */}
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-glow-pulse" />
            <span className="text-xs text-green-400" style={{ fontFamily: "var(--font-mono)" }}>
              ONLINE
            </span>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Companion avatar + mood */}
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border-2 border-purple-400/40 flex items-center justify-center text-3xl animate-float">
              {COMPANION_MOODS[moodIdx]}
            </div>
            {/* Level */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#050510] border-2 border-purple-400 rounded-full flex items-center justify-center">
              <span className="text-[9px] font-black text-purple-400" style={{ fontFamily: "var(--font-orbitron)" }}>
                ∞
              </span>
            </div>
          </div>

          <div className="flex-1">
            <div className="font-black text-white text-sm mb-0.5" style={{ fontFamily: "var(--font-orbitron)" }}>
              NEXUS
            </div>
            <div className="flex flex-wrap gap-1">
              {["AI TUTOR", "GUIDE", "FRIEND"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 tracking-widest"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Chat bubble */}
        <div className="relative">
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl rounded-tl-sm p-4 min-h-[60px] flex items-center">
            {typing ? (
              <div className="flex gap-1.5 items-center">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-purple-400"
                    style={{ animation: `glowPulse 1s ease-in-out ${i * 0.2}s infinite` }}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-300 leading-relaxed">
                {COMPANION_MESSAGES[msgIdx]}
              </p>
            )}
          </div>
          {/* Tail */}
          <div className="absolute -top-2 left-4 w-3 h-3 bg-purple-500/20 border-l border-t border-purple-500/20 rotate-45" />
        </div>

        {/* Next message button */}
        <button
          onClick={nextMessage}
          disabled={typing}
          className="w-full py-2 text-xs font-bold tracking-widest rounded-lg border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 transition-colors disabled:opacity-50"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          {typing ? "THINKING..." : "NEXT MESSAGE →"}
        </button>

        {/* Divider */}
        <div className="border-t border-purple-500/10" />

        {/* Companion skills */}
        <div>
          <div
            className="text-xs text-gray-500 tracking-widest mb-3"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            NEXUS_SKILLS:
          </div>
          <div className="space-y-2">
            {COMPANION_SKILLS.map((skill) => (
              <div key={skill.name} className="flex items-center gap-2">
                <span
                  className="text-xs text-gray-500 w-20 shrink-0 tracking-widest"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {skill.name}
                </span>
                <div className="flex gap-0.5 flex-1">
                  {Array.from({ length: skill.max }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-sm ${i < skill.level ? `${skill.color} opacity-80` : "bg-gray-800"}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-purple-500/10" />

        {/* Quick action */}
        <button className="w-full py-3 text-xs font-bold tracking-widest rounded-xl bg-gradient-to-r from-purple-600/80 to-cyan-600/80 text-white border border-purple-500/30 hover:from-purple-500/80 hover:to-cyan-500/80 transition-all shadow-[0_0_15px_rgba(139,92,246,0.2)]"
          style={{ fontFamily: "var(--font-orbitron)" }}>
          💬 TALK TO NEXUS
        </button>
      </div>
    </div>
  );
}
