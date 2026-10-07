"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";

interface Props {
  totalAmount: number;
  onConfirm: (amountPaid: number) => void;
}

export default function CashPayment({ totalAmount, onConfirm }: Props) {
  const [input, setInput] = useState("");
  const [shortfall, setShortfall] = useState(false);

  const amountPaid = parseFloat(input) || 0;
  const change = amountPaid - totalAmount;
  const isValid = input !== "" && amountPaid >= totalAmount;
  const isShort = input !== "" && amountPaid < totalAmount;

  const handleKey = (key: string) => {
    setShortfall(false);
    if (key === "C") {
      setInput("");
      return;
    }
    if (key === "⌫") {
      setInput((prev) => prev.slice(0, -1));
      return;
    }
    if (key === ".") {
      if (input.includes(".")) return;
      setInput((prev) => (prev === "" ? "0." : prev + "."));
      return;
    }
    if (input.replace(".", "").length >= 8) return;
    const next = input + key;
    if (/^\d*\.?\d{0,2}$/.test(next)) setInput(next);
  };

  const QUICK = [
    { label: "Exact", value: totalAmount },
    { label: "₱100", value: 100 },
    { label: "₱500", value: 500 },
    { label: "₱1000", value: 1000 },
  ].filter((q) => q.value >= totalAmount);

  const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "⌫"];

  const handleConfirm = () => {
    if (!isValid) {
      setShortfall(true);
      return;
    }
    onConfirm(amountPaid);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Quick amounts — only ones that actually cover the bill */}
      <div className="grid grid-cols-4 gap-2">
        {QUICK.map((q) => (
          <button
            key={q.label}
            type="button"
            onClick={() => {
              setInput(q.value.toFixed(2));
              setShortfall(false);
            }}
            className="flex min-h-touch items-center justify-center rounded-xl bg-brand-soft px-2 text-sm font-bold text-brand-ink transition-opacity active:opacity-70"
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Amount display */}
      <div
        className={`rounded-kiosk border-2 bg-surface-sunken px-4 py-2.5 text-center ${
          isShort ? "border-danger" : "border-line"
        }`}
      >
        <p className="text-[0.65rem] font-bold uppercase tracking-wider text-ink-faint">
          Amount Paid
        </p>
        <p
          aria-live="polite"
          className="text-3xl font-black tabular-nums text-ink"
        >
          ₱{input || "0.00"}
        </p>
      </div>

      {/* Numpad */}
      <div className="grid grid-cols-3 gap-2">
        {KEYS.map((k) => (
          <button
            key={k}
            type="button"
            aria-label={k === "⌫" ? "Backspace" : k}
            onClick={() => handleKey(k)}
            className={`flex min-h-[3.25rem] items-center justify-center rounded-xl text-xl font-bold transition-transform active:scale-95 ${
              k === "⌫"
                ? "bg-warning-soft text-warning-ink"
                : "border border-line bg-surface text-ink"
            }`}
          >
            {k}
          </button>
        ))}
        <button
          type="button"
          onClick={() => handleKey("C")}
          className="col-span-3 flex min-h-touch items-center justify-center rounded-xl bg-danger-soft text-base font-bold text-danger-ink transition-transform active:scale-95"
        >
          Clear
        </button>
      </div>

      {/* Due / change */}
      <div className="flex items-stretch gap-3 rounded-kiosk border border-line bg-surface-sunken px-4 py-2.5 text-sm">
        <div className="flex flex-1 justify-between gap-2">
          <span className="font-medium text-ink-soft">Due</span>
          <span className="font-extrabold tabular-nums text-ink">
            {formatCurrency(totalAmount)}
          </span>
        </div>
        <div className="w-px bg-line" />
        <div className="flex flex-1 justify-between gap-2">
          <span className="font-medium text-ink-soft">Change</span>
          <span
            className={`font-extrabold tabular-nums ${
              isValid ? "text-success-ink" : "text-ink-faint"
            }`}
          >
            {isValid ? formatCurrency(change) : "—"}
          </span>
        </div>
      </div>

      {/* Insufficient-cash message */}
      {(isShort || shortfall) && (
        <p
          role="alert"
          className="rounded-xl bg-danger-soft px-4 py-2.5 text-center text-sm font-bold text-danger-ink"
        >
          {input === ""
            ? "Please enter the amount received."
            : `Insufficient amount — ${formatCurrency(
                totalAmount - amountPaid,
              )} short.`}
        </p>
      )}

      <button
        type="button"
        onClick={handleConfirm}
        aria-disabled={!isValid}
        className={`flex min-h-[3.25rem] w-full items-center justify-center rounded-kiosk px-4 text-base font-extrabold transition-transform active:scale-[0.98] ${
          isValid
            ? "bg-brand text-ink-invert shadow-card"
            : "bg-surface text-ink-faint ring-1 ring-line"
        }`}
      >
        {isValid
          ? `Confirm Payment · ${formatCurrency(amountPaid)}`
          : "Enter Amount to Pay"}
      </button>
    </div>
  );
}
