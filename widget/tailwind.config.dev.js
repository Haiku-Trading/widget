/** @type {import('tailwindcss').Config} */
module.exports = {
  // Separate config for dev pages - scans dev-main files
  content: [
    './src/dev-main.tsx',
    './src/dev-main-dist.tsx',
    './index.html',
    './index-dist.html',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

