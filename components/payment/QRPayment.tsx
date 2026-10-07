"use client";

import { useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";
import { formatCurrency, generateQRReference } from "@/lib/utils";

interface Props {
  totalAmount: number;
  onConfirm: () => void;
}

export default function QRPayment({ totalAmount, onConfirm }: Props) {
  const ref = useMemo(() => generateQRReference(), []);

  // Encode payment info into the QR data string
  const qrValue = `CAMPUSTAPXP|${ref}|${totalAmount.toFixed(2)}|PHP`;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* QR Code */}
      <div className="bg-white border-4 border-gray-900 rounded-3xl p-5 shadow-xl">
        <QRCodeSVG
          value={qrValue}
          size={200}
          bgColor="#ffffff"
          fgColor="#111827"
          level="H"
          includeMargin={false}
        />
      </div>

      {/* Amount + ref */}
      <div className="w-full bg-blue-50 rounded-2xl p-5 space-y-3 text-center">
        <p className="text-sm text-gray-500 font-medium">Amount to pay</p>
        <p className="text-4xl font-extrabold text-blue-900">{formatCurrency(totalAmount)}</p>
        <div className="bg-white rounded-xl px-4 py-2 inline-block">
          <p className="text-xs text-gray-400">Reference No.</p>
          <p className="font-mono font-bold text-gray-700 tracking-wider">{ref}</p>
        </div>
      </div>

      {/* Instructions */}
      <div className="w-full bg-gray-50 rounded-2xl p-4">
        <p className="font-semibold text-gray-700 mb-3">Instructions</p>
        <ol className="space-y-2 text-sm text-gray-600">
          {[
            "Open GCash, Maya, or any QR payment app.",
            "Tap Scan QR and point at the code above.",
            "Verify the amount and reference number.",
            "Approve the payment, then tap Confirm below.",
          ].map((step, i) => (
            <li key={i} className="flex gap-2 items-start">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-900 text-white text-xs flex items-center justify-center font-bold mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <button
        onClick={onConfirm}
        className="w-full py-5 rounded-2xl text-xl font-extrabold text-white bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-slate-900 transition-all shadow-lg active:scale-95"
      >
        Confirm Payment
      </button>
    </div>
  );
}
