"use client";

import { useEffect, useState } from "react";
import { getNextRestockDate } from "@/lib/utils";

export default function RestockCountdown() {
  // null until mounted so server and client render the same markup
  const [now, setNow] = useState<Date | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!now || dismissed) return null;

  const restockDate = getNextRestockDate(now);
  const totalSeconds = Math.max(0, Math.floor((restockDate.getTime() - now.getTime()) / 1000));

  const units = [
    { label: "Days", value: Math.floor(totalSeconds / 86400) },
    { label: "Hrs", value: Math.floor((totalSeconds % 86400) / 3600) },
    { label: "Min", value: Math.floor((totalSeconds % 3600) / 60) },
    { label: "Sec", value: totalSeconds % 60 },
  ];

  return (
    <div className="fixed bottom-24 left-4 z-40 sm:bottom-4 bg-gradient-to-r from-blue-800 to-blue-900 text-white rounded-2xl shadow-2xl border border-white/10 px-4 py-3">
      <div className="flex items-center justify-between gap-4 mb-2">
        <p className="text-sm font-bold tracking-wide">📦 Next Restock</p>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss restock countdown"
          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm font-bold transition-colors"
        >
          ✕
        </button>
      </div>
      <div className="flex gap-2">
        {units.map((unit) => (
          <div key={unit.label} className="bg-white/10 rounded-xl px-2 py-1.5 min-w-[48px] text-center">
            <p className="text-xl font-extrabold leading-none tabular-nums">
              {unit.value.toString().padStart(2, "0")}
            </p>
            <p className="text-[10px] uppercase tracking-wide text-blue-200 mt-1">{unit.label}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-blue-200 mt-2">
        {restockDate.toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric" })}
      </p>
    </div>
  );
}
