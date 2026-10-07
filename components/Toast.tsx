"use client";

import { useEffect, useRef, useState } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

const STYLES = {
  success: { bg: "bg-success", icon: "✓" },
  error: { bg: "bg-danger", icon: "✕" },
  info: { bg: "bg-brand", icon: "ℹ" },
} as const;

export default function Toast({
  message,
  type = "success",
  onClose,
  duration = 2500,
}: ToastProps) {
  const [visible, setVisible] = useState(true);

  // Keep the latest onClose without restarting the dismiss timer when a parent
  // re-render hands us a new function identity.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const hide = setTimeout(() => setVisible(false), duration);
    const close = setTimeout(() => onCloseRef.current(), duration + 300);
    return () => {
      clearTimeout(hide);
      clearTimeout(close);
    };
  }, [duration]);

  const style = STYLES[type];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed left-1/2 top-4 z-[60] flex -translate-x-1/2 items-center gap-3 rounded-full py-2.5 pl-3 pr-5 text-white shadow-modal ring-1 ring-inset ring-white/15 transition-all duration-300 ${style.bg} ${
        visible
          ? "translate-y-0 opacity-100"
          : "-translate-y-3 opacity-0"
      }`}
    >
      <span
        aria-hidden
        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white/25 text-sm font-bold"
      >
        {style.icon}
      </span>
      <span className="text-sm font-bold tracking-wide">{message}</span>
    </div>
  );
}
