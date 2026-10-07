"use client";

import { useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";
import { formatCurrency, generateQRReference } from "@/lib/utils";

interface Props {
  totalAmount: number;
  onConfirm: () => void;
}

const STEPS = [
  "Open GCash, Maya, or any QR payment app.",
  "Tap Scan QR and point at the code.",
  "Check the amount and reference number.",
  "Approve, then tap Confirm below.",
];

export default function QRPayment({ totalAmount, onConfirm }: Props) {
  const ref = useMemo(() => generateQRReference(), []);
  const qrValue = `CAMPUSTAPXP|${ref}|${totalAmount.toFixed(2)}|PHP`;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
      {/* QR — always on a white plate so it scans in dark mode too */}
      <div className="flex flex-col items-center gap-2.5 sm:flex-shrink-0">
        <div className="rounded-kiosk border-4 border-ink bg-white p-3.5 shadow-card">
          <QRCodeSVG
            value={qrValue}
            size={168}
            bgColor="#ffffff"
            fgColor="#0f172a"
            level="H"
            includeMargin={false}
          />
        </div>
        <div className="rounded-xl bg-surface-sunken px-3 py-1.5 text-center">
          <p className="text-[0.6rem] font-bold uppercase tracking-wider text-ink-faint">
            Reference No.
          </p>
          <p className="font-mono text-sm font-bold tracking-wider text-ink">
            {ref}
          </p>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="rounded-kiosk bg-brand-soft px-4 py-3 text-center">
          <p className="text-[0.65rem] font-bold uppercase tracking-wider text-ink-soft">
            Amount to pay
          </p>
          <p className="text-3xl font-black tabular-nums text-brand-ink">
            {formatCurrency(totalAmount)}
          </p>
        </div>

        <ol className="flex flex-col gap-2 rounded-kiosk border border-line bg-surface-sunken px-4 py-3">
          {STEPS.map((step, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs text-ink-soft">
              <span
                aria-hidden
                className="mt-px flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand text-[0.65rem] font-bold text-ink-invert"
              >
                {i + 1}
              </span>
              <span className="font-medium leading-snug">{step}</span>
            </li>
          ))}
        </ol>

        <button
          type="button"
          onClick={onConfirm}
          className="flex min-h-[3.25rem] w-full items-center justify-center rounded-kiosk bg-brand text-base font-extrabold text-ink-invert shadow-card transition-transform active:scale-[0.98]"
        >
          Confirm Payment
        </button>
      </div>
    </div>
  );
}
