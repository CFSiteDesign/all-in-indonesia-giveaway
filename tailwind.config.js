/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#C6FF00",
      },
      fontFamily: {
        display: ["Anton", "Archivo Black", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
};
