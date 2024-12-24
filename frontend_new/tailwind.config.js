/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{vue,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    import('daisyui'),
  ],
  daisyui: {
    themes: ["light"],
  },
}

