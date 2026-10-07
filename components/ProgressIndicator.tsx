interface Step {
  number: number;
  label: string;
}

const STEPS: Step[] = [
  { number: 1, label: "Order" },
  { number: 2, label: "Review" },
  { number: 3, label: "Payment" },
  { number: 4, label: "Receipt" },
];

interface Props {
  currentStep: 1 | 2 | 3 | 4;
}

export default function ProgressIndicator({ currentStep }: Props) {
  return (
    <div className="flex items-center justify-center gap-0 select-none">
      {STEPS.map((step, idx) => (
        <div key={step.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                step.number < currentStep
                  ? "bg-yellow-400 border-yellow-400 text-blue-900"
                  : step.number === currentStep
                  ? "bg-white border-white text-blue-900"
                  : "bg-white/10 border-white/30 text-white/40"
              }`}
            >
              {step.number < currentStep ? "✓" : step.number}
            </div>
            <span
              className={`mt-1 text-xs font-semibold ${
                step.number === currentStep
                  ? "text-white"
                  : step.number < currentStep
                  ? "text-yellow-300"
                  : "text-white/40"
              }`}
            >
              {step.label}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div
              className={`h-0.5 w-10 mx-1 mb-4 transition-colors ${
                step.number < currentStep ? "bg-yellow-400" : "bg-white/20"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
