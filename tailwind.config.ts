import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#282F45',
        'app-black': '#161616',
        'app-dark': '#3C4043',
        'app-silver': '#5A5A5A',
        'app-light-silver': '#939393',
        'app-white': '#ffffff',
        'app-dark-white': '#F2F3F7',
        'app-red': '#E7184C',
        'app-dark-red': '#b3153d',
        'app-green': '#35a34f',
        'app-dark-green': '#267838',
        'app-blue': '#3861DA',
        'app-dark-blue': '#2f4ead',
        'app-light-yellow': '#ffe7ab',
        'app-dark-yellow': '#856f38',
        'app-dark-gold': '#ffad41',
        'app-anthracite': '#272627',
      },
    },
  },
  plugins: [],
} satisfies Config;
