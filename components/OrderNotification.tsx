"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  productName: string;
  onClose: () => void;
}

export default function OrderNotification({ productName, onClose }: Props) {
  const [visible, setVisible] = useState(false);

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 30);
    const t2 = setTimeout(() => setVisible(false), 1850);
    const t3 = setTimeout(() => onCloseRef.current(), 2200);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed inset-0 z-[60] flex items-center justify-center transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="absolute inset-0 bg-overlay/40" />

      <div
        className={`relative mx-4 flex w-full max-w-sm flex-col items-center gap-4 rounded-3xl bg-surface px-10 py-8 shadow-modal transition-transform duration-300 ${
          visible ? "translate-y-0 scale-100" : "translate-y-5 scale-95"
        }`}
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success shadow-card">
          <svg
            aria-hidden
            className="h-10 w-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="text-center">
          <p className="text-lg font-extrabold text-success-ink">Added to Order</p>
          <p className="mt-1 text-base font-bold text-ink">{productName}</p>
        </div>
      </div>
    </div>
  );
}
