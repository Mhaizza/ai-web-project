"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";

/**
 * Floating reward toast — appears after any `rewardMission` call.
 * Mounts globally inside the root layout.
 */
export default function RewardToast() {
  const lastReward = useGameStore((s) => s.lastReward);
  const clearLastReward = useGameStore((s) => s.clearLastReward);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!lastReward) return;
    setOpen(true);
    const t = setTimeout(() => {
      setOpen(false);
      setTimeout(() => clearLastReward(), 400);
    }, 4500);
    return () => clearTimeout(t);
  }, [lastReward, clearLastReward]);

  return (
    <AnimatePresence>
      {open && lastReward && (
        <motion.div
          initial={{ opacity: 0, y: -24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
          className="fixed top-20 right-4 z-[60] max-w-xs"
        >
          <div
            className="glass-card rounded-2xl p-4 border border-cyan-500/40"
            style={{
              boxShadow:
                "0 0 30px rgba(0,245,255,0.25), 0 0 60px rgba(191,0,255,0.15)",
            }}
          >
            <div
              className="text-xs text-cyan-400 tracking-widest mb-2"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              // REWARD_RECEIVED
            </div>
            {lastReward.missionTitle && (
              <div
                className="text-sm font-black text-white mb-2 leading-tight"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                {lastReward.missionTitle}
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 tracking-widest">
                  ⚡ XP
                </span>
                <span
                  className="text-base font-black text-yellow-400"
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  +{lastReward.xp}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 tracking-widest">
                  💎 CREDITS
                </span>
                <span
                  className="text-base font-black text-purple-400"
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  +{lastReward.credits}
                </span>
              </div>
              {lastReward.leveledUp > 0 && (
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.25, type: "spring" }}
                  className="mt-2 px-3 py-2 rounded-lg bg-gradient-to-r from-pink-500/20 to-cyan-500/20 border border-pink-500/40 text-center"
                >
                  <div
                    className="text-xs tracking-widest neon-text-pink font-black"
                    style={{ fontFamily: "var(--font-orbitron)" }}
                  >
                    ★ LEVEL UP ★
                  </div>
                  <div
                    className="text-xs text-gray-300 mt-0.5"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    LVL {lastReward.newLevel - lastReward.leveledUp} →{" "}
                    <span className="text-cyan-400 font-black">
                      LVL {lastReward.newLevel}
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
