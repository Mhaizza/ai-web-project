"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// ─── Data ─────────────────────────────────────────────────────────────────────

const HERO_PREVIEWS = [
  { avatar: "🧙‍♂️", name: "PROMPT MAGE", color: "#00f5ff", role: "Mage", faction: "FREE AI" },
  { avatar: "🎯", name: "DATA HUNTER", color: "#ff6b00", role: "Marksman", faction: "ROGUE NET" },
  { avatar: "⚙️", name: "AUTO ENGINEER", color: "#00ff88", role: "Tank", faction: "FREE AI" },
  { avatar: "🗡️", name: "NEURAL ASSASSIN", color: "#ff0080", role: "Assassin", faction: "ROGUE NET" },
  { avatar: "✨", name: "CREATOR IDOL", color: "#bf00ff", role: "Support", faction: "CREATOR CIRCUIT" },
];

const FACTIONS = [
  { icon: "⚡", name: "FREE AI", color: "#00f5ff" },
  { icon: "💀", name: "ROGUE NET", color: "#ff2d55" },
  { icon: "✨", name: "CREATOR", color: "#bf00ff" },
];

const TYPING_TEXTS = [
  "LEARN AI THROUGH COMBAT",
  "COMPLETE MISSIONS. GAIN XP.",
  "EVOLVE YOUR AI KNOWLEDGE",
  "BEGIN YOUR NEURAL JOURNEY",
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function HeroSection() {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeHero, setActiveHero] = useState(0);
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; size: number; speed: number; opacity: number }[]
  >([]);

  // Rotate active hero every 2.5s
  useEffect(() => {
    const t = setInterval(() => {
      setActiveHero((h) => (h + 1) % HERO_PREVIEWS.length);
    }, 2500);
    return () => clearInterval(t);
  }, []);

  // Generate floating particles on mount
  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.5 + 1,
        speed: Math.random() * 9 + 5,
        opacity: Math.random() * 0.3 + 0.07,
      }))
    );
  }, []);

  // Typing effect
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

  const hero = HERO_PREVIEWS[activeHero];

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#050510" }}
    >
      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none transition-colors duration-700"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: hero.color,
            opacity: p.opacity,
            animation: `float ${p.speed}s ease-in-out infinite`,
            animationDelay: `${p.id * 0.28}s`,
          }}
        />
      ))}

      {/* Ambient blobs */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none transition-colors duration-700"
        style={{ background: hero.color }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full opacity-[0.07] blur-3xl pointer-events-none transition-colors duration-700"
        style={{ background: hero.color }}
      />

      {/* Cyber grid */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />

      {/* Scan line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent"
          style={{ animation: "scanMove 6s linear infinite" }}
        />
      </div>

      <div className="relative z-10 text-center px-4 max-w-lg mx-auto pt-8 pb-10">

        {/* System badge */}
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/5 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-glow-pulse" />
          <span className="text-[10px] tracking-widest text-cyan-400 font-bold">
            SYSTEM ONLINE — BETA ACCESS OPEN
          </span>
        </div>

        {/* Main title */}
        <h1
          className="text-5xl sm:text-7xl font-black mb-4 leading-none tracking-wider"
        >
          <span className="neon-text-cyan animate-flicker">NEURAL</span>
          <br />
          <span className="neon-text-pink">QUEST</span>
        </h1>

        {/* Typing subtitle */}
        <div className="h-7 mb-8 flex items-center justify-center">
          <span className="text-sm sm:text-base text-white/60 tracking-widest font-mono">
            {displayText}
            <span className="inline-block w-0.5 h-4 ml-1 animate-pulse" style={{ background: hero.color }} />
          </span>
        </div>

        {/* ── Hero carousel ── */}
        <div className="mb-8">
          <div className="flex justify-center items-end gap-2 mb-3">
            {HERO_PREVIEWS.map((h, i) => {
              const isActive = i === activeHero;
              return (
                <button
                  key={h.name}
                  onClick={() => setActiveHero(i)}
                  className="relative rounded-2xl overflow-hidden transition-all duration-400 focus:outline-none active:scale-95"
                  style={{
                    width: isActive ? "68px" : "44px",
                    height: isActive ? "84px" : "56px",
                    transform: isActive ? "translateY(-10px)" : "translateY(0)",
                    boxShadow: isActive
                      ? `0 0 0 2px ${h.color}, 0 0 24px ${h.color}66`
                      : "0 0 0 1px rgba(255,255,255,0.08)",
                    background: `linear-gradient(155deg, ${h.color}22 0%, #050510 70%)`,
                  }}
                >
                  <div className="absolute inset-0 cyber-grid opacity-20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="select-none transition-all duration-300"
                      style={{
                        fontSize: isActive ? "30px" : "20px",
                        filter: `drop-shadow(0 0 8px ${h.color})`,
                      }}
                    >
                      {h.avatar}
                    </span>
                  </div>
                  {isActive && (
                    <div
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ background: h.color, boxShadow: `0 0 6px ${h.color}` }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active hero label */}
          <div className="h-5 flex items-center justify-center">
            <span
              className="text-[10px] font-bold tracking-[0.25em] transition-all duration-300 animate-glow-pulse"
              style={{ color: hero.color }}
            >
              {hero.avatar} {hero.name} · {hero.role.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Faction pills */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {FACTIONS.map((f) => (
            <div
              key={f.name}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full"
              style={{
                background: `${f.color}0d`,
                border: `1px solid ${f.color}28`,
              }}
            >
              <span
                className="text-sm"
                style={{ filter: `drop-shadow(0 0 4px ${f.color})` }}
              >
                {f.icon}
              </span>
              <span
                className="text-[9px] font-bold tracking-widest"
                style={{ color: f.color }}
              >
                {f.name}
              </span>
            </div>
          ))}
        </div>

        {/* Description */}
        <p className="text-white/38 text-sm max-w-sm mx-auto mb-8 leading-relaxed">
          แพลตฟอร์มเรียนรู้ AI สไตล์เกม RPG ไซเบอร์พังก์
          <br />
          เลือกฮีโร่ · เรียนรู้ผ่านภารกิจ · สะสม XP · พัฒนา AI ของคุณ
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
          <Link
            href="/heroes"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm tracking-widest relative overflow-hidden active:scale-95 transition-all duration-200 focus:outline-none text-center"
            style={{
              background: `linear-gradient(135deg, ${hero.color}, ${hero.color}cc)`,
              color: "#050510",
              boxShadow: `0 0 24px ${hero.color}88, 0 0 48px ${hero.color}33`,
            }}
          >
            {/* Shimmer */}
            <span
              className="absolute inset-0 opacity-25"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)",
                animation: "shimmer 2.2s ease-in-out infinite",
              }}
            />
            <span className="relative">⚡ SELECT YOUR HERO</span>
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm tracking-widest transition-all duration-200 active:scale-95 focus:outline-none text-center"
            style={{
              background: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.65)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            ▶ ENTER DASHBOARD
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
          {[
            { value: "5", label: "HEROES" },
            { value: "6+", label: "MISSIONS" },
            { value: "FREE", label: "TO PLAY" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div
                className="text-2xl font-black mb-0.5 transition-colors duration-700"
                style={{ color: hero.color, textShadow: `0 0 14px ${hero.color}` }}
              >
                {value}
              </div>
              <div className="text-[9px] text-white/28 tracking-widest">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050510] to-transparent pointer-events-none" />
    </section>
  );
}
