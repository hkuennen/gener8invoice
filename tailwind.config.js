/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      width: {
        '5p': '5%',
        '13p': '13%',
        '17p': '17%',
        '50p': '50%',
        '52p': '52%',
        '70p': '70%',
        '80p': '80%',
        '95p': '95%',
      }
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
  ],
}

