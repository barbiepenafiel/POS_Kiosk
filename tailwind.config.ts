import type { Config } from "tailwindcss";

/** Wraps a CSS custom property so Tailwind can still apply opacity modifiers
 *  (e.g. `bg-surface/60`). The tokens are stored as bare HSL channels. */
const token = (name: string) => `hsl(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        app: {
          DEFAULT: token("app-bg"),
          accent: token("app-bg-accent"),
        },
        surface: {
          DEFAULT: token("surface"),
          sunken: token("surface-sunken"),
          raised: token("surface-raised"),
        },
        line: {
          DEFAULT: token("border"),
          strong: token("border-strong"),
        },
        ink: {
          DEFAULT: token("ink"),
          soft: token("ink-soft"),
          faint: token("ink-faint"),
          invert: token("ink-invert"),
        },
        brand: {
          DEFAULT: token("brand"),
          strong: token("brand-strong"),
          soft: token("brand-soft"),
          ink: token("brand-ink"),
        },
        accent: token("accent"),
        success: {
          DEFAULT: token("success"),
          soft: token("success-soft"),
          ink: token("success-ink"),
        },
        danger: {
          DEFAULT: token("danger"),
          soft: token("danger-soft"),
          ink: token("danger-ink"),
        },
        warning: {
          DEFAULT: token("warning"),
          soft: token("warning-soft"),
          ink: token("warning-ink"),
        },
        header: {
          from: token("header-from"),
          via: token("header-via"),
          to: token("header-to"),
        },
        overlay: token("overlay"),
      },
      ringColor: {
        DEFAULT: token("ring"),
      },
      borderRadius: {
        kiosk: "1.25rem",
      },
      minHeight: {
        touch: "44px",
      },
      minWidth: {
        touch: "44px",
      },
      boxShadow: {
        card: "0 1px 2px hsl(var(--shadow-color) / 0.06), 0 8px 24px -8px hsl(var(--shadow-color) / 0.14)",
        lift: "0 2px 4px hsl(var(--shadow-color) / 0.08), 0 16px 40px -12px hsl(var(--shadow-color) / 0.22)",
        modal: "0 24px 64px -16px hsl(var(--shadow-color) / 0.45)",
      },
      keyframes: {
        "pop-in": {
          "0%": { opacity: "0", transform: "scale(0.92) translateY(12px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "slide-down": {
          "0%": { opacity: "0", transform: "translate(-50%, -14px)" },
          "100%": { opacity: "1", transform: "translate(-50%, 0)" },
        },
      },
      animation: {
        "pop-in": "pop-in 280ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "slide-down": "slide-down 260ms cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};
export default config;
