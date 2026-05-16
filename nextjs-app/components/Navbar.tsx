"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "HOME", href: "/" },
  { label: "HEROES", href: "/heroes" },
  { label: "DASHBOARD", href: "/dashboard" },
  { label: "MISSIONS", href: "#" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 relative">
              <div className="absolute inset-0 bg-cyan-400 rounded-sm rotate-45 opacity-80" />
              <div className="absolute inset-1 bg-[#050510] rounded-sm rotate-45" />
              <div className="absolute inset-2 bg-cyan-400 rounded-sm rotate-45 opacity-60" />
            </div>
            <span
              className="text-lg font-black tracking-widest neon-text-cyan"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              NEURAL<span className="neon-text-pink">QUEST</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className={`text-xs font-semibold tracking-widest transition-colors duration-200 ${
                  pathname === href
                    ? "neon-text-cyan"
                    : "text-gray-400 hover:text-cyan-400"
                }`}
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <span
              className="text-xs text-gray-500 tracking-widest"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              v0.1.0-BETA
            </span>
            <Link href="/dashboard" className="btn-neon-cyan px-5 py-2 text-xs font-bold tracking-widest rounded">
              PLAY NOW
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-cyan-400 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 space-y-1">
              <span
                className={`block h-0.5 bg-current transition-transform duration-200 ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`}
              />
              <span
                className={`block h-0.5 bg-current transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 bg-current transition-transform duration-200 ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-cyan-500/20 bg-[#050510]/95 backdrop-blur-lg px-4 py-4 space-y-3">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className={`block text-xs font-semibold tracking-widest py-2 transition-colors ${
                pathname === href ? "neon-text-cyan" : "text-gray-400 hover:text-cyan-400"
              }`}
              style={{ fontFamily: "var(--font-orbitron)" }}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link href="/dashboard" className="btn-neon-cyan block w-full py-2 text-xs font-bold tracking-widest rounded mt-2 text-center">
            PLAY NOW
          </Link>
        </div>
      )}
    </nav>
  );
}
