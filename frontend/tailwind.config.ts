import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        maya: {
          purple: '#7C3AED',
          'purple-light': '#EDE9FE',
          'purple-dark': '#5B21B6',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
