# CampusTapXP — Touchscreen POS Kiosk

A self-service touchscreen Point-of-Sale kiosk web application built for **IT415**. Designed for campus stores with a clean 4-step order flow, real-time Supabase database, and full mobile/tablet touch support.

**Live Demo:** [pos-kiosk-iota.vercel.app](https://pos-kiosk-iota.vercel.app)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Deployment | Vercel |
| QR Code | qrcode.react |

---

## Application Flow

```
Order → Review → Payment → Receipt
```

| Step | Screen | Description |
|---|---|---|
| 1 | **Order** | Browse products by category, tap to add to cart, adjust quantities |
| 2 | **Review** | Confirm order items and total before proceeding |
| 3 | **Payment** | Choose Cash, QR, or Card — cash includes numpad + change calculation |
| 4 | **Receipt** | Digital receipt with transaction number, print support, and new transaction reset |

---

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Set up the database

1. Go to [supabase.com](https://supabase.com) and open your project.
2. Navigate to **SQL Editor** and run the contents of `supabase/schema.sql`.
   - Creates `products`, `transactions`, and `transaction_items` tables
   - Seeds 6 sample products
   - Configures Row Level Security (RLS) policies

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Vercel Deployment

1. Push the project to GitHub.
2. Import the repository at [vercel.com](https://vercel.com).
3. Add the following Environment Variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy — Vercel builds and deploys automatically on every push.

---

## Project Structure

```
app/
  page.tsx              # Order screen (product catalog + cart)
  review/page.tsx       # Order review
  payment/page.tsx      # Payment method selection
  receipt/[id]/page.tsx # Digital receipt

components/
  KioskHeader.tsx       # Branded header with step progress
  CartPanel.tsx         # Slide-in cart sidebar
  ProductCard.tsx       # Tap-to-add product tile
  Toast.tsx             # Notification toasts
  payment/
    CashPayment.tsx     # Numpad + quick amounts + change calc
    QRPayment.tsx       # QR code display (qrcode.react)
    CardPayment.tsx     # Card tap/swipe simulation

lib/
  CartContext.tsx        # Global cart state (useReducer)
  db.ts                  # Supabase query helpers
  supabase.ts            # Lazy Supabase client
  utils.ts               # Currency formatter, date helpers

supabase/
  schema.sql             # Full DB schema + seed data
```

---

## Features Checklist

- [x] Touchscreen-optimized UI with large touch targets (min 44px)
- [x] Large product cards — tap anywhere to add to cart
- [x] At least 6 products loaded from Supabase
- [x] Prices displayed in Philippine Peso (₱)
- [x] Quantity increase / decrease controls
- [x] Remove item from cart
- [x] Correct subtotals and order total
- [x] Order review screen before payment
- [x] Order modification (back button preserves cart)
- [x] Three payment methods: Cash, QR, Card
- [x] Cash payment with numeric keypad + quick amount buttons
- [x] Insufficient cash rejected with error message
- [x] Change calculation displayed
- [x] QR payment with real scannable QR code
- [x] Card payment simulation with processing animation
- [x] Payment success notification overlay
- [x] Unique transaction reference (TXN-YYYY-XXXXX)
- [x] Transaction saved to Supabase
- [x] Digital receipt with all order details
- [x] Print receipt via browser
- [x] New Transaction resets everything and returns to Order screen
- [x] Toast notifications for all user actions
- [x] Non-scrollable kiosk layout (fits any screen)
- [x] Deployed to Vercel

---

## Author

**Barbie Penafiel
Christian Jericho Loquillano 
Kervin Remonde** — IT415 Practical Exam
