"use client";

import React, { useEffect, useState } from "react";

interface MissionCoachBannerProps {
  tips: string[];
  accent?: string;
}

/** Rotating oracle hints — keeps mastery phases from feeling like a blank exam. */
export function MissionCoachBanner({
  tips,
  accent = "#00f5ff",
}: MissionCoachBannerProps) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (tips.length <= 1) return;
    const t = window.setInterval(
      () => setI((n) => (n + 1) % tips.length),
      5200
    );
    return () => window.clearInterval(t);
  }, [tips.length]);

  const tip = tips[i] ?? "";

  return (
    <div
      className="rounded-xl px-4 py-3 border flex gap-3 items-start"
      style={{
        borderColor: `${accent}44`,
        background: `linear-gradient(135deg, ${accent}12, transparent)`,
      }}
    >
      <span className="text-xl shrink-0" aria-hidden>
        🤖
      </span>
      <div>
        <p
          className="text-[10px] tracking-[0.25em] font-bold mb-1"
          style={{ fontFamily: "var(--font-mono)", color: accent }}
        >
          ORACLE_ADVISORY
        </p>
        <p className="text-sm text-gray-200 leading-snug">{tip}</p>
      </div>
    </div>
  );
}
