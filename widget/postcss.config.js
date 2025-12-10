import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import prefixwrap from 'postcss-prefixwrap';

export default {
  plugins: [
    tailwindcss,
    // Wrap all Tailwind-generated CSS in .haiku-widget-theme-container
    // This scopes all utilities and components to the widget container
    // We'll manually scope :root and .dark in styles.css
    prefixwrap('.haiku-widget-theme-container', {
      ignoredSelectors: [':root', '.dark', '@media'], // We'll scope these manually in styles.css
      prefixRootTags: false, // Don't prefix root-level tags
    }),
    autoprefixer,
  ],
};
