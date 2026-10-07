"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { formatCurrency } from "@/lib/utils";
import ProgressIndicator from "@/components/ProgressIndicator";
import CartPanel from "@/components/CartPanel";

export default function ReviewPage() {
  const router = useRouter();
  const { items, totalAmount, totalItems } = useCart();

  if (items.length === 0) {
    router.replace("/");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-slate-100">
      <header className="bg-white shadow-sm px-6 py-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-extrabold text-blue-700">CS Campus Store</h1>
            <p className="text-sm text-gray-500">Self-Service Kiosk</p>
          </div>
          <ProgressIndicator currentStep={2} />
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-800">Review Your Order</h2>
          <p className="text-gray-500 mt-1">{totalItems} item(s) in your order</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
            <div className="grid grid-cols-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <span className="col-span-2">Item</span>
              <span className="text-center">Qty</span>
              <span className="text-right">Subtotal</span>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {items.map((item) => (
              <div key={item.product.id} className="px-6 py-4 grid grid-cols-4 items-center">
                <div className="col-span-2">
                  <p className="font-semibold text-gray-800">{item.product.name}</p>
                  <p className="text-xs text-gray-400">{formatCurrency(item.product.price)} each</p>
                </div>
                <p className="text-center font-bold text-gray-700">{item.quantity}</p>
                <p className="text-right font-bold text-blue-700">
                  {formatCurrency(item.product.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
          <div className="px-6 py-5 bg-blue-50 border-t border-blue-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">{totalItems} item(s)</p>
                <p className="font-bold text-gray-700">Order Total</p>
              </div>
              <p className="text-3xl font-extrabold text-blue-700">
                {formatCurrency(totalAmount)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => router.back()}
            className="flex-1 py-4 rounded-2xl text-lg font-bold text-gray-700 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:bg-gray-100 transition-colors shadow-sm"
          >
            ← Back
          </button>
          <button
            onClick={() => router.push("/payment")}
            className="flex-[2] py-4 rounded-2xl text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-lg"
          >
            Continue to Payment →
          </button>
        </div>
      </main>
    </div>
  );
}
