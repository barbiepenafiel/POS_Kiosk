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
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-white/15 text-xl ring-1 ring-inset ring-white/20 backdrop-blur">
              ⚡
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
