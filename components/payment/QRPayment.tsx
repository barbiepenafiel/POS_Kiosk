"use client";

import { useMemo } from "react";
import { formatCurrency, generateQRReference } from "@/lib/utils";

interface Props {
  totalAmount: number;
  onConfirm: () => void;
}

export default function QRPayment({ totalAmount, onConfirm }: Props) {
  const ref = useMemo(() => generateQRReference(), []);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="bg-white border-4 border-gray-200 rounded-2xl p-6 shadow-inner">
        <div className="w-48 h-48 bg-gray-100 rounded-xl flex flex-col items-center justify-center gap-2">
          <div className="grid grid-cols-5 gap-1 opacity-60">
            {Array.from({ length: 25 }).map((_, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-sm ${Math.random() > 0.4 ? "bg-gray-800" : "bg-gray-200"}`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">QR Placeholder</p>
        </div>
      </div>

      <div className="w-full bg-blue-50 rounded-2xl p-5 space-y-3 text-center">
        <p className="text-sm text-gray-500 font-medium">Amount to pay</p>
        <p className="text-4xl font-extrabold text-blue-700">{formatCurrency(totalAmount)}</p>
        <div className="bg-white rounded-xl px-4 py-2 inline-block">
          <p className="text-xs text-gray-400">Reference</p>
          <p className="font-mono font-bold text-gray-700">{ref}</p>
        </div>
      </div>

      <div className="w-full bg-gray-50 rounded-2xl p-4">
        <p className="font-semibold text-gray-700 mb-3">Instructions</p>
        <ol className="space-y-2 text-sm text-gray-600">
          {[
            "Scan the QR code with your payment app.",
            "Verify the payment amount.",
            "Approve the payment.",
            "Tap Confirm Payment below.",
          ].map((step, i) => (
            <li key={i} className="flex gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <button
        onClick={onConfirm}
        className="w-full py-5 rounded-2xl text-xl font-extrabold text-white bg-green-600 hover:bg-green-700 active:bg-green-800 transition-colors shadow-lg"
      >
        Confirm Payment
      </button>
    </div>
  );
}
