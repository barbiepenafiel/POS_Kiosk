"use client";

import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";

const CATEGORY_EMOJI: Record<string, string> = {
  Drinks: "🥤",
  Food: "🥪",
  Snacks: "🍪",
};

const PRODUCT_EMOJI: Record<string, string> = {
  // Drinks
  Coffee: "☕",
  "Bottled Water": "💧",
  Frappe: "🧋",
  "Matcha Drink": "🍵",
  Juice: "🧃",
  Milk: "🥛",
  Tea: "🍵",
  // Food
  Sandwich: "🥪",
  "Fried Chicken": "🍗",
  Hotdog: "🌭",
  Rice: "🍚",
  Burger: "🍔",
  Pizza: "🍕",
  Noodles: "🍜",
  // Snacks
  Cookies: "🍪",
  Chocolate: "🍫",
  Candies: "🍬",
  Candy: "🍬",
  "Gummy Bear": "🐻",
  Gummies: "🐻",
  "Ice Cream": "🍦",
  Marshmallows: "☁️",
  Chips: "🍟",
  Popcorn: "🍿",
  Crackers: "🫙",
};

const SodaBottleIcon = () => (
  <svg viewBox="0 0 50 90" className="w-10 h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Cap */}
    <rect x="18" y="1" width="14" height="9" rx="3" fill="#0f172a" />
    {/* Cap ridge */}
    <rect x="16" y="8" width="18" height="3" rx="1.5" fill="#1e293b" />
    {/* Neck */}
    <rect x="18" y="11" width="14" height="10" rx="1" fill="#1e3a8a" />
    {/* Shoulder */}
    <path d="M18 21 L9 34 L9 74 Q9 80 25 80 Q41 80 41 74 L41 34 L32 21 Z" fill="#1e3a8a" />
    {/* Body highlight (left) */}
    <path d="M11 36 L11 72 Q11 77 14 79" stroke="white" strokeWidth="1.5" strokeOpacity="0.15" strokeLinecap="round" />
    {/* Label band */}
    <rect x="9" y="42" width="32" height="18" rx="1" fill="#0f172a" />
    {/* Label highlight stripe */}
    <rect x="9" y="42" width="32" height="3" rx="1" fill="#1d4ed8" opacity="0.6" />
    {/* Bubbles */}
    <circle cx="19" cy="66" r="2.5" fill="white" fillOpacity="0.35" />
    <circle cx="28" cy="70" r="1.8" fill="white" fillOpacity="0.35" />
    <circle cx="24" cy="63" r="1.3" fill="white" fillOpacity="0.35" />
    <circle cx="33" cy="65" r="1" fill="white" fillOpacity="0.25" />
    {/* Bottom curve */}
    <path d="M9 74 Q9 80 25 80 Q41 80 41 74" fill="#1e3a8a" />
  </svg>
);

const PRODUCT_SVG: Record<string, React.ReactNode> = {
  "Soft Drink": <SodaBottleIcon />,
};

const LOW_STOCK_THRESHOLD = 5;

interface Props {
  product: Product;
  onAdd: (product: Product) => void;
  cartQty: number;
}

export default function ProductCard({ product, onAdd, cartQty }: Props) {
  const customIcon = PRODUCT_SVG[product.name];
  const emoji =
    PRODUCT_EMOJI[product.name] ?? CATEGORY_EMOJI[product.category] ?? "🛒";
  const inCart = cartQty > 0;
  const stock = product.stock;
  const outOfStock = stock === 0;

  return (
    <button
      type="button"
      onClick={() => onAdd(product)}
      disabled={outOfStock}
      aria-label={`Add ${product.name}, ${formatCurrency(product.price)}`}
      className={`group relative flex min-h-[9.5rem] w-full flex-col items-center gap-2 rounded-kiosk border-2 bg-surface p-4 text-center shadow-card transition-transform duration-150 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-app disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 ${
        inCart ? "border-brand" : "border-line"
      }`}
    >
      {inCart && (
        <span className="absolute right-2 top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-brand px-1.5 text-xs font-bold text-ink-invert shadow-sm">
          {cartQty}
        </span>
      )}

      <span aria-hidden className="text-4xl leading-none sm:text-5xl">
        {customIcon ?? emoji}
      </span>

      <span className="flex flex-col gap-0.5">
        <span className="text-sm font-bold leading-tight text-ink sm:text-base">
          {product.name}
        </span>
        <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-ink-faint">
          {product.category}
        </span>
        {stock != null && (
          <span
            className={`mt-0.5 text-xs font-bold ${
              outOfStock
                ? "text-danger-ink"
                : stock <= LOW_STOCK_THRESHOLD
                  ? "text-warning-ink"
                  : "text-success-ink"
            }`}
          >
            {outOfStock ? "Out of stock" : `Stock: ${stock}`}
          </span>
        )}
      </span>

      <span className="mt-auto rounded-full bg-brand-soft px-3.5 py-1.5 text-sm font-extrabold text-brand-ink">
        {formatCurrency(product.price)}
      </span>
    </button>
  );
}
