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
  const emoji = PRODUCT_EMOJI[product.name] ?? CATEGORY_EMOJI[product.category] ?? "🛒";
  const stock = product.stock;
  const outOfStock = stock === 0;

  return (
    <button
      onClick={() => onAdd(product)}
      disabled={outOfStock}
      className="relative bg-white rounded-2xl shadow-md hover:shadow-xl active:scale-95 transition-all duration-150 p-5 flex flex-col items-center gap-3 border-2 border-transparent hover:border-blue-700 focus:outline-none focus:border-blue-800 min-h-[160px] w-full group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md disabled:hover:border-transparent disabled:active:scale-100"
    >
      {cartQty > 0 && (
        <span className="absolute top-2 right-2 bg-blue-800 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow">
          {cartQty}
        </span>
      )}
      <span className="leading-none group-hover:scale-110 transition-transform duration-150">
        {customIcon ?? <span className="text-5xl">{emoji}</span>}
      </span>
      <div className="text-center">
        <p className="font-semibold text-gray-800 text-base leading-tight">{product.name}</p>
        <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-wide">{product.category}</p>
        {stock != null && (
          <p
            className={`text-xs font-semibold mt-1 ${
              outOfStock ? "text-red-600" : stock <= LOW_STOCK_THRESHOLD ? "text-orange-500" : "text-green-600"
            }`}
          >
            {outOfStock ? "Out of stock" : `Stock: ${stock}`}
          </p>
        )}
      </div>
      <span className="mt-auto bg-gradient-to-r from-blue-800 to-blue-900 text-white font-bold text-base px-4 py-1.5 rounded-full shadow-sm">
        {formatCurrency(product.price)}
      </span>
    </button>
  );
}
