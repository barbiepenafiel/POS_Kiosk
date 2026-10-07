"use client";

type Category = "All" | "Drinks" | "Food" | "Snacks";

const CATEGORIES: { value: Category; icon: string }[] = [
  { value: "All", icon: "🗂" },
  { value: "Drinks", icon: "🥤" },
  { value: "Food", icon: "🥪" },
  { value: "Snacks", icon: "🍪" },
];

interface Props {
  selected: Category;
  onChange: (cat: Category) => void;
}

export default function CategoryFilter({ selected, onChange }: Props) {
  return (
    <div
      role="tablist"
      aria-label="Product categories"
      className="flex flex-wrap gap-2"
    >
      {CATEGORIES.map((cat) => {
        const active = selected === cat.value;
        return (
          <button
            key={cat.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(cat.value)}
            className={`flex min-h-touch items-center gap-2 rounded-full border-2 px-4 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
              active
                ? "border-brand bg-brand text-ink-invert shadow-card"
                : "border-line bg-surface text-ink-soft active:bg-surface-sunken"
            }`}
          >
            <span aria-hidden>{cat.icon}</span>
            {cat.value}
          </button>
        );
      })}
    </div>
  );
}
