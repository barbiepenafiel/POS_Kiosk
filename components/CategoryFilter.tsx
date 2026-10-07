"use client";

type Category = "All" | "Drinks" | "Food" | "Snacks";

const CATEGORIES: Category[] = ["All", "Drinks", "Food", "Snacks"];

interface Props {
  selected: Category;
  onChange: (cat: Category) => void;
}

export default function CategoryFilter({ selected, onChange }: Props) {
  return (
    <div className="flex gap-2 flex-wrap">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all min-h-[44px] ${
            selected === cat
              ? "bg-gradient-to-r from-blue-800 to-blue-900 text-white shadow-md"
              : "bg-white text-gray-600 border border-gray-200 hover:border-blue-700 hover:text-blue-800"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
