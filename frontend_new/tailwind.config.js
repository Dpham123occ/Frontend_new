module.exports = {
  theme: {
    extend: {
      colors: {
        'side-bar': '#d1dede',
        'side-bar-2': '#231F20',
        'button': '#2c3e50',
        'gold': "#967444",
      },
    },
  },
  content: ['./src/**/*.{vue,js,ts}'],
  plugins: [require('daisyui')],
  daisyui: {
    themes: ["light", "dark"]
  },
};
