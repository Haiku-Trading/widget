/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'hsl(var(--bg-primary))',
          surface: 'hsl(var(--bg-surface))',
          section: 'hsl(var(--bg-section))',
        },
        'stroke-grey': {
          primary: 'hsl(var(--stroke-grey-primary))',
          secondary: 'hsl(var(--stroke-grey-secondary))',
        },
        warning: {
          text: 'hsl(var(--warning))',
          bg: 'hsl(var(--warning-bg))',
          border: 'hsl(var(--warning-border))',
        },
        slippage: {
          'warning-bg': 'hsl(var(--slippage-warning-bg))',
          'warning-text': 'hsl(var(--slippage-warning-text))',
          'error-bg': 'hsl(var(--slippage-error-bg))',
          'error-text': 'hsl(var(--slippage-error-text))',
        },
        icon: {
          primary: 'hsl(var(--icon-primary))',
          subtle: 'hsl(var(--icon-subtle))',
          disabled: 'hsl(var(--icon-disabled))',
        },
        state: {
          error: {
            default: 'hsl(var(--state-error-default))',
          },
          subtle: 'hsl(var(--icon-subtle))',
          disabled: 'hsl(var(--icon-disabled))',
          highlight: {
            light: 'hsl(var(--state-highlight-light))',
          },
        },
        background: 'hsl(var(--background))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        overlay: 'hsl(var(--overlay))',
        secondary: 'hsl(var(--secondary))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        tertiary: 'hsl(var(--tertiary))',
        foreground: 'hsl(var(--foreground))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        border: 'hsl(var(--border))',
        active: 'hsl(var(--active))',
        'active-border': 'hsl(var(--active-border))',
        filled: 'hsl(var(--filled))',
        'scroll-bar': 'hsl(var(--scroll-bar))',
        'sec-border': 'hsl(var(--sec-border))',
        'black-medium': '#191919',
        light: '#FCFCFC',
        failed: 'hsl(var(--failed))',
        success: 'hsl(var(--success))',
        info: 'hsl(var(--info))',
        divider: 'hsl(var(--divider))',
        section: 'hsl(var(--section))',
        disabled: 'hsl(var(--disabled))',
        neutral: 'hsl(var(--neutral))',
        bar: 'hsl(var(--bar))',
        'footer-icons': 'hsl(var(--footer-icons))',
        'sec-btn': 'hsl(var(--sec-btn))',
        grey: {
          primary: 'hsl(var(--text-grey-primary))',
          secondary: 'hsl(var(--text-grey-secondary))',
          muted: 'hsl(var(--text-grey-muted))',
          disabled: 'hsl(var(--text-grey-disabled))',
          medium: '#666666',
        },
        static: {
          black: {
            DEFAULT: 'hsl(var(--base-static-black))',
            alpha: {
              10: 'hsl(var(--base-static-black) / 0.1)',
            },
          },
          white: {
            DEFAULT: 'hsl(var(--base-static-white))',
            alpha: {
              10: 'hsl(var(--base-static-white) / 0.1)',
            },
          },
        },
        blue: {
          DEFAULT: 'hsl(var(--base-blue-500))',
          50: 'hsl(var(--base-blue-50))',
          100: 'hsl(var(--base-blue-100))',
          200: 'hsl(var(--base-blue-200))',
          300: 'hsl(var(--base-blue-300))',
          400: 'hsl(var(--base-blue-400))',
          500: 'hsl(var(--base-blue-500))',
          600: 'hsl(var(--base-blue-600))',
          alpha: {
            10: 'hsl(var(--base-blue-500) / 0.1)',
          },
        },
        green: {
          DEFAULT: 'hsl(var(--base-green-500))',
          50: 'hsl(var(--base-green-50))',
          100: 'hsl(var(--base-green-100))',
          200: 'hsl(var(--base-green-200))',
          300: 'hsl(var(--base-green-300))',
          400: 'hsl(var(--base-green-400))',
          500: 'hsl(var(--base-green-500))',
          600: 'hsl(var(--base-green-600))',
          alpha: {
            10: 'hsl(var(--base-green-500) / 0.1)',
          },
        },
        purple: {
          DEFAULT: 'hsl(var(--base-purple-500))',
          50: 'hsl(var(--base-purple-50))',
          100: 'hsl(var(--base-purple-100))',
          200: 'hsl(var(--base-purple-200))',
          300: 'hsl(var(--base-purple-300))',
          400: 'hsl(var(--base-purple-400))',
          500: 'hsl(var(--base-purple-500))',
          600: 'hsl(var(--base-purple-600))',
          alpha: {
            10: 'hsl(var(--base-purple-500) / 0.1)',
          },
        },
        red: {
          DEFAULT: 'hsl(var(--base-red-500))',
          50: 'hsl(var(--base-red-50))',
          100: 'hsl(var(--base-red-100))',
          200: 'hsl(var(--base-red-200))',
          300: 'hsl(var(--base-red-300))',
          400: 'hsl(var(--base-red-400))',
          500: 'hsl(var(--base-red-500))',
          600: 'hsl(var(--base-red-600))',
          alpha: {
            10: 'hsl(var(--base-red-500) / 0.1)',
          },
        },
        yellow: {
          DEFAULT: 'hsl(var(--base-yellow-500))',
          50: 'hsl(var(--base-yellow-50))',
          100: 'hsl(var(--base-yellow-100))',
          200: 'hsl(var(--base-yellow-200))',
          300: 'hsl(var(--base-yellow-300))',
          400: 'hsl(var(--base-yellow-400))',
          500: 'hsl(var(--base-yellow-500))',
          600: 'hsl(var(--base-yellow-600))',
          alpha: {
            10: 'hsl(var(--base-yellow-500) / 0.1)',
          },
        },
      },
      borderRadius: {
        '32px': '32px',
      },
      keyframes: {
        loading: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        overlayShow: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        overlayHide: {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        dialogShow: {
          from: { opacity: '0', transform: 'translateY(16px) scale(0.95)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        dialogHide: {
          from: { opacity: '1', transform: 'translateY(0) scale(1)' },
          to: { opacity: '0', transform: 'translateY(16px) scale(0.95)' },
        },
        slideInFromLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInFromRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-from-top': {
          from: { transform: 'translateY(4px) scale(0.97)', opacity: '0' },
          to: { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
        'slide-from-bottom': {
          from: { transform: 'translateY(-4px) scale(0.97)', opacity: '0' },
          to: { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
        'slide-from-left': {
          from: { transform: 'translateX(4px) scale(0.97)', opacity: '0' },
          to: { transform: 'translateX(0) scale(1)', opacity: '1' },
        },
        'slide-from-right': {
          from: { transform: 'translateX(-4px) scale(0.97)', opacity: '0' },
          to: { transform: 'translateX(0) scale(1)', opacity: '1' },
        },
        'slide-to-right': {
          from: { transform: 'translateX(0) scale(1)', opacity: '1' },
          to: { transform: 'translateX(-4px) scale(0.97)', opacity: '0' },
        },
        'slide-to-top': {
          from: { transform: 'translateY(0) scale(1)', opacity: '1' },
          to: { transform: 'translateY(4px) scale(0.97)', opacity: '0' },
        },
        'slide-to-bottom': {
          from: { transform: 'translateY(0) scale(1)', opacity: '1' },
          to: { transform: 'translateY(-4px) scale(0.97)', opacity: '0' },
        },
        'slide-to-left': {
          from: { transform: 'translateX(0) scale(1)', opacity: '1' },
          to: { transform: 'translateX(4px) scale(0.97)', opacity: '0' },
        },
        'drawer-slide-to-right': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        'drawer-slide-to-left': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        slideDownAndFade: {
          from: { opacity: '0', transform: 'translateY(-2px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeftAndFade: {
          from: { opacity: '0', transform: 'translateX(2px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideUpAndFade: {
          from: { opacity: '0', transform: 'translateY(2px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideRightAndFade: {
          from: { opacity: '0', transform: 'translateX(-2px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideDown: {
          from: { height: '0', opacity: '0' },
          to: { height: 'var(--radix-collapsible-content-height)', opacity: '1' },
        },
        slideUp: {
          from: { height: 'var(--radix-collapsible-content-height)', opacity: '1' },
          to: { height: '0', opacity: '0' },
        },
      },
      animation: {
        overlayShow: 'overlayShow 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        overlayHide: 'overlayHide 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        dialogShow: 'dialogShow 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        dialogHide: 'dialogHide 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideDownAndFade: 'slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideLeftAndFade: 'slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideUpAndFade: 'slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideRightAndFade: 'slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-from-top': 'slide-from-top 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-from-bottom': 'slide-from-bottom 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-from-left': 'slide-from-left 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-from-right': 'slide-from-right 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-to-top': 'slide-to-top 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-to-bottom': 'slide-to-bottom 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-to-left': 'slide-to-left 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-to-right': 'slide-to-right 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        'drawer-slide-to-right': 'drawer-slide-to-right 600ms',
        'drawer-slide-to-left': 'drawer-slide-to-left 600ms',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'slide-down': 'slideDown 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 300ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionTimingFunction: {
        retro: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
      },
    },
  },
  plugins: [],
};
