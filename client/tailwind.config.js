/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // This matches your Context logic root.classList.add(theme)
  theme: {
    extend: {
      colors: {
        // We use the CSS variables we'll define in the next step
        main: "var(--text-main)",
        "bg-main": "var(--bg-main)",
      },
      fontFamily: {
        aether: ["AetherModern", "sans-serif"],
      },
    },
  },
  plugins: [],
};
