// arquivo: frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  // CRUCIAL: Mapeia todos os arquivos React para que o Tailwind
  // saiba onde procurar as classes que você está usando.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}