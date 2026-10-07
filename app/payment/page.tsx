"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { saveTransaction } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { PaymentMethod } from "@/types";
import ProgressIndicator from "@/components/ProgressIndicator";
import CashPayment from "@/components/payment/CashPayment";
import QRPayment from "@/components/payment/QRPayment";
import CardPayment from "@/components/payment/CardPayment";
import Toast from "@/components/Toast";

export default function PaymentPage() {
  const router = useRouter();
  const { items, totalAmount, clearCart } = useCart();
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" | "info" } | null>(null);

  if (items.length === 0) {
    router.replace("/");
    return null;
  }

  const handlePayment = async (amountPaid: number, changeAmount: number) => {
    if (processing || !method) return;
    setProcessing(true);
    try {
      const txn = await saveTransaction(items, totalAmount, method, amountPaid, changeAmount);
      clearCart();
      router.push(`/success?txn=${txn.id}&paid=${amountPaid}&change=${changeAmount}&method=${method}`);
    } catch {
      setToast({ message: "Payment failed. Please try again.", type: "error" });
    } finally {
      setProcessing(false);
    }
  };

  const METHODS: { id: PaymentMethod; label: string; icon: string; desc: string }[] = [
    { id: "Cash", label: "Cash", icon: "💵", desc: "Pay with bills and coins" },
    { id: "QR", label: "QR Payment", icon: "📱", desc: "GCash, Maya, or any QR app" },
    { id: "Card", label: "Credit / Debit Card", icon: "💳", desc: "Tap, insert, or swipe" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-slate-100">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <header className="bg-white shadow-sm px-6 py-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-extrabold text-blue-700">CS Campus Store</h1>
            <p className="text-sm text-gray-500">Self-Service Kiosk</p>
          </div>
          <ProgressIndicator currentStep={3} />
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-800">How would you like to pay?</h2>
          <p className="text-xl text-blue-700 font-bold mt-2">
            Amount Due: {formatCurrency(totalAmount)}
          </p>
        </div>

        {/* Method selector */}
        {!method && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl active:scale-95 transition-all p-6 flex flex-col items-center gap-3 border-2 border-transparent hover:border-blue-400"
              >
                <span className="text-5xl">{m.icon}</span>
                <span className="font-bold text-gray-800 text-lg">{m.label}</span>
                <span className="text-sm text-gray-500 text-center">{m.desc}</span>
              </button>
            ))}
          </div>
        )}

        {/* Payment form */}
        {method && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {METHODS.find((m) => m.id === method)?.icon}
                </span>
                <h3 className="font-bold text-xl text-gray-800">
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
          className="w-full py-4 rounded-2xl text-base font-semibold text-gray-600 bg-white border-2 border-gray-200 hover:bg-gray-50 transition-colors"
        >
          ← Back to Review
        </button>
      </main>
    </div>
  );
}
