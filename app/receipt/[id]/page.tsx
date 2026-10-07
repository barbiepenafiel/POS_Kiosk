"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchTransactionWithItems } from "@/lib/db";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { ReceiptData } from "@/types";
import ProgressIndicator from "@/components/ProgressIndicator";
import Toast from "@/components/Toast";

export default function ReceiptPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [data, setData] = useState<ReceiptData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactionWithItems(params.id)
      .then(setData)
      .catch(() => setError("Failed to load receipt."))
      .finally(() => setLoading(false));
  }, [params.id]);

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-slate-100">
      {toast && <Toast message={toast} type="success" onClose={() => setToast(null)} />}

      <header className="bg-white shadow-sm px-6 py-4 no-print">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-extrabold text-blue-700">CS Campus Store</h1>
            <p className="text-sm text-gray-500">Self-Service Kiosk</p>
          </div>
          <ProgressIndicator currentStep={4} />
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 flex flex-col gap-6">
        {/* Receipt Card */}
        <div id="receipt" className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Receipt header */}
          <div className="bg-blue-700 text-white text-center py-8 px-6">
            <p className="text-3xl font-extrabold tracking-tight">CAMPUS STORE POS</p>
            <p className="text-blue-200 text-sm mt-1">Self-Service Kiosk · Official Digital Receipt</p>
          </div>

          <div className="px-6 py-6 space-y-5">
            {/* Transaction info */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Transaction No.</span>
                <span className="font-mono font-bold text-gray-800">{txn.transaction_number}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Date & Time</span>
                <span className="text-gray-700">{formatDateTime(txn.created_at)}</span>
              </div>
            </div>

            {/* Items */}
            <div>
              <p className="font-semibold text-gray-600 text-xs uppercase tracking-wider mb-3">Items Ordered</p>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">{item.product_name}</p>
                      <p className="text-xs text-gray-400">
                        {item.quantity} × {formatCurrency(item.unit_price)}
                      </p>
                    </div>
                    <p className="font-bold text-gray-800">{formatCurrency(item.subtotal)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-dashed border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-xl font-extrabold">
                <span>TOTAL</span>
                <span className="text-blue-700">{formatCurrency(txn.total_amount)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Payment Method</span>
                <span className="font-semibold">{txn.payment_method}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Amount Paid</span>
                <span className="font-semibold">{formatCurrency(txn.amount_paid)}</span>
              </div>
              {txn.payment_method === "Cash" && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Change</span>
                  <span className="font-bold text-green-600">{formatCurrency(txn.change_amount)}</span>
                </div>
              )}
            </div>

            <div className="bg-green-50 rounded-xl p-3 text-center">
              <span className="text-green-700 font-bold">✓ Payment Successful</span>
            </div>
          </div>

          <div className="border-t border-dashed border-gray-200 px-6 py-4 text-center text-xs text-gray-400">
            Thank you for your purchase! · CS Campus Store
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 no-print">
          <button
            onClick={() => window.print()}
            className="flex-1 py-4 rounded-2xl text-lg font-bold text-blue-700 bg-white border-2 border-blue-200 hover:bg-blue-50 active:bg-blue-100 transition-colors shadow-sm"
          >
            🖨 Print Receipt
          </button>
          <button
            onClick={handleNewTransaction}
            className="flex-[2] py-4 rounded-2xl text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-lg"
          >
            New Transaction →
          </button>
        </div>
      </main>
    </div>
  );
}
