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
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-4 gap-2">
        {QUICK.map((q) => (
          <button
            key={q.label}
            onClick={() => setInput(q.value.toFixed(2))}
            className="py-2 rounded-xl bg-blue-50 text-blue-700 font-semibold text-sm hover:bg-blue-100 active:bg-blue-200 transition-colors"
          >
            {q.label}
          </button>
        ))}
      </div>

      <div className="bg-gray-50 rounded-xl px-4 py-2 text-center">
        <p className="text-xs text-gray-500">Amount Paid</p>
        <p className="text-3xl font-extrabold text-gray-800">
          ₱{input || "0.00"}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {KEYS.map((k) => (
          <button
            key={k}
            onClick={() => handleKey(k)}
            className={`py-3 rounded-xl text-lg font-bold transition-all active:scale-95 ${
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

      <div className="bg-gray-50 rounded-xl px-4 py-2 flex gap-4 justify-between text-sm">
        <div className="flex justify-between flex-1">
          <span className="text-gray-500">Due</span>
          <span className="font-bold">{formatCurrency(totalAmount)}</span>
        </div>
        <div className="w-px bg-gray-200" />
        <div className="flex justify-between flex-1">
          <span className="font-bold">Change</span>
          <span className={`font-extrabold ${isValid ? "text-green-600" : "text-red-400"}`}>
            {isValid ? formatCurrency(change) : "—"}
          </span>
        </div>
      </div>

      <button
        onClick={() => onConfirm(amountPaid)}
        disabled={!isValid}
        className="w-full py-3.5 rounded-2xl text-base font-extrabold text-white bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-slate-900 disabled:bg-gradient-to-r disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all shadow-lg"
      >
        {isValid ? `Confirm Payment · ${formatCurrency(amountPaid)}` : "Enter Amount to Pay"}
      </button>
    </div>
  );
}
