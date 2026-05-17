"use client";

import { useState } from "react";
import type { TapStep } from "@/lib/mission-flow-types";

interface TapMissionStepsProps {
  steps: TapStep[];
  accentColor?: string;
  onComplete: (correctCount: number) => void;
}

export function TapMissionSteps({
  steps,
  accentColor = "#00f5ff",
  onComplete,
}: TapMissionStepsProps) {
  const [idx, setIdx] = useState(0);
  const [correctTotal, setCorrectTotal] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState<string | number | null>(null);
  const [showAdvance, setShowAdvance] = useState(false);

  const q = steps[idx];
  const total = steps.length;
  const isAnswered = answered !== null;

  const isCorrect =
    q.kind === "mcq"
      ? answered === q.correctIndex
      : answered === q.correct;

  function advance() {
    const nextCorrect = correctTotal + (isCorrect ? 1 : 0);
    if (idx < total - 1) {
      setCorrectTotal(nextCorrect);
      setIdx((i) => i + 1);
      setAnswered(null);
      setShowAdvance(false);
    } else {
      onComplete(nextCorrect);
    }
  }

  function handleSelect(val: string | number) {
    if (isAnswered) return;
    setAnswered(val);
    setStreak((s) =>
      q.kind === "mcq"
        ? val === q.correctIndex
          ? s + 1
          : 0
        : val === q.correct
        ? s + 1
        : 0
    );
    setTimeout(() => setShowAdvance(true), 320);
  }

  const progress = (idx / total) * 100;

  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${accentColor}, #bf00ff)`,
            }}
          />
        </div>
        <span
          className="text-xs text-gray-500 shrink-0"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {idx + 1}/{total}
        </span>
        {streak >= 2 && (
          <span
            className="text-xs font-bold text-orange-400 shrink-0"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            🔥 x{streak}
          </span>
        )}
      </div>

      <span
        className="text-xs text-gray-600 tracking-widest block"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {q.kind === "mcq" ? "● TAP_PROTOCOL / MCQ" : "● TAP_PROTOCOL / FILL"}
      </span>

      {q.coachHint && (
        <div
          className="rounded-xl px-3 py-2 border text-xs leading-relaxed"
          style={{
            borderColor: `${accentColor}44`,
            background: `${accentColor}10`,
            color: "#e5e7eb",
            fontFamily: "var(--font-mono)",
          }}
        >
          <span style={{ color: accentColor }}>◈ ORACLE_TIP:</span> {q.coachHint}
        </div>
      )}

      {q.kind === "mcq" ? (
        <>
          <div
            className="glass-card rounded-2xl p-5 border text-center"
            style={{ borderColor: `${accentColor}33` }}
          >
            <p className="text-base font-bold text-white leading-snug">
              {q.prompt}
            </p>
          </div>
          <div className="space-y-2.5">
            {q.options.map((opt, i) => {
              let cls =
                "border-gray-700/50 text-gray-300 active:scale-[0.98]";
              if (!isAnswered)
                cls += " hover:border-cyan-500/45 hover:bg-white/[0.03]";
              if (isAnswered && i === q.correctIndex)
                cls =
                  "border-green-500 bg-green-500/10 text-green-300";
              else if (isAnswered && i === answered)
                cls = "border-red-500 bg-red-500/10 text-red-300";
              else if (isAnswered)
                cls = "border-gray-800 text-gray-600 opacity-40";

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelect(i)}
                  disabled={isAnswered}
                  className={`w-full min-h-[52px] p-4 rounded-xl border text-left text-sm font-medium transition-all duration-200 touch-manipulation ${cls}`}
                >
                  <span
                    className="font-black mr-2.5 text-xs opacity-60"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {(["A", "B", "C", "D"] as const)[i]}
                  </span>
                  {opt}
                  {isAnswered && i === q.correctIndex && (
                    <span className="float-right text-green-400 font-bold">✓</span>
                  )}
                  {isAnswered &&
                    i === answered &&
                    i !== q.correctIndex && (
                      <span className="float-right text-red-400 font-bold">✗</span>
                    )}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <div
            className="glass-card rounded-2xl p-5 border text-center"
            style={{ borderColor: `${accentColor}33` }}
          >
            <p className="text-base font-bold text-white leading-relaxed">
              {q.prefix}{" "}
              <span
                className={`inline-block min-w-[100px] px-3 py-0.5 rounded-lg border-b-2 text-center transition-all duration-300 ${
                  !isAnswered
                    ? "border-cyan-500 text-cyan-400"
                    : isCorrect
                    ? "border-green-500 text-green-400 bg-green-500/10"
                    : "border-red-500 text-red-400 bg-red-500/10"
                }`}
              >
                {answered !== null ? String(answered) : "______"}
              </span>{" "}
              {q.suffix}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {q.chips.map((chip) => {
              let cls = "border-gray-700 text-gray-300 touch-manipulation";
              if (!isAnswered)
                cls +=
                  " hover:border-cyan-500/60 hover:bg-cyan-500/5 active:scale-95";
              if (isAnswered && chip === q.correct)
                cls =
                  "border-green-500 bg-green-500/10 text-green-300";
              else if (isAnswered && chip === answered)
                cls = "border-red-500 bg-red-500/10 text-red-300";
              else if (isAnswered)
                cls = "border-gray-800 text-gray-600 opacity-40";

              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleSelect(chip)}
                  disabled={isAnswered}
                  className={`px-5 py-3 rounded-xl border text-sm font-bold transition-all duration-200 min-h-[48px] ${cls}`}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        </>
      )}

      {isAnswered && (
        <div
          className={`rounded-xl p-4 border text-sm leading-relaxed ${
            isCorrect
              ? "bg-green-500/8 border-green-500/25 text-green-300"
              : "bg-orange-500/8 border-orange-500/25 text-orange-200"
          }`}
        >
          <span className="font-bold mr-1">
            {isCorrect ? "✓ LOCKED_IN — " : "✗ SIGNAL_ADJUST — "}
          </span>
          {q.explain}
        </div>
      )}

      {showAdvance && (
        <button
          type="button"
          onClick={advance}
          className="w-full btn-neon-pink py-4 text-xs font-bold tracking-widest rounded-xl touch-manipulation"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          {idx < total - 1 ? "ถัดไป ▶" : "เข้าสู่ช่วงเขียน ▶"}
        </button>
      )}
    </div>
  );
}
