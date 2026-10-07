"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { formatCurrency } from "@/lib/utils";
import { fetchTransactionWithItems } from "@/lib/db";
import { Transaction } from "@/types";
import KioskHeader from "@/components/KioskHeader";

function SuccessContent() {
  const router = useRouter();
  const params = useSearchParams();

  const txnId = params.get("txn") ?? "";
  const amountPaid = parseFloat(params.get("paid") ?? "0");
  const changeAmount = parseFloat(params.get("change") ?? "0");
  const method = params.get("method") ?? "Cash";

  const [txn, setTxn] = useState<Transaction | null>(null);

  useEffect(() => {
    if (txnId) {
      fetchTransactionWithItems(txnId)
        .then((data) => setTxn(data.transaction))
        .catch(() => {});
    }
  }, [txnId]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 via-blue-50 to-blue-100">
      <KioskHeader step={4} />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 flex flex-col items-center gap-6">
        <div className="text-center">
          <div className="text-7xl mb-4">✅</div>
          <h2 className="text-4xl font-extrabold text-green-700">Payment Successful!</h2>
          <p className="text-gray-500 mt-2">Your order has been processed.</p>
        </div>

        <div className="w-full bg-white rounded-2xl shadow-lg p-6 space-y-4">
          {txn && (
            <DetailRow
              label="Transaction No."
              value={txn.transaction_number}
              valueClass="font-mono font-bold text-gray-800"
            />
          )}
          <DetailRow label="Payment Method" value={method} />
          <DetailRow
            label="Transaction Amount"
            value={txn ? formatCurrency(txn.total_amount) : "—"}
          />
          <DetailRow
            label="Amount Paid"
            value={formatCurrency(amountPaid)}
          />
          {method === "Cash" && (
            <DetailRow
              label="Change"
              value={formatCurrency(changeAmount)}
              valueClass="text-green-600 font-extrabold text-lg"
            />
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <button
            onClick={() => router.push(`/receipt/${txnId}`)}
            className="flex-1 py-5 rounded-2xl text-xl font-extrabold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-lg"
          >
            View Receipt 🧾
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
