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
    <ol
      className="flex select-none items-start justify-center"
      aria-label={`Step ${currentStep} of ${STEPS.length}`}
    >
      {STEPS.map((step, idx) => {
        const done = step.number < currentStep;
        const current = step.number === currentStep;

        return (
          <li key={step.number} className="flex items-start">
            <div className="flex w-14 flex-col items-center gap-1 sm:w-16">
              <span
                aria-current={current ? "step" : undefined}
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold ${
                  done
                    ? "border-accent bg-accent text-header-from"
                    : current
                      ? "border-white bg-white text-header-from shadow-sm"
                      : "border-white/25 bg-white/5 text-white/45"
                }`}
              >
                {done ? "✓" : step.number}
              </span>
              <span
                className={`text-[0.7rem] font-semibold leading-tight ${
                  current
                    ? "text-white"
                    : done
                      ? "text-accent"
                      : "text-white/45"
                }`}
              >
                {step.label}
              </span>
            </div>

            {idx < STEPS.length - 1 && (
              <span
                aria-hidden
                className={`mt-4 -mx-1 h-0.5 w-4 rounded-full sm:w-6 ${
                  done ? "bg-accent" : "bg-white/20"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
