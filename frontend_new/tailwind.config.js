module.exports = {
  theme: {
    extend: {
      colors: {
        'side-bar': '#d1dede',
        'button': '#2c3e50',
      },
      animation: {
        spin: 'spin 2s linear infinite',
      },
      keyframes: {
        spin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  content: ['./src/**/*.{vue,js,ts}'],
  plugins: [require('daisyui')],
  daisyui: {
    themes: ["light", "dark"]
  },
};
