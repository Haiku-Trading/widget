// PostCSS config for Vite dev server - no scoping for dev pages
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const devTailwindConfig = require('./tailwind.config.dev.js');

export default {
  plugins: [
    // Use separate Tailwind config for dev pages
    tailwindcss(devTailwindConfig),
    autoprefixer,
    // No scoping - dev pages need unscoped CSS
  ],
};
