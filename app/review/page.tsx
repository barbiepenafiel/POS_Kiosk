"use client";

export const dynamic = "force-dynamic";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCart } from "@/lib/CartContext";
import { formatCurrency } from "@/lib/utils";
import KioskHeader from "@/components/KioskHeader";

export default function ReviewPage() {
  const router = useRouter();
  const { items, totalAmount, totalItems, hydrated } = useCart();

  useEffect(() => {
    if (hydrated && items.length === 0) router.replace("/");
  }, [hydrated, items.length, router]);

  if (!hydrated || items.length === 0) return null;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gradient-to-br from-app via-app to-app-accent">
      <KioskHeader step={2} />

      <main className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col gap-3 px-4 py-4 sm:px-6">
        <div className="flex-shrink-0 text-center">
          <h2 className="text-xl font-black text-ink sm:text-2xl">
            Review Your Order
          </h2>
          <p className="mt-0.5 text-sm font-medium text-ink-faint">
            {totalItems} item{totalItems === 1 ? "" : "s"} · tap Back to make changes
          </p>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-kiosk border border-line bg-surface shadow-card">
          <div className="grid flex-shrink-0 grid-cols-[1fr_auto_auto] gap-3 border-b border-line bg-surface-sunken px-5 py-2.5 text-[0.65rem] font-bold uppercase tracking-wider text-ink-faint">
            <span>Item</span>
            <span className="w-12 text-center">Qty</span>
            <span className="w-24 text-right">Subtotal</span>
          </div>

          <div className="min-h-0 flex-1 divide-y divide-line overflow-y-auto">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-5 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-ink">
                    {item.product.name}
                  </p>
                  <p className="text-xs font-medium text-ink-faint">
                    {formatCurrency(item.product.price)} each
                  </p>
                </div>
                <p className="w-12 text-center text-base font-extrabold text-ink">
                  {item.quantity}
                </p>
                <p className="w-24 text-right text-sm font-extrabold text-brand-ink">
                  {formatCurrency(item.product.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-shrink-0 items-center justify-between gap-3 border-t border-line bg-brand-soft px-5 py-3.5">
            <div>
              <p className="text-xs font-medium text-ink-soft">
                {totalItems} item{totalItems === 1 ? "" : "s"}
              </p>
              <p className="text-sm font-bold text-ink">Order Total</p>
            </div>
            <p className="text-2xl font-black text-brand-ink sm:text-3xl">
              {formatCurrency(totalAmount)}
            </p>
          </div>
        </div>

        <div className="flex flex-shrink-0 gap-3">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex min-h-[3.25rem] flex-1 items-center justify-center rounded-kiosk border-2 border-line bg-surface text-base font-bold text-ink transition-colors active:bg-surface-sunken"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={() => router.push("/payment")}
            className="flex min-h-[3.25rem] flex-[2] items-center justify-center rounded-kiosk bg-brand text-base font-extrabold text-ink-invert shadow-card transition-transform active:scale-[0.98]"
          >
            Continue to Payment →
          </button>
        </div>
      </main>
    </div>
  );
}
