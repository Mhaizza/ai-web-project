import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PlayerStats from "@/components/PlayerStats";
import MissionsSection from "@/components/MissionsSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050510]">
      <Navbar />

      <div className="pt-16">
        <HeroSection />
        <PlayerStats />
        <MissionsSection />
      </div>

      {/* Footer */}
      <footer className="border-t border-cyan-500/10 py-8 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div
            className="text-sm font-black tracking-widest"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            <span className="neon-text-cyan">NEURAL</span>
            <span className="neon-text-pink">QUEST</span>
          </div>
          <p
            className="text-xs text-gray-600 tracking-widest text-center"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            © 2077 NEURALQUEST SYSTEMS — ALL RIGHTS RESERVED
          </p>
          <div
            className="text-xs text-gray-600 tracking-widest"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            v0.1.0-BETA
          </div>
        </div>
      </footer>
    </main>
  );
}
