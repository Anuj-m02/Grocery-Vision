/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      boxShadow: {
        glow: "0 0 10px rgba(66, 153, 225, 0.5)",
        "glow-lg": "0 0 15px rgba(66, 153, 225, 0.6)",
      },
    },
  },
  plugins: [],
};
