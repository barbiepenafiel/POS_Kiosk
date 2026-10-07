"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { fetchTransactionWithItems } from "@/lib/db";
import { Transaction } from "@/types";
import KioskHeader from "@/components/KioskHeader";

/**
 * NOTE: this screen is currently unreachable — the payment flow navigates
 * straight from /payment to /receipt/[id]. It is kept as an optional
 * confirmation step and restyled to match the rest of the kiosk.
 */
function SuccessContent() {
  const router = useRouter();
  const params = useSearchParams();

  const txnId = params.get("txn") ?? "";
  const amountPaid = parseFloat(params.get("paid") ?? "0");
  const changeAmount = parseFloat(params.get("change") ?? "0");
  const method = params.get("method") ?? "Cash";

  const [txn, setTxn] = useState<Transaction | null>(null);

  useEffect(() => {
    if (!txnId) return;
    let active = true;
    fetchTransactionWithItems(txnId)
      .then((data) => {
        if (active) setTxn(data.transaction);
      })
      .catch(() => {
        /* non-fatal: the screen still shows the query-string values */
      });
    return () => {
      active = false;
    };
  }, [txnId]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gradient-to-br from-app via-app to-app-accent">
      <KioskHeader step={4} />

      <main className="mx-auto flex min-h-0 w-full max-w-xl flex-1 flex-col items-center gap-4 overflow-y-auto px-4 py-5 sm:px-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success shadow-card">
            <svg
              aria-hidden
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-black text-success-ink sm:text-3xl">
              Payment Successful!
            </h2>
            <p className="mt-1 text-sm font-medium text-ink-soft">
              Your order has been processed.
            </p>
          </div>
        </div>

        <div className="w-full rounded-kiosk border border-line bg-surface p-5 shadow-card">
          {txn && (
            <DetailRow
              label="Transaction No."
              value={txn.transaction_number}
              mono
            />
          )}
          <DetailRow label="Payment Method" value={method} />
          <DetailRow
            label="Transaction Amount"
            value={txn ? formatCurrency(txn.total_amount) : "—"}
          />
          <DetailRow label="Amount Paid" value={formatCurrency(amountPaid)} />
          {method === "Cash" && (
            <DetailRow
              label="Change"
              value={formatCurrency(changeAmount)}
              emphasis
            />
          )}
        </div>

        <button
          type="button"
          onClick={() => router.push(txnId ? `/receipt/${txnId}` : "/")}
          className="flex min-h-[3.25rem] w-full items-center justify-center rounded-kiosk bg-brand text-base font-extrabold text-ink-invert shadow-card transition-transform active:scale-[0.98]"
        >
          {txnId ? "View Receipt 🧾" : "Start New Transaction"}
        </button>
      </main>
    </div>
  );
}

function DetailRow({
  label,
  value,
  mono,
  emphasis,
}: {
  label: string;
  value: string;
  mono?: boolean;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line py-2.5 last:border-0">
      <span className="text-sm font-medium text-ink-soft">{label}</span>
      <span
        className={`text-sm font-extrabold tabular-nums ${
          mono ? "font-mono" : ""
        } ${emphasis ? "text-success-ink" : "text-ink"}`}
      >
        {value}
      </span>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-app">
          <div className="h-11 w-11 animate-spin rounded-full border-4 border-line border-t-brand" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
