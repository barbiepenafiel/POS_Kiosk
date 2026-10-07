"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";

interface Props {
  totalAmount: number;
  onConfirm: () => void;
}

export default function CardPayment({ totalAmount, onConfirm }: Props) {
  const [processing, setProcessing] = useState(false);

  const handleProcess = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onConfirm();
    }, 2200);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-full max-w-sm bg-gradient-to-br from-blue-700 to-blue-900 rounded-3xl p-6 text-white shadow-xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-xs opacity-70 uppercase tracking-widest">Campus Store Card</p>
            <p className="font-bold mt-0.5">Payment Terminal</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
            💳
          </div>
        </div>
        <p className="font-mono text-xl tracking-widest mb-6">•••• •••• •••• 4821</p>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs opacity-70">CARDHOLDER</p>
            <p className="font-medium">CUSTOMER</p>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-70">EXP</p>
            <p className="font-medium">12/28</p>
          </div>
        </div>
      </div>

      <div className="w-full bg-blue-50 rounded-2xl p-5 text-center">
        <p className="text-sm text-gray-500 mb-1">Amount Due</p>
        <p className="text-4xl font-extrabold text-blue-700">{formatCurrency(totalAmount)}</p>
      </div>

      <div className="w-full bg-gray-50 rounded-2xl p-4 text-center">
        {processing ? (
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="font-semibold text-blue-700">Processing payment...</p>
            <p className="text-sm text-gray-500">Please do not remove your card.</p>
          </div>
        ) : (
          <div className="py-2">
            <p className="text-2xl mb-2">💳</p>
            <p className="font-semibold text-gray-700">Please tap, insert, or swipe your card.</p>
            <p className="text-sm text-gray-500 mt-1">This is a simulated terminal.</p>
          </div>
        )}
      </div>

      <button
        onClick={handleProcess}
        disabled={processing}
        className="w-full py-5 rounded-2xl text-xl font-extrabold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg"
      >
        {processing ? "Processing..." : "Process Payment"}
      </button>
    </div>
  );
}
