import { getSupabaseClient } from "./supabase";
import { CartItem, PaymentMethod } from "@/types";
import { generateTransactionNumber } from "./utils";

export async function fetchProducts() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("available", true)
    .order("category")
    .order("name");

  if (error) throw error;
  return data;
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
