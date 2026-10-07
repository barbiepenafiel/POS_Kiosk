"use client";

export const dynamic = "force-dynamic";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchTransactionWithItems } from "@/lib/db";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { ReceiptData } from "@/types";
import KioskHeader from "@/components/KioskHeader";
import Toast from "@/components/Toast";
import PaymentSuccessOverlay from "@/components/PaymentSuccessOverlay";

export default function ReceiptPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [data, setData] = useState<ReceiptData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(true);
  const [bannerVisible, setBannerVisible] = useState(false);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    let active = true;
    fetchTransactionWithItems(params.id)
      .then((d) => {
        if (active) setData(d);
      })
      .catch(() => {
        if (active) setError("Failed to load receipt.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [params.id]);

  useEffect(() => {
    if (loading || !data) return;
    const t1 = setTimeout(() => setBannerVisible(true), 100);
    const t2 = setTimeout(() => setBannerVisible(false), 3000);
    const t3 = setTimeout(() => setShowBanner(false), 3500);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [loading, data]);

  const handleNewTransaction = () => {
    setToast("New transaction started — previous order cleared.");
    timers.current.push(setTimeout(() => router.replace("/"), 1200));
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-app via-app to-app-accent">
        <div className="flex flex-col items-center gap-3">
          <div className="h-11 w-11 animate-spin rounded-full border-4 border-line border-t-brand" />
          <p className="text-sm font-medium text-ink-soft">Loading receipt…</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-app via-app to-app-accent px-4">
        <div className="flex max-w-sm flex-col items-center gap-4 rounded-kiosk border border-line bg-surface p-8 text-center shadow-card">
          <span aria-hidden className="text-4xl">
            ⚠️
          </span>
          <p className="font-bold text-danger-ink">
            {error ?? "Receipt not found."}
          </p>
          <button
            type="button"
            onClick={() => router.replace("/")}
            className="flex min-h-touch items-center rounded-kiosk bg-brand px-6 font-extrabold text-ink-invert shadow-card"
          >
            Start New Transaction
          </button>
        </div>
      </div>
    );
  }

  const { transaction: txn, items } = data;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gradient-to-br from-app via-app to-app-accent">
      {toast && (
        <Toast message={toast} type="success" onClose={() => setToast(null)} />
      )}

      {showBanner && (
        <div className="no-print">
          <PaymentSuccessOverlay
            visible={bannerVisible}
            title="Payment Successful!"
            subtitle="Your receipt is ready below"
            progressMs={2900}
            footnote={txn.transaction_number}
          />
        </div>
      )}

      <div className="no-print">
        <KioskHeader step={4} />
      </div>

      <main className="mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col gap-3 px-4 py-4 sm:px-6">
        <div
          id="receipt"
          className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-kiosk border border-line bg-surface shadow-card"
        >
          {/* receipt-banner is forced to plain dark-on-white when printing */}
          <div className="receipt-banner flex-shrink-0 bg-gradient-to-r from-header-from via-header-via to-header-to px-6 py-3.5 text-center text-white">
            <p className="text-xl font-black tracking-tight">
              CampusTap<span className="text-accent">XP</span>
            </p>
            <p className="mt-0.5 text-[0.65rem] font-medium text-white/70">
              Self-Service Kiosk · Official Digital Receipt
            </p>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto px-5 py-3">
            <div className="flex flex-col gap-1 rounded-xl bg-surface-sunken px-4 py-2.5">
              <div className="flex justify-between gap-3 text-xs">
                <span className="font-medium text-ink-soft">Transaction No.</span>
                <span className="font-mono font-bold text-ink">
                  {txn.transaction_number}
                </span>
              </div>
              <div className="flex justify-between gap-3 text-xs">
                <span className="font-medium text-ink-soft">Date &amp; Time</span>
                <span className="font-medium text-ink">
                  {formatDateTime(txn.created_at)}
                </span>
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-[0.65rem] font-bold uppercase tracking-wider text-ink-faint">
                Items Ordered
              </p>
              <div className="flex flex-col gap-1.5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-ink">
                        {item.product_name}
                      </p>
                      <p className="text-xs font-medium text-ink-faint">
                        {item.quantity} × {formatCurrency(item.unit_price)}
                      </p>
                    </div>
                    <p className="whitespace-nowrap text-sm font-extrabold tabular-nums text-ink">
                      {formatCurrency(item.subtotal)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5 border-t border-dashed border-line-strong pt-2.5">
              <div className="flex justify-between gap-3 text-base font-black">
                <span className="text-ink">TOTAL</span>
                <span className="tabular-nums text-brand-ink">
                  {formatCurrency(txn.total_amount)}
                </span>
              </div>
              <div className="flex justify-between gap-3 text-xs">
                <span className="font-medium text-ink-soft">Payment Method</span>
                <span className="font-bold text-ink">{txn.payment_method}</span>
              </div>
              <div className="flex justify-between gap-3 text-xs">
                <span className="font-medium text-ink-soft">Amount Paid</span>
                <span className="font-bold tabular-nums text-ink">
                  {formatCurrency(txn.amount_paid)}
                </span>
              </div>
              {txn.payment_method === "Cash" && (
                <div className="flex justify-between gap-3 text-xs">
                  <span className="font-medium text-ink-soft">Change</span>
                  <span className="font-bold tabular-nums text-success-ink">
                    {formatCurrency(txn.change_amount)}
                  </span>
                </div>
              )}
            </div>

            <div className="rounded-xl bg-success-soft px-3 py-2 text-center">
              <span className="text-sm font-bold text-success-ink">
                ✓ Payment Successful
              </span>
            </div>

            <p className="text-center text-xs font-medium text-ink-faint">
              Thank you for your purchase! · CampusTapXP
            </p>
          </div>
        </div>

        <div className="no-print flex flex-shrink-0 gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex min-h-[3.25rem] flex-1 items-center justify-center rounded-kiosk border-2 border-line bg-surface text-base font-bold text-ink transition-colors active:bg-surface-sunken"
          >
            🖨 Print
          </button>
          <button
            type="button"
            onClick={handleNewTransaction}
            className="flex min-h-[3.25rem] flex-[2] items-center justify-center rounded-kiosk bg-brand text-base font-extrabold text-ink-invert shadow-card transition-transform active:scale-[0.98]"
          >
            New Transaction →
          </button>
        </div>
      </main>
    </div>
  );
}
