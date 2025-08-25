/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './resources/**/*.{js,ts,jsx,tsx,vue,blade.php}',
    './resources/css/**/*.css',
    './public/**/*.html'
  ],
  theme: {
    extend: {
      colors: {
        'rt-primary': '#DC2626',
        'rt-secondary': '#FDE047',
        'rt-accent': '#B91C1C',
        'rt-background': '#FFFBEB',
        'rt-text': '#1F2937',
      }
    }
  },
  plugins: [
    require('tailwindcss-animate')
  ]
};
