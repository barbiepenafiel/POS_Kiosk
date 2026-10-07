export interface Product {
  id: string;
  name: string;
  category: "Drinks" | "Food" | "Snacks";
  price: number;
  image_url: string | null;
  available: boolean;
  // From the database once supabase/add-stock.sql has been run, otherwise a local count
  stock?: number | null;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Transaction {
  id: string;
  transaction_number: string;
  total_amount: number;
  payment_method: "Cash" | "QR" | "Card";
  amount_paid: number;
  change_amount: number;
  payment_status: "completed" | "pending" | "failed";
  created_at: string;
}

export interface TransactionItem {
  id: string;
  transaction_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface ReceiptData {
  transaction: Transaction;
  items: TransactionItem[];
}

export type PaymentMethod = "Cash" | "QR" | "Card";

export type KioskStep = "order" | "review" | "payment" | "receipt";
