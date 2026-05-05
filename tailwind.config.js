export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        // This matches the name you defined in @font-face
        aether: ["AetherModern", "sans-serif"],
      },
    },
  },
  plugins: [],
};