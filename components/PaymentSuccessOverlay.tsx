"use client";

import { ReactNode } from "react";

interface Props {
  visible: boolean;
  title: string;
  subtitle?: string;
  /** Optional detail rows rendered in a tinted panel. */
  children?: ReactNode;
  /** Milliseconds for the auto-dismiss bar; omit to hide the bar. */
  progressMs?: number;
  footnote?: string;
}

/** Shared "payment confirmed" modal used by the payment and receipt screens so
 *  the two moments look identical. */
export default function PaymentSuccessOverlay({
  visible,
  title,
  subtitle,
  children,
  progressMs,
  footnote,
}: Props) {
  return (
    <div
      role="status"
      aria-live="assertive"
      className={`pointer-events-none fixed inset-0 z-[70] flex items-center justify-center transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="absolute inset-0 bg-overlay/50" />

      <div
        className={`relative mx-4 flex w-full max-w-sm flex-col items-center gap-4 rounded-3xl bg-surface px-8 py-8 shadow-modal transition-transform duration-500 ${
          visible ? "translate-y-0 scale-100" : "translate-y-6 scale-95"
        }`}
      >
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-success shadow-card">
          <svg
            aria-hidden
            className={`h-12 w-12 text-white transition-transform duration-500 delay-150 ${
              visible ? "scale-100" : "scale-50"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="text-center">
          <p className="text-2xl font-black text-success-ink">{title}</p>
          {subtitle && (
            <p className="mt-1 text-sm font-medium text-ink-soft">{subtitle}</p>
          )}
        </div>

        {children && (
          <div className="w-full space-y-2 rounded-kiosk bg-success-soft px-4 py-3 text-sm">
            {children}
          </div>
        )}

        {footnote && (
          <p className="text-xs font-medium text-ink-faint">{footnote}</p>
        )}

        {progressMs != null && (
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken">
            <div
              className={`h-full rounded-full bg-success transition-all ease-linear ${
                visible ? "w-full" : "w-0"
              }`}
              style={{ transitionDuration: visible ? `${progressMs}ms` : "0ms" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function OverlayRow({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="font-medium text-ink-soft">{label}</span>
      <span
        className={`font-extrabold tabular-nums ${
          emphasis ? "text-success-ink" : "text-ink"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
