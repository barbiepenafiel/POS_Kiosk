"use client";

import React, { createContext, useContext, useEffect, useReducer, useState, ReactNode } from "react";
import { CartItem, Product } from "@/types";

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_ITEM"; product: Product }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "INCREASE_QTY"; productId: string }
  | { type: "DECREASE_QTY"; productId: string }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; items: CartItem[] };

// True when the cart already holds every unit in stock (no limit if stock is unknown)
function atStockLimit(product: Product, quantity: number): boolean {
  return product.stock != null && quantity >= product.stock;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (i) => i.product.id === action.product.id
      );
      if (atStockLimit(action.product, existing?.quantity ?? 0)) return state;
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === action.product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { items: [...state.items, { product: action.product, quantity: 1 }] };
    }
    case "REMOVE_ITEM":
      return { items: state.items.filter((i) => i.product.id !== action.productId) };
    case "INCREASE_QTY":
      return {
        items: state.items.map((i) =>
          i.product.id === action.productId && !atStockLimit(i.product, i.quantity)
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ),
      };
    case "DECREASE_QTY": {
      const item = state.items.find((i) => i.product.id === action.productId);
      if (!item) return state;
      if (item.quantity <= 1) {
        return { items: state.items.filter((i) => i.product.id !== action.productId) };
      }
      return {
        items: state.items.map((i) =>
          i.product.id === action.productId
            ? { ...i, quantity: i.quantity - 1 }
            : i
        ),
      };
    }
    case "CLEAR_CART":
      return { items: [] };
    case "LOAD_CART":
      return { items: action.items };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  increaseQty: (productId: string) => void;
  decreaseQty: (productId: string) => void;
  clearCart: () => void;
  totalAmount: number;
  totalItems: number;
  // False until the saved cart has been restored — don't treat the cart as empty before then
  hydrated: boolean;
}

// The cart is kept in sessionStorage so a page reload mid-checkout doesn't lose the order
const CART_STORAGE_KEY = "kiosk_cart";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem(CART_STORAGE_KEY);
      if (saved) dispatch({ type: "LOAD_CART", items: JSON.parse(saved) });
    } catch {
      // Unreadable or unavailable storage — start with an empty cart
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // Storage unavailable — cart stays in memory only
    }
  }, [hydrated, state.items]);

  const totalAmount = state.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem: (product) => dispatch({ type: "ADD_ITEM", product }),
        removeItem: (productId) => dispatch({ type: "REMOVE_ITEM", productId }),
        increaseQty: (productId) => dispatch({ type: "INCREASE_QTY", productId }),
        decreaseQty: (productId) => dispatch({ type: "DECREASE_QTY", productId }),
        clearCart: () => dispatch({ type: "CLEAR_CART" }),
        totalAmount,
        totalItems,
        hydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
