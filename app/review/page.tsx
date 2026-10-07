"use client";

export const dynamic = "force-dynamic";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCart } from "@/lib/CartContext";
import { formatCurrency } from "@/lib/utils";
import KioskHeader from "@/components/KioskHeader";

export default function ReviewPage() {
  const router = useRouter();
  const { items, totalAmount, totalItems } = useCart();

  useEffect(() => {
    if (items.length === 0) router.replace("/");
  }, [items.length, router]);

  if (items.length === 0) return null;

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-100 via-blue-50 to-blue-100 overflow-hidden">
      <KioskHeader step={2} />

      <div className="flex-1 overflow-hidden flex flex-col max-w-3xl mx-auto w-full px-4 py-3 gap-3">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-gray-800">Review Your Order</h2>
          <p className="text-gray-400 text-sm">{totalItems} item(s)</p>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-hidden flex flex-col bg-white rounded-2xl shadow-md border border-gray-100 min-h-0">
          {/* Header row */}
          <div className="px-5 py-2.5 bg-gray-50 border-b border-gray-100 flex-shrink-0 grid grid-cols-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <span className="col-span-2">Item</span>
            <span className="text-center">Qty</span>
            <span className="text-right">Subtotal</span>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-hidden divide-y divide-gray-50">
            {items.map((item) => (
              <div key={item.product.id} className="px-5 py-3 grid grid-cols-4 items-center">
                <div className="col-span-2">
                  <p className="font-semibold text-gray-800 text-sm">{item.product.name}</p>
                  <p className="text-xs text-gray-400">{formatCurrency(item.product.price)} each</p>
                </div>
                <p className="text-center font-bold text-gray-700">{item.quantity}</p>
                <p className="text-right font-bold text-blue-900 text-sm">
                  {formatCurrency(item.product.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          {/* Total row */}
          <div className="flex-shrink-0 px-5 py-3 bg-blue-50 border-t border-blue-100 flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">{totalItems} item(s)</p>
              <p className="font-bold text-gray-700 text-sm">Order Total</p>
            </div>
            <p className="text-2xl font-extrabold text-blue-900">{formatCurrency(totalAmount)}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex-shrink-0 flex gap-3">
          <button
            onClick={() => router.back()}
            className="flex-1 py-3.5 rounded-2xl text-base font-bold text-gray-700 bg-white border-2 border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-colors shadow-sm"
          >
            ← Back
          </button>
          <button
            onClick={() => router.push("/payment")}
            className="flex-[2] py-3.5 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-slate-900 transition-all shadow-lg"
          >
            Continue to Payment →
          </button>
        </div>
      </div>
    </div>
  );
}
