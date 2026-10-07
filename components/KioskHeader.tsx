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
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-inner">
            <svg viewBox="0 0 64 64" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
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
