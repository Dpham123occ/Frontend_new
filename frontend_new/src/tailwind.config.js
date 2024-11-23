// not in use anymore
// tailwind.config.js
module.exports = {
    content: [
      "../index.html",
      "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          // Primary Colors
          'black-iron': '#231F20',
          'bronze-leather': '#967444',
  
          // Secondary Colors
          'trail-dust': '#d8d2c4',
          'texas-sky': '#d1dede',
        },
        fontFamily: {
          'primary-brand': ['Inglesia Caps Variable', 'serif'], // Primary Brand Font
          'secondary': ['Brother 1816 Reg', 'sans-serif'],       // Secondary Fonts
          'secondary-light': ['Brother 1816 Light', 'sans-serif'],
          'secondary-bold': ['Brother 1816 Bold', 'sans-serif'],
        }
      },
    },
    plugins: [],
  }
  