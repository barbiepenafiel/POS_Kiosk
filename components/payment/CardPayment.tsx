"use client";

import { useEffect, useRef, useState } from "react";
import { formatCurrency } from "@/lib/utils";

interface Props {
  totalAmount: number;
  onConfirm: () => void;
}

export default function CardPayment({ totalAmount, onConfirm }: Props) {
  const [processing, setProcessing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Don't fire onConfirm after the component is gone (e.g. method switched mid-swipe).
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const handleProcess = () => {
    if (processing) return;
    setProcessing(true);
    timer.current = setTimeout(() => {
      setProcessing(false);
      onConfirm();
    }, 2200);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
      {/* Card mock — fixed dark gradient, intentional in both themes */}
      <div className="flex w-full flex-col justify-between gap-6 rounded-kiosk bg-gradient-to-br from-header-via to-header-from p-5 text-white shadow-card sm:w-64 sm:flex-shrink-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[0.6rem] uppercase tracking-widest text-white/60">
              Campus Store Card
            </p>
            <p className="mt-0.5 text-sm font-bold">Payment Terminal</p>
          </div>
          <span aria-hidden className="text-xl">
            💳
          </span>
        </div>
        <p className="font-mono text-base tracking-widest">•••• •••• •••• 4821</p>
        <div className="flex items-end justify-between gap-2 text-xs">
          <div>
            <p className="text-[0.6rem] uppercase text-white/60">Cardholder</p>
            <p className="font-semibold">CUSTOMER</p>
          </div>
          <div className="text-right">
            <p className="text-[0.6rem] uppercase text-white/60">Exp</p>
            <p className="font-semibold">12/28</p>
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="rounded-kiosk bg-brand-soft px-4 py-3 text-center">
          <p className="text-[0.65rem] font-bold uppercase tracking-wider text-ink-soft">
            Amount Due
          </p>
          <p className="text-3xl font-black tabular-nums text-brand-ink">
            {formatCurrency(totalAmount)}
          </p>
        </div>

        <div
          aria-live="polite"
          className="flex min-h-[7rem] flex-col items-center justify-center gap-2 rounded-kiosk border border-line bg-surface-sunken px-4 py-4 text-center"
        >
          {processing ? (
            <>
              <div className="h-9 w-9 animate-spin rounded-full border-4 border-line border-t-brand" />
              <p className="text-sm font-bold text-brand-ink">
                Processing payment…
              </p>
              <p className="text-xs font-medium text-ink-faint">
                Please do not remove your card.
              </p>
            </>
          ) : (
            <>
              <span aria-hidden className="text-2xl">
                💳
              </span>
              <p className="text-sm font-bold text-ink">
                Tap, insert, or swipe your card.
              </p>
              <p className="text-xs font-medium text-ink-faint">
                This is a simulated terminal.
              </p>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={handleProcess}
          disabled={processing}
          className="flex min-h-[3.25rem] w-full items-center justify-center rounded-kiosk bg-brand text-base font-extrabold text-ink-invert shadow-card transition-transform active:scale-[0.98] disabled:bg-surface disabled:text-ink-faint disabled:shadow-none disabled:ring-1 disabled:ring-line"
        >
          {processing ? "Processing…" : "Process Payment"}
        </button>
      </div>
    </div>
  );
}
