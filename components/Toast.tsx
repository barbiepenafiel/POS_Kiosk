"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type = "success",
  onClose,
  duration = 2500,
}: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles =
    type === "success"
      ? { bar: "bg-gradient-to-r from-blue-800 to-slate-800", icon: "✓", accent: "text-yellow-300" }
      : type === "error"
      ? { bar: "bg-gradient-to-r from-red-700 to-red-800", icon: "✕", accent: "text-red-200" }
      : { bar: "bg-gradient-to-r from-blue-700 to-blue-900", icon: "ℹ", accent: "text-blue-200" };

  return (
    <div
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 pl-4 pr-6 py-3 rounded-2xl text-white shadow-2xl border border-white/10 backdrop-blur transition-all duration-300 ${styles.bar} ${
        visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-3 scale-95"
      }`}
    >
      <span className={`w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm flex-shrink-0 ${styles.accent}`}>
        {styles.icon}
      </span>
      <span className="text-sm font-semibold tracking-wide">{message}</span>
    </div>
  );
}
