export function formatCurrency(amount: number): string {
  return `₱${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

export function generateTransactionNumber(): string {
  const year = new Date().getFullYear();
  const seq = Math.floor(Math.random() * 99999).toString().padStart(5, "0");
  return `TXN-${year}-${seq}`;
}

export function generateQRReference(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let ref = "";
  for (let i = 0; i < 8; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `QR-TXN-${ref}`;
}

// Weekly restock day: 0 = Sunday, 1 = Monday, … 6 = Saturday
export const RESTOCK_WEEKDAY = 1;

// Next restock is the coming RESTOCK_WEEKDAY at midnight — always within 1 week
export function getNextRestockDate(from: Date = new Date()): Date {
  const next = new Date(from);
  next.setHours(0, 0, 0, 0);
  const daysAhead = (RESTOCK_WEEKDAY - next.getDay() + 7) % 7 || 7;
  next.setDate(next.getDate() + daysAhead);
  return next;
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
