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
  Burger: "🍔",
  Pizza: "🍕",
  "Fried Chicken": "🍗",
  Hotdog: "🌭",
  Matcha: "🍵",
  Frappe: "🧋",
  Juice: "🧃",
  "Ice Cream": "🍦",
  Candies: "🍬",
  "Gummy Bear": "🧸",
  Marshmallows: "🍡",
};

const LOW_STOCK_THRESHOLD = 5;

interface Props {
  product: Product;
  onAdd: (product: Product) => void;
  cartQty: number;
}

export default function ProductCard({ product, onAdd, cartQty }: Props) {
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
      <span className="text-5xl leading-none group-hover:scale-110 transition-transform duration-150">{emoji}</span>
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
