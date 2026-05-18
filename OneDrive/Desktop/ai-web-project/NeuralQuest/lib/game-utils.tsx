"use client";

import { useState, useEffect, useRef } from "react";

// ─── Sound System (Web Audio API) ────────────────────────────────────────────
export function playSound(type: "click" | "correct" | "wrong" | "complete" | "levelup") {
  try {
    type AudioContextType = typeof AudioContext;
    const Ctx: AudioContextType =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: AudioContextType }).webkitAudioContext;
    const ctx = new Ctx();

    const tone = (
      freq: number,
      oscType: OscillatorType,
      dur: number,
      vol = 0.18,
      delay = 0
    ) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = oscType;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
      gain.gain.setValueAtTime(vol, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + dur);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + dur + 0.01);
    };

    switch (type) {
      case "click":
        tone(880, "sine", 0.06, 0.12);
        break;
      case "correct":
        tone(523, "sine", 0.13, 0.22);
        tone(659, "sine", 0.13, 0.22, 0.1);
        tone(784, "sine", 0.18, 0.22, 0.2);
        break;
      case "wrong":
        tone(220, "sawtooth", 0.22, 0.16);
        tone(185, "sawtooth", 0.18, 0.12, 0.14);
        break;
      case "complete":
        [523, 659, 784, 1047, 1319].forEach((f, i) =>
          tone(f, "sine", 0.28, 0.28, i * 0.09)
        );
        break;
      case "levelup":
        [392, 523, 659, 784, 1047].forEach((f, i) =>
          tone(f, "sine", 0.22, 0.3, i * 0.08)
        );
        break;
    }
  } catch {
    // AudioContext blocked (e.g. no user gesture yet) — silent fail
  }
}

// ─── Typewriter with skip ─────────────────────────────────────────────────────
export function useTypewriter(text: string, speed = 22) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const skip = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setDisplayed(text);
    setDone(true);
  };

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    intervalRef.current = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setDone(true);
      }
    }, speed);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [text, speed]);

  return { displayed, done, skip };
}

// ─── Count-up number animation ────────────────────────────────────────────────
export function useCountUp(target: number, duration = 1100, startDelay = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf: number;
    const startTime = performance.now() + startDelay;
    const tick = (now: number) => {
      if (now < startTime) { raf = requestAnimationFrame(tick); return; }
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, startDelay]);
  return value;
}

// ─── Floating XP numbers ─────────────────────────────────────────────────────
export interface Floater {
  id: number;
  value: string;
  color: string;
  x: number;
  y: number;
}

export function XPFloaters({ floaters }: { floaters: Floater[] }) {
  return (
    <>
      {floaters.map((f) => (
        <div
          key={f.id}
          className="xp-floater font-black text-xl select-none"
          style={{
            left: f.x,
            top: f.y,
            color: f.color,
            fontFamily: "var(--font-orbitron)",
            textShadow: `0 0 12px ${f.color}, 0 0 24px ${f.color}`,
          }}
        >
          {f.value}
        </div>
      ))}
    </>
  );
}

// ─── Screen flash ────────────────────────────────────────────────────────────
export function ScreenFlash({
  type,
  flashKey,
}: {
  type: "correct" | "wrong" | "complete" | null;
  flashKey: number;
}) {
  if (!type) return null;
  const bg = {
    correct: "rgba(34,197,94,0.07)",
    wrong: "rgba(239,68,68,0.08)",
    complete: "rgba(0,245,255,0.09)",
  }[type];
  return (
    <div
      key={flashKey}
      className="fixed inset-0 z-40 screen-flash"
      style={{ background: bg }}
    />
  );
}

// ─── AI Commentary lines ──────────────────────────────────────────────────────
export const CORRECT_LINES = [
  "// NEURAL SIGNAL CONFIRMED ✓",
  "// PATTERN MATCH: 100% ✓",
  "// SYNAPSE ACTIVATED ✓",
  "// DATA STREAM VERIFIED ✓",
  "// ALGORITHM CALIBRATED ✓",
];

export const WRONG_LINES = [
  "// SIGNAL MISMATCH — RECALIBRATING...",
  "// PATTERN NOT FOUND — RETRY",
  "// SYSTEM: REVIEW PROTOCOL",
  "// DATA CONFLICT — REPROCESSING",
  "// RECALCULATING VECTOR...",
];
