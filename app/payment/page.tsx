"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { saveTransaction } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { PaymentMethod } from "@/types";
import KioskHeader from "@/components/KioskHeader";
import CashPayment from "@/components/payment/CashPayment";
import QRPayment from "@/components/payment/QRPayment";
import CardPayment from "@/components/payment/CardPayment";
import Toast from "@/components/Toast";

export default function PaymentPage() {
  const router = useRouter();
  const { items, totalAmount, clearCart, hydrated } = useCart();
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" | "info" } | null>(null);

  // Success notification state
  const [successData, setSuccessData] = useState<{
    txnId: string;
    amountPaid: number;
    changeAmount: number;
    visible: boolean;
  } | null>(null);

  useEffect(() => {
    if (hydrated && items.length === 0 && !successData) router.replace("/");
  }, [hydrated, items.length, successData, router]);

  if (!hydrated || (items.length === 0 && !successData)) return null;

  const handlePayment = async (amountPaid: number, changeAmount: number) => {
    if (processing || !method) return;
    setProcessing(true);
    try {
      const txn = await saveTransaction(items, totalAmount, method, amountPaid, changeAmount);
      clearCart();
      // Show success notification first
      setSuccessData({ txnId: txn.id, amountPaid, changeAmount, visible: false });
      setTimeout(() => setSuccessData((d) => d ? { ...d, visible: true } : d), 50);
      // Navigate to receipt after notification
      setTimeout(() => {
        router.push(`/receipt/${txn.id}`);
      }, 2800);
    } catch {
      setToast({ message: "Payment failed. Please try again.", type: "error" });
      setProcessing(false);
    }
  };

  const METHODS: { id: PaymentMethod; label: string; icon: string; desc: string }[] = [
    { id: "Cash", label: "Cash", icon: "💵", desc: "Pay with bills and coins" },
    { id: "QR", label: "QR Payment", icon: "📱", desc: "GCash, Maya, or any QR app" },
    { id: "Card", label: "Credit / Debit Card", icon: "💳", desc: "Tap, insert, or swipe" },
  ];

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-gradient-to-br from-slate-100 via-blue-50 to-blue-100">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Payment Success Notification */}
      {successData && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ${
            successData.visible ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Card */}
          <div
            className={`relative bg-white rounded-3xl shadow-2xl px-12 py-10 flex flex-col items-center gap-5 mx-4 max-w-sm w-full transition-all duration-500 ${
              successData.visible ? "scale-100 translate-y-0" : "scale-90 translate-y-8"
            }`}
          >
            {/* Animated checkmark */}
            <div className="relative">
              <div
                className={`absolute inset-0 rounded-full bg-green-200 transition-all duration-700 ${
                  successData.visible ? "scale-150 opacity-0" : "scale-100 opacity-60"
                }`}
              />
              <div className="w-28 h-28 rounded-full bg-green-500 flex items-center justify-center shadow-xl">
                <svg
                  className={`w-14 h-14 text-white transition-all duration-500 delay-150 ${
                    successData.visible ? "scale-100 opacity-100" : "scale-50 opacity-0"
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

            <div className="text-center space-y-1">
              <p className="text-3xl font-extrabold text-green-600">Order Successful!</p>
              <p className="text-gray-500 text-base">Payment has been confirmed</p>
            </div>

            <div className="w-full bg-green-50 rounded-2xl px-5 py-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Amount Paid</span>
                <span className="font-bold text-gray-800">{formatCurrency(successData.amountPaid)}</span>
              </div>
              {method === "Cash" && successData.changeAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Change</span>
                  <span className="font-bold text-green-600">{formatCurrency(successData.changeAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Payment</span>
                <span className="font-bold text-gray-800">{method}</span>
              </div>
            </div>

            <p className="text-xs text-gray-400">Opening your receipt...</p>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full bg-green-500 rounded-full transition-all ease-linear ${
                  successData.visible ? "w-full" : "w-0"
                }`}
                style={{ transitionDuration: successData.visible ? "2700ms" : "0ms" }}
              />
            </div>
          </div>
        </div>
      )}

      <KioskHeader step={3} />

      <main className="flex-1 overflow-y-auto max-w-3xl mx-auto w-full px-4 py-3 flex flex-col gap-3">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-gray-800">How would you like to pay?</h2>
          <p className="text-base text-blue-700 font-bold mt-1">
            Amount Due: {formatCurrency(totalAmount)}
          </p>
        </div>

        {/* Method selector */}
        {!method && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl active:scale-95 transition-all p-4 flex flex-col items-center gap-2 border-2 border-transparent hover:border-blue-400"
              >
                <span className="text-4xl">{m.icon}</span>
                <span className="font-bold text-gray-800">{m.label}</span>
                <span className="text-xs text-gray-500 text-center">{m.desc}</span>
              </button>
            ))}
          </div>
        )}

        {/* Payment form */}
        {method && (
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">
                  {METHODS.find((m) => m.id === method)?.icon}
                </span>
                <h3 className="font-bold text-base text-gray-800">
                  {METHODS.find((m) => m.id === method)?.label}
                </h3>
              </div>
              <button
                onClick={() => setMethod(null)}
                className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Change method
              </button>
            </div>

            {method === "Cash" && (
              <CashPayment
                totalAmount={totalAmount}
                onConfirm={(paid) => handlePayment(paid, paid - totalAmount)}
              />
            )}
            {method === "QR" && (
              <QRPayment
                totalAmount={totalAmount}
                onConfirm={() => handlePayment(totalAmount, 0)}
              />
            )}
            {method === "Card" && (
              <CardPayment
                totalAmount={totalAmount}
                onConfirm={() => handlePayment(totalAmount, 0)}
              />
            )}
          </div>
        )}

        <button
          onClick={() => router.back()}
          className="flex-shrink-0 w-full py-3 rounded-2xl text-base font-semibold text-gray-600 bg-white border-2 border-gray-200 hover:bg-gray-50 transition-colors"
        >
          ← Back to Review
        </button>
      </main>
    </div>
  );
}
