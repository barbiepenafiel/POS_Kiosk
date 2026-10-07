"use client";

import { CartItem } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/lib/CartContext";

interface Props {
  items: CartItem[];
  totalAmount: number;
  onProceed: () => void;
  showControls?: boolean;
}

export default function CartPanel({
  items,
  totalAmount,
  onProceed,
  showControls = true,
}: Props) {
  const { increaseQty, decreaseQty, removeItem } = useCart();

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-800">Your Order</h2>
        <p className="text-sm text-gray-500">
          {items.length === 0 ? "No items yet" : `${items.reduce((s, i) => s + i.quantity, 0)} item(s)`}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-400">
            <span className="text-4xl">🛒</span>
            <p className="mt-2 text-sm">Tap a product to add it</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.product.id} className="bg-gray-50 rounded-xl p-3">
              <div className="flex justify-between items-start mb-2">
                <p className="font-semibold text-gray-800 text-sm leading-tight flex-1 pr-2">
                  {item.product.name}
                </p>
                <p className="text-blue-700 font-bold text-sm whitespace-nowrap">
                  {formatCurrency(item.product.price * item.quantity)}
                </p>
              </div>
              {showControls ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => decreaseQty(item.product.id)}
                      className="w-9 h-9 rounded-lg bg-gray-200 hover:bg-gray-300 active:bg-gray-400 flex items-center justify-center text-lg font-bold text-gray-700 transition-colors"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-bold text-gray-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increaseQty(item.product.id)}
                      className="w-9 h-9 rounded-lg bg-blue-100 hover:bg-blue-200 active:bg-blue-300 flex items-center justify-center text-lg font-bold text-blue-800 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <p className="text-xs text-gray-500">
                  {item.quantity} × {formatCurrency(item.product.price)}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <span className="text-base font-bold text-gray-700">Total</span>
          <span className="text-2xl font-extrabold text-blue-900">
            {formatCurrency(totalAmount)}
          </span>
        </div>
        <button
          onClick={onProceed}
          disabled={items.length === 0}
          className="w-full py-4 rounded-2xl text-lg font-bold text-white bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-slate-900 active:scale-95 disabled:bg-gray-200 disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all shadow-lg"
        >
          {items.length === 0 ? "Add items to proceed" : "Proceed to Payment →"}
        </button>
      </div>
    </div>
  );
}
