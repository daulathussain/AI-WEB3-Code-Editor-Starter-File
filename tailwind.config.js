/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "remix-dark": "#1e1e2e",
        "remix-sidebar": "#252536",
        "remix-border": "#464866",
        "remix-highlight": "#31394d",
      },
    },
  },
  plugins: [],
};
