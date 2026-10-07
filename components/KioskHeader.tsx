import ProgressIndicator from "@/components/ProgressIndicator";

interface Props {
  step: 1 | 2 | 3 | 4;
}

export default function KioskHeader({ step }: Props) {
  return (
    <header className="relative bg-gradient-to-r from-blue-950 via-blue-900 to-slate-800 shadow-lg px-6 py-4 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-6 -left-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-8 right-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-inner text-xl">
            🏪
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight leading-none">
              CampusTap<span className="text-yellow-300">XP</span>
            </h1>
            <p className="text-blue-200 text-xs font-medium tracking-widest uppercase mt-0.5">
              Self-Service Kiosk
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white/10 backdrop-blur rounded-2xl px-4 py-2">
          <ProgressIndicator currentStep={step} />
        </div>
      </div>
    </header>
  );
}
