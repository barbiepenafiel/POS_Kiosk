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
import PaymentSuccessOverlay, {
  OverlayRow,
} from "@/components/PaymentSuccessOverlay";

const METHODS: {
  id: PaymentMethod;
  label: string;
  short: string;
  icon: string;
  desc: string;
}[] = [
  { id: "Cash", label: "Cash", short: "Cash", icon: "💵", desc: "Bills and coins" },
  { id: "QR", label: "QR Payment", short: "QR", icon: "📱", desc: "GCash, Maya, any QR app" },
  { id: "Card", label: "Credit / Debit Card", short: "Card", icon: "💳", desc: "Tap, insert, or swipe" },
];

const REDIRECT_MS = 2800;

export default function PaymentPage() {
  const router = useRouter();
  const { items, totalAmount, clearCart } = useCart();
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "error" | "success" | "info";
  } | null>(null);

  // Amount is captured before the cart is cleared so the overlay can show it.
  const [success, setSuccess] = useState<{
    amountPaid: number;
    changeAmount: number;
    total: number;
    visible: boolean;
  } | null>(null);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(
    () => () => timers.current.forEach(clearTimeout),
    [],
  );

  useEffect(() => {
    if (items.length === 0 && !success) router.replace("/");
  }, [items.length, success, router]);

  if (items.length === 0 && !success) return null;

  const handlePayment = async (amountPaid: number, changeAmount: number) => {
    if (processing || !method) return;
    setProcessing(true);
    const total = totalAmount;
    try {
      const txn = await saveTransaction(
        items,
        total,
        method,
        amountPaid,
        changeAmount,
      );
      clearCart();
      setSuccess({ amountPaid, changeAmount, total, visible: false });
      timers.current.push(
        setTimeout(
          () => setSuccess((d) => (d ? { ...d, visible: true } : d)),
          50,
        ),
        setTimeout(() => router.push(`/receipt/${txn.id}`), REDIRECT_MS),
      );
    } catch {
      setToast({ message: "Payment failed. Please try again.", type: "error" });
      setProcessing(false);
    }
  };

  const active = METHODS.find((m) => m.id === method);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gradient-to-br from-app via-app to-app-accent">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {success && (
        <PaymentSuccessOverlay
          visible={success.visible}
          title="Order Successful!"
          subtitle="Payment has been confirmed"
          progressMs={REDIRECT_MS - 100}
          footnote="Opening your receipt…"
        >
          <OverlayRow label="Payment" value={method ?? "—"} />
          <OverlayRow
            label="Amount Paid"
            value={formatCurrency(success.amountPaid)}
          />
          {method === "Cash" && success.changeAmount > 0 && (
            <OverlayRow
              label="Change"
              value={formatCurrency(success.changeAmount)}
              emphasis
            />
          )}
        </PaymentSuccessOverlay>
      )}

      <KioskHeader step={3} />

      <main className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col gap-3 px-4 py-4 sm:px-6">
        <div className="flex-shrink-0 text-center">
          <h2 className="text-xl font-black text-ink sm:text-2xl">
            {method ? "Complete Your Payment" : "How would you like to pay?"}
          </h2>
          <p className="mt-0.5 text-sm font-bold text-brand-ink">
            Amount Due: {formatCurrency(totalAmount)}
          </p>
        </div>

        {!method && (
          <div className="grid flex-shrink-0 grid-cols-1 gap-3 sm:grid-cols-3">
            {METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                className="flex min-h-touch flex-row items-center gap-3 rounded-kiosk border-2 border-line bg-surface p-4 text-left shadow-card transition-transform active:scale-[0.97] sm:flex-col sm:text-center"
              >
                <span aria-hidden className="text-3xl sm:text-4xl">
                  {m.icon}
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-ink">{m.label}</span>
                  <span className="text-xs font-medium text-ink-faint">
                    {m.desc}
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}

        {method && (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-kiosk border border-line bg-surface shadow-card">
            <div className="flex flex-shrink-0 items-center justify-between gap-3 border-b border-line bg-surface-sunken px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span aria-hidden className="text-lg">
                  {active?.icon}
                </span>
                <h3 className="text-sm font-bold text-ink">{active?.label}</h3>
              </div>
              <button
                type="button"
                onClick={() => setMethod(null)}
                disabled={processing}
                className="flex min-h-touch items-center rounded-xl px-3 text-xs font-bold text-ink-soft transition-colors active:bg-surface disabled:opacity-40"
              >
                Change method
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
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
          </div>
        )}

        <button
          type="button"
          onClick={() => router.push("/review")}
          disabled={processing}
          className="flex min-h-[3.25rem] w-full flex-shrink-0 items-center justify-center rounded-kiosk border-2 border-line bg-surface text-base font-bold text-ink transition-colors active:bg-surface-sunken disabled:opacity-40"
        >
          ← Back to Review
        </button>
      </main>
    </div>
  );
}
