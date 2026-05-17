"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { levelProgress } from "@/lib/level";

interface Props {
  showLabel?: boolean;
  compact?: boolean;
}

export default function LiveXPBar({ showLabel = true, compact = false }: Props) {
  const xp = useGameStore((s) => s.xp);
  const hydrated = useGameStore((s) => s.hydrated);
  const progress = levelProgress(xp);
  const [animPct, setAnimPct] = useState(0);

  useEffect(() => {
    if (!hydrated) return;
    const t = setTimeout(() => setAnimPct(progress.pct), 120);
    return () => clearTimeout(t);
  }, [progress.pct, hydrated]);

  if (!hydrated) {
    return (
      <div className="w-full">
        {showLabel && (
          <div
            className="flex justify-between text-xs mb-1"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <span className="text-gray-500">XP</span>
            <span className="text-gray-700">— / —</span>
          </div>
        )}
        <div
          className={`${compact ? "h-1.5" : "h-2.5"} bg-gray-800/80 rounded-full overflow-hidden border border-gray-700/50`}
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      {showLabel && (
        <div
          className="flex justify-between text-xs mb-1"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span className="text-gray-500">XP — LVL {progress.level}</span>
          <span className="text-cyan-400">
            {progress.intoLevel.toLocaleString()} /{" "}
            {progress.span.toLocaleString()}
          </span>
        </div>
      )}
      <div
        className={`${compact ? "h-1.5" : "h-2.5"} bg-gray-800/80 rounded-full overflow-hidden border border-gray-700/50`}
      >
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${animPct}%`,
            background: "linear-gradient(90deg, #00f5ff88, #00f5ff, #bf00ff)",
            boxShadow: "0 0 10px rgba(0, 245, 255, 0.5)",
          }}
        />
      </div>
    </div>
  );
}
