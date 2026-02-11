import prefixSelector from 'postcss-prefix-selector';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    tailwindcss,
    autoprefixer,
    // Scope all CSS to the widget container to prevent conflicts with parent page
    // This runs after Tailwind generates the CSS, so all utility classes and base resets are scoped
    prefixSelector({
      prefix: '.haiku-widget-theme-container',
      // Exclude keyframes definitions (they're referenced by name, not selector)
      exclude: [/^@keyframes/],
      // Transform selectors to handle special cases
      transform: (prefix, selector, prefixedSelector) => {
        // Don't prefix keyframes
        if (selector.startsWith('@keyframes')) {
          return selector;
        }
        // Scope :root to the container (for CSS variables)
        if (selector === ':root') {
          return `${prefix}`;
        }
        // Scope .dark to the container
        if (selector === '.dark') {
          return `${prefix}.dark`;
        }
        // Default: use the prefixed selector
        return prefixedSelector;
      },
    }),
  ],
};
