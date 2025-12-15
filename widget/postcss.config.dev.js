// PostCSS config for Vite dev server - no scoping for dev pages
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // No scoping - dev pages need unscoped CSS
  },
};
