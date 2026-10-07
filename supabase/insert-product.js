// Run with: node supabase/insert-product.js
// Inserts a new product into the database using the publishable key

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://rywearsoudbbwelixqmn.supabase.co",
  "sb_publishable_BeEv4rXk-yHYpcQexNP33A_xTEO6YbC"
);

async function insertProduct() {
  const newProduct = {
    name: "Iced Tea",
    category: "Drinks",
    price: 30.00,
    available: true,
  };

  const { data, error } = await supabase
    .from("products")
    .insert(newProduct)
    .select()
    .single();

  if (error) {
    console.error("Error inserting product:", error.message);
    console.error("Code:", error.code);
    console.error("\nMake sure you have run supabase/schema.sql in the Supabase SQL Editor first.");
    process.exit(1);
  }

  console.log("Product inserted successfully!");
  console.log(JSON.stringify(data, null, 2));
}

insertProduct();
