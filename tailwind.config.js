/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'anton': ['var(--font-anton)', 'sans-serif'],
        'roboto': ['var(--font-roboto)', 'sans-serif'],
        'sans': ['var(--font-roboto)', 'sans-serif'],
      },
      colors: {
        'primary': '#1a1a1a',
        'secondary': '#DBDBDB',
        'accent': '#fe0000',
        'accent-hover': '#cd1718',
        'background': 'var(--background)',
        'foreground': 'var(--foreground)',
      },
    },
  },
  plugins: [],
}