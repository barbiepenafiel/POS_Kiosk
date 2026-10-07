import ProgressIndicator from "@/components/ProgressIndicator";
import ThemeToggle from "@/components/ThemeToggle";

interface Props {
  step: 1 | 2 | 3 | 4;
}

export default function KioskHeader({ step }: Props) {
  return (
    <header className="relative flex-shrink-0 overflow-hidden bg-gradient-to-r from-header-from via-header-via to-header-to shadow-lift">
      {/* Soft depth, purely decorative */}
      <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 right-16 w-48 h-48 rounded-full bg-brand/25 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:justify-between">
        {/* Row 1: brand + theme toggle. Toggle is top-right on every screen. */}
        <div className="flex w-full items-center justify-between gap-3 lg:w-auto">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-inset ring-white/20 backdrop-blur">
              <svg aria-hidden viewBox="0 0 64 64" className="h-8 w-8" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Awning stripes */}
                <path d="M8 28 Q10 16 32 14 Q54 16 56 28 Z" fill="#FDE047"/>
                <path d="M8 28 Q10 16 32 14 Q54 16 56 28 Z" fill="none"/>
                {/* Awning stripes overlay */}
                <path d="M14 27 Q15 18 20 16 L18 28 Z" fill="white" opacity="0.5"/>
                <path d="M22 27 Q23 15 28 14 L26 28 Z" fill="white" opacity="0.5"/>
                <path d="M30 27 Q31 14 36 14 L34 28 Z" fill="white" opacity="0.5"/>
                <path d="M38 27 Q40 15 45 16 L42 28 Z" fill="white" opacity="0.5"/>
                <path d="M46 27 Q49 18 54 22 L50 28 Z" fill="white" opacity="0.5"/>
                {/* Awning border */}
                <path d="M6 28 Q32 26 58 28" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round"/>
                {/* Awning scallop edge */}
                <path d="M6 28 Q9 32 12 28 Q15 32 18 28 Q21 32 24 28 Q27 32 30 28 Q33 32 36 28 Q39 32 42 28 Q45 32 48 28 Q51 32 54 28 Q57 32 58 28" fill="#FDE047" stroke="#FDE047" strokeWidth="1"/>
                {/* Support poles */}
                <rect x="13" y="28" width="3" height="14" rx="1.5" fill="white" opacity="0.8"/>
                <rect x="48" y="28" width="3" height="14" rx="1.5" fill="white" opacity="0.8"/>
                {/* Counter top */}
                <rect x="9" y="40" width="46" height="4" rx="2" fill="white" opacity="0.9"/>
                {/* Counter body */}
                <rect x="11" y="44" width="42" height="12" rx="2" fill="white" opacity="0.15"/>
                {/* Sign plaque */}
                <rect x="17" y="47" width="30" height="7" rx="2" fill="white" opacity="0.3" stroke="white" strokeWidth="0.8" strokeOpacity="0.6"/>
                {/* Base */}
                <rect x="9" y="56" width="46" height="3" rx="1.5" fill="white" opacity="0.7"/>
              </svg>
            </div>
            <div className="leading-none">
              <h1 className="text-xl font-black tracking-tight text-white sm:text-2xl">
                CampusTap<span className="text-accent">XP</span>
              </h1>
              <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white/60">
                Self-Service Kiosk
              </p>
            </div>
          </div>

          <div className="lg:hidden">
            <ThemeToggle />
          </div>
        </div>

        {/* Row 2 on mobile / right side on desktop */}
        <div className="flex w-full items-center justify-center gap-3 lg:w-auto">
          <div className="rounded-kiosk bg-white/10 px-3 py-2 ring-1 ring-inset ring-white/10 backdrop-blur sm:px-4">
            <ProgressIndicator currentStep={step} />
          </div>
          <div className="hidden lg:block">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
