"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchTransactionWithItems } from "@/lib/db";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { ReceiptData } from "@/types";
import KioskHeader from "@/components/KioskHeader";
import Toast from "@/components/Toast";

export default function ReceiptPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [data, setData] = useState<ReceiptData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(true);
  const [bannerVisible, setBannerVisible] = useState(false);

  useEffect(() => {
    fetchTransactionWithItems(params.id)
      .then(setData)
      .catch(() => setError("Failed to load receipt."))
      .finally(() => setLoading(false));
  }, [params.id]);

  // Animate banner in after data loads, then out after 3 s
  useEffect(() => {
    if (!loading && data) {
      const t1 = setTimeout(() => setBannerVisible(true), 100);
      const t2 = setTimeout(() => setBannerVisible(false), 3000);
      const t3 = setTimeout(() => setShowBanner(false), 3500);
      return () => [t1, t2, t3].forEach(clearTimeout);
    }
  }, [loading, data]);

  const handleNewTransaction = () => {
    setToast("New transaction started — previous order cleared.");
    setTimeout(() => router.replace("/"), 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500">Loading receipt...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold">{error ?? "Receipt not found."}</p>
          <button onClick={() => router.replace("/")} className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl">
            Start New Transaction
          </button>
        </div>
      </div>
    );
  }

  const { transaction: txn, items } = data;

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-gradient-to-br from-slate-100 via-blue-50 to-blue-100">
      {toast && <Toast message={toast} type="success" onClose={() => setToast(null)} />}

      {/* Payment success notification overlay */}
      {showBanner && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none transition-all duration-500 ${
            bannerVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Dimmed backdrop */}
          <div className="absolute inset-0 bg-black/30" />

          {/* Notification card */}
          <div
            className={`relative bg-white rounded-3xl shadow-2xl px-12 py-10 flex flex-col items-center gap-5 mx-4 max-w-sm w-full transition-all duration-500 ${
              bannerVisible ? "scale-100 translate-y-0" : "scale-90 translate-y-8"
            }`}
          >
            {/* Animated checkmark circle */}
            <div className="relative">
              <div
                className={`absolute inset-0 rounded-full bg-blue-200 transition-all duration-700 ${
                  bannerVisible ? "scale-150 opacity-0" : "scale-100 opacity-50"
                }`}
              />
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-800 to-slate-800 flex items-center justify-center shadow-lg">
                <svg
                  className={`w-12 h-12 text-white transition-all duration-500 delay-200 ${
                    bannerVisible ? "scale-100 opacity-100" : "scale-50 opacity-0"
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
              <p className="text-2xl font-extrabold text-blue-900">Payment Successful!</p>
              <p className="text-gray-500 text-sm mt-1">Your receipt is ready below</p>
              {data && (
                <p className="mt-3 font-mono text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full inline-block">
                  {data.transaction.transaction_number}
                </p>
              )}
            </div>

            {/* Auto-dismiss progress bar */}
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r from-blue-800 to-slate-700 rounded-full transition-all ease-linear ${
                  bannerVisible ? "w-full" : "w-0"
                }`}
                style={{ transitionDuration: bannerVisible ? "2900ms" : "0ms" }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="no-print">
        <KioskHeader step={4} />
      </div>

      <main className="flex-1 overflow-hidden max-w-2xl mx-auto w-full px-4 py-3 flex flex-col gap-3">
        {/* Receipt Card */}
        <div id="receipt" className="flex-1 overflow-hidden bg-white rounded-2xl shadow-lg min-h-0 flex flex-col">
          {/* Receipt header */}
          <div className="flex-shrink-0 bg-gradient-to-r from-blue-950 via-blue-900 to-slate-800 text-white text-center py-4 px-6">
            <p className="text-2xl font-black tracking-tight">CampusTap<span className="text-yellow-300">XP</span></p>
            <p className="text-blue-200 text-xs mt-0.5">Self-Service Kiosk · Official Digital Receipt</p>
          </div>

          <div className="flex-1 overflow-hidden px-5 py-3 flex flex-col gap-2.5">
            {/* Transaction info */}
            <div className="bg-gray-50 rounded-xl px-4 py-2.5 flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Transaction No.</span>
                <span className="font-mono font-bold text-gray-800">{txn.transaction_number}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Date & Time</span>
                <span className="text-gray-700">{formatDateTime(txn.created_at)}</span>
              </div>
            </div>

            {/* Items */}
            <div>
              <p className="font-semibold text-gray-500 text-xs uppercase tracking-wider mb-1.5">Items Ordered</p>
              <div className="space-y-1.5">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{item.product_name}</p>
                      <p className="text-xs text-gray-400">
                        {item.quantity} × {formatCurrency(item.unit_price)}
                      </p>
                    </div>
                    <p className="font-bold text-gray-800 text-sm">{formatCurrency(item.subtotal)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-dashed border-gray-200 pt-2.5 space-y-1.5">
              <div className="flex justify-between font-extrabold text-base">
                <span>TOTAL</span>
                <span className="text-blue-900">{formatCurrency(txn.total_amount)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Payment Method</span>
                <span className="font-semibold">{txn.payment_method}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Amount Paid</span>
                <span className="font-semibold">{formatCurrency(txn.amount_paid)}</span>
              </div>
              {txn.payment_method === "Cash" && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Change</span>
                  <span className="font-bold text-green-600">{formatCurrency(txn.change_amount)}</span>
                </div>
              )}
            </div>

            <div className="bg-blue-50 rounded-xl p-2 text-center">
              <span className="text-blue-900 font-bold text-sm">✓ Payment Successful</span>
            </div>

            <p className="text-center text-xs text-gray-400">Thank you for your purchase! · CampusTapXP</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex-shrink-0 flex gap-3 no-print">
          <button
            onClick={() => window.print()}
            className="flex-1 py-3.5 rounded-2xl text-base font-bold text-blue-800 bg-white border-2 border-blue-200 hover:bg-blue-50 transition-colors shadow-sm"
          >
            🖨 Print
          </button>
          <button
            onClick={handleNewTransaction}
            className="flex-[2] py-3.5 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-slate-900 transition-all shadow-lg"
          >
            New Transaction →
          </button>
        </div>
      </main>
    </div>
  );
}
