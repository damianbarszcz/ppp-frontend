import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Noto Sans", "sans-serif"], // Czcionka dla nagłówków
        body: ["Noto Sans", "sans-serif"], // Czcionka dla treści
      },
      colors: {
        'custom-blue': '#282F45',
        'action-red': '#E7184C',
      },
    },
  },
  plugins: [],
} satisfies Config;
