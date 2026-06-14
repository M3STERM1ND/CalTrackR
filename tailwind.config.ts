import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1rem" },
    extend: {
      colors: {
        // brand
        canvas: { top: "#EAF6EC", bottom: "#D8ECDD" },
        ink: { DEFAULT: "#15241B", soft: "#4A5C50", muted: "#7C8C82" },
        leaf: { DEFAULT: "#1E9E58", press: "#18814A" },
        lime: "#B6E84B",
        line: "#E2ECE4",
        // macro data colors
        protein: "#3B6FE0",
        carbs: "#E8A93B",
        fat: "#E2664A",
        // shadcn semantic tokens (kept so generated ui/* components behave)
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: { DEFAULT: "var(--primary)", foreground: "var(--primary-foreground)" },
        secondary: { DEFAULT: "var(--secondary)", foreground: "var(--secondary-foreground)" },
        muted: { DEFAULT: "var(--muted)", foreground: "var(--muted-foreground)" },
        accent: { DEFAULT: "var(--accent)", foreground: "var(--accent-foreground)" },
        destructive: { DEFAULT: "var(--destructive)", foreground: "var(--destructive-foreground)" },
        card: { DEFAULT: "var(--card)", foreground: "var(--card-foreground)" },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        xl: "22px",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(21,36,27,.06), 0 1px 3px rgba(21,36,27,.05)",
        card: "0 10px 30px -12px rgba(21,55,33,.22), 0 2px 8px rgba(21,36,27,.05)",
      },
      keyframes: {
        sweep: {
          "0%": { top: "6%", opacity: "0" },
          "15%": { opacity: "1" },
          "85%": { opacity: "1" },
          "100%": { top: "94%", opacity: "0" },
        },
        rise: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "none" },
        },
        pulse_dot: {
          "0%,100%": { opacity: "0.35", transform: "scale(0.8)" },
          "50%": { opacity: "1", transform: "scale(1.15)" },
        },
      },
      animation: {
        sweep: "sweep 1.6s ease-in-out infinite",
        rise: "rise 0.45s cubic-bezier(.2,.7,.2,1) forwards",
        "pulse-dot": "pulse_dot 1s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
