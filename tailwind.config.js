/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0b0f19",
        surface: "#1a1f2e",
        primary: "#6366f1", // Indigo-500
        secondary: "#ec4899", // Pink-500
        accent: "#8b5cf6", // Violet-500
      }
    },
  },
  plugins: [],
}
