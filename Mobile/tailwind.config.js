/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./utils/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
    "./store/**/*.{js,jsx,ts,tsx}",
    "./services/**/*.{js,jsx,ts,tsx}",
    "./constants/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
   extend: {
      colors: {
        primary: '#111827', // Off-black
        secondary: '#6B7280', // Soft Gray
        background: '#F3F4F6', // Light Gray Bg
        surface: '#ffffff', // White
        accent: '#6366f1', // Indigo
      },
    },
  },
  plugins: [],
};
