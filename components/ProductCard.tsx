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
  const emoji = PRODUCT_EMOJI[product.name] ?? CATEGORY_EMOJI[product.category] ?? "🛒";

  return (
    <button
      onClick={() => onAdd(product)}
      className="relative bg-white rounded-2xl shadow-md hover:shadow-xl active:scale-95 transition-all duration-150 p-5 flex flex-col items-center gap-3 border-2 border-transparent hover:border-blue-400 focus:outline-none focus:border-blue-500 min-h-[160px] w-full"
    >
      {cartQty > 0 && (
        <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
          {cartQty}
        </span>
      )}
      <span className="text-5xl leading-none">{emoji}</span>
      <div className="text-center">
        <p className="font-semibold text-gray-800 text-base leading-tight">{product.name}</p>
        <p className="text-sm text-gray-500 mt-0.5">{product.category}</p>
      </div>
      <span className="mt-auto bg-blue-50 text-blue-700 font-bold text-lg px-4 py-1 rounded-full">
        {formatCurrency(product.price)}
      </span>
    </button>
  );
}
