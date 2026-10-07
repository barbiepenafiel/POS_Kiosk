"use client";

import { useState } from "react";
import { CartItem } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/lib/CartContext";

interface Props {
  items: CartItem[];
  totalAmount: number;
  onProceed: () => void;
  showControls?: boolean;
  onNotify?: (message: string) => void;
}

export default function CartPanel({
  items,
  totalAmount,
  onProceed,
  showControls = true,
  onNotify,
}: Props) {
  const { increaseQty, decreaseQty, removeItem } = useCart();
  const count = items.reduce((s, i) => s + i.quantity, 0);
  const empty = items.length === 0;
  // Phones only: the panel is a bar that expands into a bottom sheet
  const [open, setOpen] = useState(false);
  const countLabel = empty
    ? "No items yet"
    : `${count} item${count === 1 ? "" : "s"}`;

  return (
    <>
      {open && (
        <div
          aria-hidden
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 bg-overlay/50 sm:hidden"
        />
      )}

      <section
        aria-label="Your order"
        className={`flex h-full min-h-0 flex-col overflow-hidden rounded-kiosk border border-line bg-surface shadow-card ${
          open
            ? "max-sm:fixed max-sm:inset-x-0 max-sm:bottom-0 max-sm:z-50 max-sm:h-auto max-sm:max-h-[85vh] max-sm:rounded-b-none max-sm:shadow-modal"
            : ""
        }`}
      >
        <button
          type="button"
          aria-expanded={open}
          aria-controls="cart-panel-body"
          onClick={() => setOpen((o) => !o)}
          className={`flex items-center justify-between gap-3 bg-surface-sunken px-4 text-left sm:hidden ${
            open ? "h-16 flex-shrink-0 border-b border-line" : "flex-1"
          }`}
        >
          <span className="flex min-w-0 items-center gap-3">
            <span aria-hidden className="text-2xl">
              🛒
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold text-ink">
                Your Order
              </span>
              <span className="block text-xs font-medium text-ink-faint">
                {countLabel}
              </span>
            </span>
          </span>
          <span className="flex flex-shrink-0 items-center gap-2">
            <span className="text-base font-black text-brand-ink">
              {open ? "Close" : formatCurrency(totalAmount)}
            </span>
            <svg
              aria-hidden
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`h-5 w-5 text-ink-soft transition-transform ${
                open ? "rotate-180" : ""
              }`}
            >
              <path d="M5 12l5-5 5 5" />
            </svg>
          </span>
        </button>

        <header className="hidden flex-shrink-0 items-center justify-between gap-2 border-b border-line bg-surface-sunken px-5 py-3.5 sm:flex">
          <div>
            <h2 className="text-base font-bold text-ink">Your Order</h2>
            <p className="text-xs font-medium text-ink-faint">{countLabel}</p>
          </div>
          <span aria-hidden className="text-2xl">
            🛒
          </span>
        </header>

        <div
          id="cart-panel-body"
          className={`min-h-0 flex-1 space-y-2.5 overflow-y-auto px-4 py-3 ${
            open ? "" : "max-sm:hidden"
          }`}
        >
          {empty ? (
            <div className="flex h-32 flex-col items-center justify-center gap-2 text-ink-faint">
              <span aria-hidden className="text-4xl opacity-60">
                🛒
              </span>
              <p className="text-sm font-medium">Tap a product to add it</p>
            </div>
          ) : (
            items.map((item) => {
              const atLimit =
                item.product.stock != null &&
                item.quantity >= item.product.stock;
              const removed = `${item.product.name} removed from order`;
              return (
                <article
                  key={item.product.id}
                  className="rounded-xl border border-line bg-surface-sunken p-3"
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <p className="flex-1 text-sm font-bold leading-tight text-ink">
                      {item.product.name}
                    </p>
                    <p className="whitespace-nowrap text-sm font-extrabold text-brand-ink">
                      {formatCurrency(item.product.price * item.quantity)}
                    </p>
                  </div>

                  {showControls ? (
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          aria-label={`Decrease ${item.product.name}`}
                          onClick={() => {
                            decreaseQty(item.product.id);
                            if (item.quantity <= 1) onNotify?.(removed);
                          }}
                          className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface text-xl font-bold text-ink transition-colors active:bg-surface-sunken"
                        >
                          −
                        </button>
                        <span
                          aria-live="polite"
                          className="w-9 text-center text-base font-extrabold text-ink"
                        >
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={`Increase ${item.product.name}`}
                          onClick={() => increaseQty(item.product.id)}
                          disabled={atLimit}
                          className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-xl font-bold text-ink-invert transition-opacity active:opacity-80 disabled:cursor-not-allowed disabled:bg-surface disabled:text-ink-faint disabled:ring-1 disabled:ring-line"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          removeItem(item.product.id);
                          onNotify?.(removed);
                        }}
                        className="flex min-h-touch items-center rounded-xl px-3 text-xs font-bold text-danger-ink transition-colors active:bg-danger-soft"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs font-medium text-ink-soft">
                      {item.quantity} × {formatCurrency(item.product.price)}
                    </p>
                  )}

                  {showControls && atLimit && (
                    <p className="mt-2 text-xs font-bold text-warning-ink">
                      All {item.product.stock} in stock are in your order.
                    </p>
                  )}
                </article>
              );
            })
          )}
        </div>

        <footer
          className={`flex-shrink-0 border-t border-line bg-surface-sunken px-5 py-4 ${
            open ? "" : "max-sm:hidden"
          }`}
        >
          <div className="mb-3 flex items-baseline justify-between">
            <span className="text-sm font-bold text-ink-soft">Total</span>
            <span className="text-2xl font-black text-brand-ink">
              {formatCurrency(totalAmount)}
            </span>
          </div>
          <button
            type="button"
            onClick={onProceed}
            disabled={empty}
            className="flex min-h-[3.25rem] w-full items-center justify-center rounded-kiosk bg-brand px-4 text-base font-extrabold text-ink-invert shadow-card transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-surface disabled:text-ink-faint disabled:shadow-none disabled:ring-1 disabled:ring-line"
          >
            {empty ? "Add items to proceed" : "Review Order →"}
          </button>
        </footer>
      </section>
    </>
  );
}
