export default {
    theme: {
      extend: {
        colors: {
          'side-bar': '#d1dede',
        },
      }
    },
    content: ['./src/**/*.{vue,js,ts}'],
    plugins: [require('daisyui')],
    themes: ["light", "dark"]
  }