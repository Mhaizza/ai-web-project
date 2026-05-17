"use client";

import { useEffect, useState } from "react";
import { useGameStore, ENERGY_MAX } from "@/store/gameStore";
import { computeEnergy, formatCountdown } from "@/lib/level";

interface Props {
  showCountdown?: boolean;
}

export default function LiveEnergyBar({ showCountdown = true }: Props) {
  const energy = useGameStore((s) => s.energy);
  const lastEnergyAt = useGameStore((s) => s.lastEnergyAt);
  const refreshEnergy = useGameStore((s) => s.refreshEnergy);
  const hydrated = useGameStore((s) => s.hydrated);

  const [msToNext, setMsToNext] = useState<number>(0);

  useEffect(() => {
    if (!hydrated) return;

    const tick = () => {
      const { energy: e, msToNext: m } = computeEnergy(energy, lastEnergyAt);
      setMsToNext(m);
      if (e !== energy) refreshEnergy();
    };

    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [energy, lastEnergyAt, refreshEnergy, hydrated]);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-1.5">
        {Array.from({ length: ENERGY_MAX }).map((_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-sm rotate-45 transition-all duration-300 ${
              i < energy
                ? "bg-yellow-400 shadow-[0_0_6px_#facc15,0_0_12px_rgba(250,204,21,0.4)]"
                : "bg-gray-700 border border-gray-600"
            }`}
          />
        ))}
      </div>
      <span
        className="text-xs text-gray-500 tracking-widest"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        ENERGY {energy}/{ENERGY_MAX}
        {showCountdown && energy < ENERGY_MAX && (
          <span className="ml-2 text-yellow-500/70">
            +1 IN {formatCountdown(msToNext)}
          </span>
        )}
      </span>
    </div>
  );
}
