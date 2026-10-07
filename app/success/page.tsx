"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { formatCurrency } from "@/lib/utils";
import ProgressIndicator from "@/components/ProgressIndicator";

function SuccessContent() {
  const router = useRouter();
  const params = useSearchParams();

  const txnId = params.get("txn") ?? "";
  const amountPaid = parseFloat(params.get("paid") ?? "0");
  const changeAmount = parseFloat(params.get("change") ?? "0");
  const method = (params.get("method") ?? "Cash") as string;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-emerald-100">
      <header className="bg-white shadow-sm px-6 py-4">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-extrabold text-blue-700">CS Campus Store</h1>
            <p className="text-sm text-gray-500">Self-Service Kiosk</p>
          </div>
          <ProgressIndicator currentStep={4} />
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 flex flex-col items-center gap-6">
        <div className="text-center">
          <div className="text-7xl mb-4">✅</div>
          <h2 className="text-4xl font-extrabold text-green-700">Payment Successful!</h2>
          <p className="text-gray-500 mt-2">Your order has been processed.</p>
        </div>

        <div className="w-full bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <DetailRow label="Payment Method" value={method} />
          <DetailRow
            label="Amount Paid"
            value={formatCurrency(amountPaid)}
          />
          {method === "Cash" && (
            <DetailRow
              label="Change"
              value={formatCurrency(changeAmount)}
              valueClass="text-green-600 font-extrabold"
            />
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <button
            onClick={() => router.push(`/receipt/${txnId}`)}
            className="flex-1 py-5 rounded-2xl text-xl font-extrabold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-lg"
          >
            View Receipt
          </button>
        </div>
      </main>
    </div>
  );
}

function DetailRow({
  label,
  value,
  valueClass = "font-bold text-gray-800",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
      <span className="text-gray-500">{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
