"use client";

import { useState } from "react";
import { DAILY_QUESTS, type DailyQuest } from "@/lib/dailyQuestsData";

const TYPE_STYLES = {
  lesson: { text: "text-cyan-400", bg: "bg-cyan-400/10", border: "border-cyan-400/25" },
  practice: { text: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/25" },
  challenge: { text: "text-pink-400", bg: "bg-pink-400/10", border: "border-pink-400/25" },
};

function QuestCard({ quest }: { quest: DailyQuest }) {
  const style = TYPE_STYLES[quest.type];
  const pct = Math.min((quest.current / quest.goal) * 100, 100);

  return (
    <div
      className={`glass-card rounded-xl p-4 relative overflow-hidden transition-all duration-200 border
        ${quest.completed
          ? "border-green-500/20 opacity-70"
          : `${style.border} hover:-translate-y-0.5`
        }`}
    >
      {/* Completion overlay glow */}
      {quest.completed && (
        <div className="absolute inset-0 bg-green-500/3 pointer-events-none rounded-xl" />
      )}

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center text-xl
          ${quest.completed ? "bg-green-500/15 border border-green-500/30" : `${style.bg} border ${style.border}`}`}>
          {quest.completed ? "✅" : quest.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span
              className={`text-xs font-bold truncate ${quest.completed ? "text-gray-400 line-through" : "text-white"}`}
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              {quest.title}
            </span>
            <span
              className="text-xs text-yellow-400 shrink-0"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              +{quest.xp} XP
            </span>
          </div>

          <p className="text-xs text-gray-500 mb-2">{quest.description}</p>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs mb-1" style={{ fontFamily: "var(--font-mono)" }}>
              <span className="text-gray-600">{quest.current}/{quest.goal}</span>
              <span className={quest.completed ? "text-green-400" : style.text}>
                {quest.completed ? "DONE" : `${Math.round(pct)}%`}
              </span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  quest.completed
                    ? "bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.5)]"
                    : quest.type === "lesson"
                    ? "bg-gradient-to-r from-cyan-500 to-cyan-400 shadow-[0_0_6px_rgba(0,245,255,0.4)]"
                    : quest.type === "practice"
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.4)]"
                    : "bg-gradient-to-r from-pink-600 to-pink-400 shadow-[0_0_6px_rgba(255,0,128,0.4)]"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DailyQuests() {
  const [expanded, setExpanded] = useState(true);
  const done = DAILY_QUESTS.filter((q) => q.completed).length;
  const totalXp = DAILY_QUESTS.reduce((s, q) => s + (q.completed ? q.xp : 0), 0);

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Header */}
      <button
        className="w-full flex items-center justify-between px-5 py-4 border-b border-cyan-500/10 hover:bg-cyan-400/3 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">📋</span>
          <div className="text-left">
            <div
              className="text-sm font-black text-white"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              DAILY QUESTS
            </div>
            <div
              className="text-xs text-gray-500 tracking-widest"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {done}/{DAILY_QUESTS.length} DONE · +{totalXp} XP EARNED
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Progress pills */}
          <div className="flex gap-1">
            {DAILY_QUESTS.map((q) => (
              <div
                key={q.id}
                className={`w-2 h-2 rounded-full ${q.completed ? "bg-green-400" : "bg-gray-700"}`}
              />
            ))}
          </div>
          <span className={`text-gray-500 transition-transform duration-200 text-xs ${expanded ? "rotate-180" : ""}`}>
            ▼
          </span>
        </div>
      </button>

      {/* Quest list */}
      {expanded && (
        <div className="p-4 space-y-3">
          {DAILY_QUESTS.map((quest) => (
            <QuestCard key={quest.id} quest={quest} />
          ))}

          {/* All done bonus */}
          {done === DAILY_QUESTS.length && (
            <div className="mt-2 p-3 rounded-xl bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/20 text-center">
              <div className="text-lg mb-1">🎉</div>
              <div
                className="text-xs font-bold text-green-400 tracking-widest"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                ALL QUESTS COMPLETE!
              </div>
              <div
                className="text-xs text-gray-500 mt-1"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                BONUS +100 XP CREDITED
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
