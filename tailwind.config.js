/** @type {import('tailwindcss').Config} */
module.exports = {
  // Safelist rt-* utilities that are used dynamically or contain slashes (opacity)
  safelist: [
    {
      pattern: /^((?:bg|text|from|to|via|border)-rt-(?:primary|secondary|accent|background|text)(?:\/\d{1,3})?)$/,
    },
    // Explicitly include common class names used in the code to be safe
    'bg-rt-primary',
    'bg-rt-primary/10',
    'bg-rt-secondary/20',
    'bg-rt-accent',
    'bg-rt-background',
    'text-rt-text',
    'text-rt-text/70',
    'from-rt-primary',
    'via-rt-accent',
    'to-rt-primary',
    'from-rt-primary/10',
    'via-rt-secondary/20',
    'to-rt-primary/10',
    'border-rt-secondary/30'
  ],
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
