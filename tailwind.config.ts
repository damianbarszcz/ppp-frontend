import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Noto Sans", "sans-serif"], // Czcionka dla nagłówków
        body: ["Noto Sans", "sans-serif"], // Czcionka dla treści
      },
    },
  },
  plugins: [],
} satisfies Config;
