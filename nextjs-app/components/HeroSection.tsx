"use client";

import { useEffect, useState } from "react";

const TYPING_TEXTS = [
  "LEARN AI THROUGH COMBAT",
  "COMPLETE MISSIONS. GAIN XP.",
  "EVOLVE YOUR AI KNOWLEDGE",
  "BEGIN YOUR NEURAL JOURNEY",
];

export default function HeroSection() {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = TYPING_TEXTS[textIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setDisplayText(current.slice(0, charIndex + 1));
          setCharIndex((c) => c + 1);
          if (charIndex + 1 === current.length) {
            setTimeout(() => setIsDeleting(true), 1800);
          }
        } else {
          setDisplayText(current.slice(0, charIndex - 1));
          setCharIndex((c) => c - 1);
          if (charIndex - 1 === 0) {
            setIsDeleting(false);
            setTextIndex((t) => (t + 1) % TYPING_TEXTS.length);
          }
        }
      },
      isDeleting ? 40 : 80
    );
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex]);

  return (
    <section className="relative min-h-screen flex items-center justify-center cyber-grid overflow-hidden">
      {/* Background glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/3 rounded-full blur-3xl pointer-events-none" />

      {/* Scan line animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
          style={{ animation: "scanMove 6s linear infinite" }}
        />
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/5 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-glow-pulse" />
          <span
            className="text-xs tracking-widest text-cyan-400"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            SYSTEM ONLINE — BETA ACCESS OPEN
          </span>
        </div>

        {/* Main title */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-none"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          <span className="neon-text-cyan animate-flicker">NEURAL</span>
          <br />
          <span className="neon-text-pink">QUEST</span>
        </h1>

        {/* Typing subtitle */}
        <div
          className="h-8 mb-8 flex items-center justify-center"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span className="text-sm sm:text-base md:text-lg text-gray-300 tracking-widest">
            {displayText}
            <span className="inline-block w-0.5 h-4 bg-cyan-400 ml-1 animate-pulse" />
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto mb-12 leading-relaxed">
          แพลตฟอร์มเรียนรู้ AI สไตล์เกม RPG ไซเบอร์พังก์
          <br />
          เรียนรู้ผ่านภารกิจ สะสม XP และพัฒนา AI ของคุณ
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            className="btn-neon-pink px-8 py-4 text-sm font-bold tracking-widest rounded-lg w-full sm:w-auto"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            ▶ START MISSION
          </button>
          <button
            className="btn-neon-cyan px-8 py-4 text-sm font-bold tracking-widest rounded-lg w-full sm:w-auto"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            VIEW DEMO
          </button>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto">
          {[
            { value: "24+", label: "MISSIONS" },
            { value: "8", label: "AI WORLDS" },
            { value: "FREE", label: "TO PLAY" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div
                className="text-2xl sm:text-3xl font-black neon-text-cyan mb-1"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                {value}
              </div>
              <div
                className="text-xs text-gray-500 tracking-widest"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050510] to-transparent pointer-events-none" />
    </section>
  );
}