import Navbar from "@/components/Navbar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import DailyQuests from "@/components/dashboard/DailyQuests";
import AICompanion from "@/components/dashboard/AICompanion";
import QuickMissions from "@/components/dashboard/QuickMissions";
import Link from "next/link";
import { DAILY_QUESTS } from "@/lib/dailyQuestsData";

function WorldMapTeaser() {
  const WORLDS = [
    { id: 1, name: "AI ORIGINS", unlocked: true, missions: 5, done: 2, color: "cyan" },
    { id: 2, name: "MACHINE MIND", unlocked: false, missions: 6, done: 0, color: "purple" },
    { id: 3, name: "DEEP NETWORK", unlocked: false, missions: 8, done: 0, color: "pink" },
  ];

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-cyan-500/10">
        <div className="flex items-center gap-3">
          <span className="text-xl">🗺️</span>
          <div>
            <div className="text-sm font-black text-white" style={{ fontFamily: "var(--font-orbitron)" }}>
              WORLD MAP
            </div>
            <div className="text-xs text-gray-500 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
              1/3 WORLDS UNLOCKED
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-3">
        {WORLDS.map((world) => (
          <div
            key={world.id}
            className={`flex items-center gap-4 p-3 rounded-xl border transition-all
              ${world.unlocked
                ? "border-cyan-500/20 bg-cyan-500/5 hover:border-cyan-500/40 cursor-pointer"
                : "border-gray-800/50 opacity-40 cursor-not-allowed"
              }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg
              ${world.unlocked ? "bg-cyan-500/15 border border-cyan-500/30" : "bg-gray-800 border border-gray-700"}`}>
              {world.unlocked ? "🌐" : "🔒"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white mb-0.5 truncate" style={{ fontFamily: "var(--font-orbitron)" }}>
                WORLD {world.id}: {world.name}
              </div>
              <div className="text-xs text-gray-500" style={{ fontFamily: "var(--font-mono)" }}>
                {world.done}/{world.missions} MISSIONS
              </div>
              {world.unlocked && (
                <div className="mt-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full"
                    style={{ width: `${(world.done / world.missions) * 100}%` }}
                  />
                </div>
              )}
            </div>
            {world.unlocked && (
              <span className="text-cyan-400 text-sm shrink-0">→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickStats() {
  const stats = [
    { icon: "⚡", value: "2,450", label: "TOTAL XP", color: "text-cyan-400" },
    { icon: "🏆", value: "12", label: "MISSIONS", color: "text-yellow-400" },
    { icon: "🔥", value: "5", label: "STREAK", color: "text-orange-400" },
    { icon: "💎", value: "340", label: "CREDITS", color: "text-purple-400" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map(({ icon, value, label, color }) => (
        <div
          key={label}
          className="glass-card rounded-xl p-4 text-center border border-gray-800/50 hover:border-cyan-500/20 transition-colors"
        >
          <div className="text-2xl mb-1">{icon}</div>
          <div className={`text-xl font-black ${color}`} style={{ fontFamily: "var(--font-orbitron)" }}>
            {value}
          </div>
          <div className="text-xs text-gray-500 tracking-widest mt-0.5" style={{ fontFamily: "var(--font-mono)" }}>
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#050510] cyber-grid">
      {/* Top navbar */}
      <Navbar />

      {/* Player top bar (below nav) */}
      <div className="pt-16">
        <DashboardTopBar />
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* Welcome banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-900/30 via-purple-900/20 to-pink-900/20 border border-cyan-500/15 p-5 sm:p-6">
          {/* BG glow */}
          <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-cyan-500/5 to-transparent pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-gray-500 tracking-widest mb-1" style={{ fontFamily: "var(--font-mono)" }}>
                // SYSTEM_WELCOME
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white mb-1" style={{ fontFamily: "var(--font-orbitron)" }}>
                ยินดีต้อนรับกลับมา, <span className="neon-text-cyan">AGENT_001</span>
              </h1>
              <p className="text-sm text-gray-400">
                คุณมี <span className="text-yellow-400 font-bold">{DAILY_QUESTS.filter(q => !q.completed).length} daily quests</span> รอดำเนินการ และ{" "}
                <span className="text-pink-400 font-bold">1 mission</span> กำลังดำเนินอยู่
              </p>
            </div>
            <Link
              href="/missions/ml-101"
              className="btn-neon-pink px-6 py-3 text-xs font-bold tracking-widest rounded-xl shrink-0 text-center"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              ▶ CONTINUE MISSION
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <QuickStats />

        {/* Main grid: left content + right sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            <DailyQuests />
            <div id="missions">
              <QuickMissions />
            </div>
          </div>

          {/* Right sidebar (1/3) */}
          <div className="space-y-6">
            <AICompanion />
            <WorldMapTeaser />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-cyan-500/10 py-6 px-4 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm font-black tracking-widest" style={{ fontFamily: "var(--font-orbitron)" }}>
            <span className="neon-text-cyan">NEURAL</span>
            <span className="neon-text-pink">QUEST</span>
          </div>
          <p className="text-xs text-gray-600 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
            © 2077 NEURALQUEST SYSTEMS — DASHBOARD v0.1.0
          </p>
        </div>
      </footer>
    </div>
  );
}
