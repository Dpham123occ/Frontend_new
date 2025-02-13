module.exports = {
  theme: {
    extend: {
      colors: {
        'side-bar': '#d1dede',
        'button': '#2c3e50',
      },
    },
  },
  content: ['./src/**/*.{vue,js,ts}'],
  plugins: [require('daisyui')],
  daisyui: {
    themes: ["light", "dark"]
  },
};
