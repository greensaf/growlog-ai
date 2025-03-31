import { type Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class', // <— позволяет переключать тему по классу .dark
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#00B37E',
          dark: '#009e6a',
        },
      },
    },
  },
  plugins: [],
};

export default config;
