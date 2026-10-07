"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { fetchProducts } from "@/lib/db";
import { useCart } from "@/lib/CartContext";
import ProductCard from "@/components/ProductCard";
import CartPanel from "@/components/CartPanel";
import CategoryFilter from "@/components/CategoryFilter";
import ProgressIndicator from "@/components/ProgressIndicator";
import Toast from "@/components/Toast";

type Category = "All" | "Drinks" | "Food" | "Snacks";

interface ToastState {
  message: string;
  type: "success" | "error" | "info";
}

export default function OrderPage() {
  const router = useRouter();
  const { items, addItem, totalAmount } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<Category>("All");
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => setError("Failed to load products. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const showToast = useCallback((message: string, type: ToastState["type"] = "success") => {
    setToast({ message, type });
  }, []);

  const handleAdd = (product: Product) => {
    addItem(product);
    showToast(`${product.name} added to your order`);
  };

  const filtered =
    category === "All"
      ? products
      : products.filter((p) => p.category === category);

  const getCartQty = (productId: string) =>
    items.find((i) => i.product.id === productId)?.quantity ?? 0;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-slate-100">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-extrabold text-blue-700">CS Campus Store</h1>
            <p className="text-sm text-gray-500">Self-Service Kiosk</p>
          </div>
          <ProgressIndicator currentStep={1} />
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Products section */}
        <div className="flex-1 flex flex-col gap-4">
          <CategoryFilter
            selected={category}
            onChange={(cat) => setCategory(cat as Category)}
          />

          {loading && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-500">Loading products...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
              <p className="text-red-600 font-semibold">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={handleAdd}
                  cartQty={getCartQty(product.id)}
                />
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full text-center py-16 text-gray-400">
                  <p className="text-5xl mb-3">🔍</p>
                  <p>No products in this category.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Cart panel */}
        <div className="w-full lg:w-80 xl:w-96 lg:sticky lg:top-6 lg:self-start">
          <CartPanel
            items={items}
            totalAmount={totalAmount}
            onProceed={() => router.push("/review")}
          />
        </div>
      </main>
    </div>
  );
}
