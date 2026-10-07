// Run with: node supabase/insert-menu-items.js
// Inserts the additional menu items into the database using the publishable key.
// Safe to re-run: products whose name already exists are skipped.

const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// Load NEXT_PUBLIC_* values from .env.local (same ones the app uses)
const envPath = path.join(__dirname, "..", ".env.local");
for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
  const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (match && !process.env[match[1]]) {
    process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const newProducts = [
  { name: "Burger",        category: "Food",   price: 50.00,  available: true },
  { name: "Pizza",         category: "Food",   price: 100.00, available: true },
  { name: "Fried Chicken", category: "Food",   price: 30.00,  available: true },
  { name: "Hotdog",        category: "Food",   price: 30.00,  available: true },
  { name: "Matcha",        category: "Drinks", price: 70.00,  available: true },
  { name: "Frappe",        category: "Drinks", price: 100.00, available: true },
  { name: "Juice",         category: "Drinks", price: 20.00,  available: true },
  { name: "Ice Cream",     category: "Snacks", price: 30.00,  available: true },
  { name: "Candies",       category: "Snacks", price: 20.00,  available: true },
  { name: "Gummy Bear",    category: "Snacks", price: 20.00,  available: true },
  { name: "Marshmallows",  category: "Snacks", price: 30.00,  available: true },
];

async function insertMenuItems() {
  const { data: existing, error: fetchError } = await supabase
    .from("products")
    .select("name");

  if (fetchError) {
    console.error("Error reading products:", fetchError.message);
    console.error("Code:", fetchError.code);
    console.error("\nMake sure you have run supabase/schema.sql in the Supabase SQL Editor first.");
    process.exit(1);
  }

  const existingNames = new Set(existing.map((p) => p.name));
  const toInsert = newProducts.filter((p) => !existingNames.has(p.name));
  const skipped = newProducts.filter((p) => existingNames.has(p.name));

  if (skipped.length > 0) {
    console.log("Already in database, skipped:", skipped.map((p) => p.name).join(", "));
  }

  if (toInsert.length === 0) {
    console.log("Nothing to insert.");
    return;
  }

  const { data, error } = await supabase
    .from("products")
    .insert(toInsert)
    .select();

  if (error) {
    console.error("Error inserting products:", error.message);
    console.error("Code:", error.code);
    process.exit(1);
  }

  console.log(`Inserted ${data.length} product(s) successfully!`);
  for (const p of data) {
    console.log(`  ${p.category.padEnd(6)}  ${p.name.padEnd(14)}  ₱${p.price}`);
  }
}

insertMenuItems();
