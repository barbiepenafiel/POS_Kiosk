"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";

interface Props {
  totalAmount: number;
  onConfirm: (amountPaid: number) => void;
}

export default function CashPayment({ totalAmount, onConfirm }: Props) {
  const [input, setInput] = useState("");

  const amountPaid = parseFloat(input) || 0;
  const change = amountPaid - totalAmount;
  const isValid = amountPaid >= totalAmount;

  const handleKey = (key: string) => {
    if (key === "Clear") {
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
    if (input.length >= 8) return;
    const next = input + key;
    if (/^\d*\.?\d{0,2}$/.test(next)) {
      setInput(next);
    }
  };

  const QUICK = [
    { label: "Exact", value: totalAmount },
    { label: "₱200", value: 200 },
    { label: "₱500", value: 500 },
    { label: "₱1,000", value: 1000 },
  ];

  const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "Clear", "0", "⌫"];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-4 gap-2">
        {QUICK.map((q) => (
          <button
            key={q.label}
            onClick={() => setInput(q.value.toFixed(2))}
            className="py-3 rounded-xl bg-blue-50 text-blue-700 font-semibold text-sm hover:bg-blue-100 active:bg-blue-200 transition-colors"
          >
            {q.label}
          </button>
        ))}
      </div>

      <div className="bg-gray-50 rounded-2xl p-4 text-center">
        <p className="text-sm text-gray-500 mb-1">Amount Paid</p>
        <p className="text-4xl font-extrabold text-gray-800 min-h-[3rem]">
          ₱{input || "0.00"}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {KEYS.map((k) => (
          <button
            key={k}
            onClick={() => handleKey(k)}
            className={`py-4 rounded-2xl text-xl font-bold transition-all active:scale-95 ${
              k === "Clear"
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : k === "⌫"
                ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                : "bg-white text-gray-800 shadow-sm hover:bg-gray-50 border border-gray-200"
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Amount Due</span>
          <span className="font-bold">{formatCurrency(totalAmount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Amount Paid</span>
          <span className="font-bold">{formatCurrency(amountPaid)}</span>
        </div>
        <div className="flex justify-between border-t pt-2">
          <span className="font-bold text-lg">Change</span>
          <span className={`font-extrabold text-xl ${isValid ? "text-green-600" : "text-red-500"}`}>
            {isValid ? formatCurrency(change) : "—"}
          </span>
        </div>
      </div>

      {!isValid && amountPaid > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
          <p className="text-red-600 font-semibold text-sm">Insufficient payment.</p>
          <p className="text-red-500 text-xs mt-0.5">
            Please enter at least {formatCurrency(totalAmount)}.
          </p>
        </div>
      )}

      <button
        onClick={() => onConfirm(amountPaid)}
        disabled={!isValid}
        className="w-full py-5 rounded-2xl text-xl font-extrabold text-white bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors shadow-lg"
      >
        Pay Now
      </button>
    </div>
  );
}
