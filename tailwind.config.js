/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',  // Scan all files in the pages directory
    './components/**/*.{js,ts,jsx,tsx}',  // Scan all files in the components directory
    './app/**/*.{js,ts,jsx,tsx}',  // For Next.js app directory (if using it)
    './src/**/*.{js,ts,jsx,tsx}'   // If you have a src directory
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
