/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", '../../node_modules/@tailwind.css/line-clamp/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        'ibmReg': ['IBMPlexSans-Regular'],
        'ibmMed': ['IBMPlexSans-Medium'],
        'ibmBold': ['IBMPlexSans-Bold']
      },
      colors: {
        'purple': '#5D5FEF',
        'white': '#FCFCFD',
        'dgrey': '#323643',
        'grey': '#9AA0B4',
        'lgrey': '#D9D9D9',
        'violet': '#A5A6F6',
        'red': '#FF3838',
        'yellow': '#FFC529',
        'green': '#4EE476'
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}
