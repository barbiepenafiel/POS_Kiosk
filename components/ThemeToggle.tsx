"use client";

import { useTheme } from "@/lib/ThemeContext";

/** Segmented Light/Dark control. Both options are always visible so the active
 *  mode is obvious at a glance — no guessing what a lone icon means. Sits in the
 *  header, so it is reachable from every step of the flow. */
export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const OPTIONS = [
    { value: "light" as const, label: "Light", icon: "☀" },
    { value: "dark" as const, label: "Dark", icon: "☾" },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      className="flex items-center gap-1 rounded-full bg-white/10 p-1 ring-1 ring-inset ring-white/20 backdrop-blur"
    >
      {OPTIONS.map((opt) => {
        const active = theme === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`${opt.label} mode`}
            onClick={() => setTheme(opt.value)}
            className={`flex min-h-touch items-center gap-1.5 rounded-full px-3.5 text-sm font-bold transition-colors sm:px-4 ${
              active
                ? "bg-white text-brand-strong shadow-sm"
                : "text-white/60 active:bg-white/10"
            }`}
          >
            <span aria-hidden className="text-base leading-none">
              {opt.icon}
            </span>
            <span className="hidden sm:inline">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
