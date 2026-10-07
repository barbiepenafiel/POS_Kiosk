"use client";

import { useEffect, useState } from "react";

interface Props {
  productName: string;
  onClose: () => void;
}

export default function OrderNotification({ productName, onClose }: Props) {
  const [phase, setPhase] = useState<"enter" | "show" | "exit">("enter");

  useEffect(() => {
    // enter → show after animation settles
    const t1 = setTimeout(() => setPhase("show"), 50);
    // show → exit after 1.8 s
    const t2 = setTimeout(() => setPhase("exit"), 1850);
    // unmount after exit animation
    const t3 = setTimeout(onClose, 2200);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [onClose]);

  const visible = phase === "show";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none transition-all duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop blur */}
      <div
        className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Card */}
      <div
        className={`relative flex flex-col items-center gap-5 bg-white rounded-3xl shadow-2xl px-12 py-10 mx-4 max-w-sm w-full transition-all duration-300 ${
          visible ? "scale-100 translate-y-0" : "scale-90 translate-y-6"
        }`}
      >
        {/* Animated circle + checkmark */}
        <div className="relative w-24 h-24">
          {/* Pulse ring */}
          <span
            className={`absolute inset-0 rounded-full bg-green-200 transition-all duration-700 ${
              visible ? "scale-125 opacity-0" : "scale-100 opacity-60"
            }`}
          />
          {/* Green circle */}
          <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
            <svg
              className={`w-12 h-12 text-white transition-all duration-500 ${
                visible ? "scale-100 opacity-100" : "scale-50 opacity-0"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <div className="text-center">
          <p className="text-green-600 font-extrabold text-xl">Added to Order!</p>
          <p className="text-gray-700 font-semibold text-lg mt-1">{productName}</p>
          <p className="text-gray-400 text-sm mt-1">has been added to your cart</p>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full bg-green-500 rounded-full transition-all ease-linear ${
              visible ? "w-0" : "w-full"
            }`}
            style={{ transitionDuration: visible ? "0ms" : "1800ms" }}
          />
        </div>
      </div>
    </div>
  );
}
