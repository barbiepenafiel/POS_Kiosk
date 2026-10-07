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
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                step.number < currentStep
                  ? "bg-green-500 border-green-500 text-white"
                  : step.number === currentStep
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-white border-gray-300 text-gray-400"
              }`}
            >
              {step.number < currentStep ? "✓" : step.number}
            </div>
            <span
              className={`mt-1 text-xs font-medium ${
                step.number === currentStep
                  ? "text-blue-600"
                  : step.number < currentStep
                  ? "text-green-600"
                  : "text-gray-400"
              }`}
            >
              {step.label}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div
              className={`h-0.5 w-12 mx-1 mb-4 transition-colors ${
                step.number < currentStep ? "bg-green-500" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
