import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        medical: {
          50: '#e8f0fe',
          100: '#c5d8fb',
          500: '#2c7be5',
          600: '#1a5bbf',
          700: '#174fa8',
        },
      },
    },
  },
  plugins: [],
}

export default config
