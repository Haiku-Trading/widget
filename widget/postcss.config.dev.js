/* 
 * PostCSS config for Vite dev server (dev-main.tsx showcase page)
 * This uses unscoped Tailwind utilities for the showcase page itself
 */
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    tailwindcss,
    // No prefixwrap here - showcase page needs unscoped Tailwind
    autoprefixer,
  ],
};

