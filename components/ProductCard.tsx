"use client";

import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";

const CATEGORY_EMOJI: Record<string, string> = {
  Drinks: "🥤",
  Food: "🥪",
  Snacks: "🍪",
};

const PRODUCT_EMOJI: Record<string, string> = {
  Coffee: "☕",
  Sandwich: "🥪",
  "Soft Drink": "🥤",
  Cookies: "🍪",
  "Bottled Water": "💧",
  Chocolate: "🍫",
};

interface Props {
  product: Product;
  onAdd: (product: Product) => void;
  cartQty: number;
}

export default function ProductCard({ product, onAdd, cartQty }: Props) {
  const emoji =
    PRODUCT_EMOJI[product.name] ?? CATEGORY_EMOJI[product.category] ?? "🛒";
  const inCart = cartQty > 0;

  return (
    <button
      type="button"
      onClick={() => onAdd(product)}
      aria-label={`Add ${product.name}, ${formatCurrency(product.price)}`}
      className={`group relative flex min-h-[9.5rem] w-full flex-col items-center gap-2 rounded-kiosk border-2 bg-surface p-4 text-center shadow-card transition-transform duration-150 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-app ${
        inCart ? "border-brand" : "border-line"
      }`}
    >
      {inCart && (
        <span className="absolute right-2 top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-brand px-1.5 text-xs font-bold text-ink-invert shadow-sm">
          {cartQty}
        </span>
      )}

      <span aria-hidden className="text-4xl leading-none sm:text-5xl">
        {emoji}
      </span>

      <span className="flex flex-col gap-0.5">
        <span className="text-sm font-bold leading-tight text-ink sm:text-base">
          {product.name}
        </span>
        <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-ink-faint">
          {product.category}
        </span>
      </span>

      <span className="mt-auto rounded-full bg-brand-soft px-3.5 py-1.5 text-sm font-extrabold text-brand-ink">
        {formatCurrency(product.price)}
      </span>
    </button>
  );
}
