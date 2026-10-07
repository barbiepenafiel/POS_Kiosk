import { getSupabaseClient } from "./supabase";
import { CartItem, PaymentMethod } from "@/types";
import { generateTransactionNumber } from "./utils";

// Until supabase/add-stock.sql has been run the products table has no stock
// column, so the kiosk keeps its own count in this browser instead.
const DEFAULT_STOCK = 10;
const LOCAL_STOCK_KEY = "kiosk_stock";

function readLocalStock(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(LOCAL_STOCK_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function deductLocalStock(cartItems: CartItem[]) {
  if (typeof window === "undefined") return;
  const localStock = readLocalStock();
  for (const item of cartItems) {
    const current = localStock[item.product.id] ?? item.product.stock ?? DEFAULT_STOCK;
    localStock[item.product.id] = Math.max(current - item.quantity, 0);
  }
  try {
    window.localStorage.setItem(LOCAL_STOCK_KEY, JSON.stringify(localStock));
  } catch {
    // Storage unavailable — counts reset to DEFAULT_STOCK on next load
  }
}

export async function fetchProducts() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("available", true)
    .order("category")
    .order("name");

  if (error) throw error;

  const localStock = readLocalStock();
  return data.map((product) =>
    product.stock === undefined
      ? { ...product, stock: localStock[product.id] ?? DEFAULT_STOCK }
      : product
  );
}

export async function saveTransaction(
  cartItems: CartItem[],
  totalAmount: number,
  paymentMethod: PaymentMethod,
  amountPaid: number,
  changeAmount: number
) {
  const supabase = getSupabaseClient();
  const transactionNumber = generateTransactionNumber();

  const { data: txn, error: txnError } = await supabase
    .from("transactions")
    .insert({
      transaction_number: transactionNumber,
      total_amount: totalAmount,
      payment_method: paymentMethod,
      amount_paid: amountPaid,
      change_amount: changeAmount,
      payment_status: "completed",
    })
    .select()
    .single();

  if (txnError) throw txnError;

  const items = cartItems.map((item) => ({
    transaction_id: txn.id,
    product_id: item.product.id,
    product_name: item.product.name,
    quantity: item.quantity,
    unit_price: item.product.price,
    subtotal: item.product.price * item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from("transaction_items")
    .insert(items);

  if (itemsError) throw itemsError;

  // Deduct sold quantities from stock. The sale is already recorded, so a
  // failure here must not fail checkout.
  const stockResults = await Promise.all(
    cartItems.map((item) =>
      supabase.rpc("decrement_stock", {
        p_product_id: item.product.id,
        p_quantity: item.quantity,
      })
    )
  );
  const stockError = stockResults.find((r) => r.error)?.error;
  if (stockError?.code === "PGRST202") {
    // decrement_stock doesn't exist yet (add-stock.sql not run) — count locally
    deductLocalStock(cartItems);
  } else if (stockError) {
    console.error("Failed to update stock:", stockError.message);
  }

  return txn;
}

export async function fetchTransactionWithItems(transactionId: string) {
  const supabase = getSupabaseClient();

  const { data: txn, error: txnError } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", transactionId)
    .single();

  if (txnError) throw txnError;

  const { data: items, error: itemsError } = await supabase
    .from("transaction_items")
    .select("*")
    .eq("transaction_id", transactionId)
    .order("product_name");

  if (itemsError) throw itemsError;

  return { transaction: txn, items };
}
