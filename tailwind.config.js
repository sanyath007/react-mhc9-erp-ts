/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sarabun: [
          "'TH SarabunPSK'",
          "'Sarabun'",
          ...defaultTheme.fontFamily.sans,
        ],
      },
    },
  },
  plugins: [],
}

