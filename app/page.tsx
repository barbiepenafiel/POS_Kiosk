"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { fetchProducts } from "@/lib/db";
import { useCart } from "@/lib/CartContext";
import ProductCard from "@/components/ProductCard";
import CartPanel from "@/components/CartPanel";
import CategoryFilter from "@/components/CategoryFilter";
import KioskHeader from "@/components/KioskHeader";
import Toast from "@/components/Toast";

type Category = "All" | "Drinks" | "Food" | "Snacks";

export default function OrderPage() {
  const router = useRouter();
  const { items, addItem, totalAmount } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<Category>("All");
  const [toast, setToast] = useState<{ message: string } | null>(null);

  useEffect(() => {
    let active = true;
    fetchProducts()
      .then((data) => {
        if (active) setProducts(data);
      })
      .catch(() => {
        if (active) setError("Failed to load products. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleAdd = (product: Product) => {
    addItem(product);
    setToast({ message: `${product.name} added to order` });
  };

  const filtered =
    category === "All"
      ? products
      : products.filter((p) => p.category === category);

  const getCartQty = (productId: string) =>
    items.find((i) => i.product.id === productId)?.quantity ?? 0;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gradient-to-br from-app via-app to-app-accent">
      {toast && (
        <Toast
          message={toast.message}
          type="success"
          duration={1600}
          onClose={() => setToast(null)}
        />
      )}

      <KioskHeader step={1} />

      <main className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:gap-6">
        {/* Catalog */}
        <div className="flex min-h-0 flex-1 flex-col gap-3">
          <CategoryFilter
            selected={category}
            onChange={(cat) => setCategory(cat)}
          />

          {loading && (
            <div className="flex flex-1 items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="h-11 w-11 animate-spin rounded-full border-4 border-line border-t-brand" />
                <p className="text-sm font-medium text-ink-soft">
                  Loading products…
                </p>
              </div>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="rounded-kiosk border border-danger/40 bg-danger-soft p-5 text-center"
            >
              <p className="font-bold text-danger-ink">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="min-h-0 flex-1 overflow-y-auto pb-1">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                {filtered.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={handleAdd}
                    cartQty={getCartQty(product.id)}
                  />
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="flex flex-col items-center gap-2 py-16 text-ink-faint">
                  <span aria-hidden className="text-4xl opacity-60">
                    🔍
                  </span>
                  <p className="text-sm font-medium">
                    No products in this category.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Cart — full-height column on desktop, capped panel on mobile */}
        <div className="flex max-h-[45vh] min-h-0 w-full flex-shrink-0 lg:max-h-none lg:w-80 xl:w-96">
          <div className="min-h-0 w-full">
            <CartPanel
              items={items}
              totalAmount={totalAmount}
              onProceed={() => router.push("/review")}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
