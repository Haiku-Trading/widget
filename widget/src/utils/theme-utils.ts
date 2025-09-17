import { WidgetTheme } from '../types/theme'

/**
 * Converts hex color to HSL format
 */
export function hexToHsl(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '')
  
  // Parse hex values
  const r = parseInt(hex.substr(0, 2), 16) / 255
  const g = parseInt(hex.substr(2, 2), 16) / 255
  const b = parseInt(hex.substr(4, 2), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h: number, s: number, l: number

  l = (max + min) / 2

  if (max === min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
      default: h = 0
    }
    h /= 6
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

/**
 * Validates if a string is a valid hex color
 */
export function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)
}

/**
 * Generates CSS custom properties from theme configuration
 */
export function generateThemeCSS(theme: WidgetTheme): Record<string, string> {
  const cssVars: Record<string, string> = {}

  if (theme.primaryColor && isValidHexColor(theme.primaryColor)) {
    const primaryHsl = hexToHsl(theme.primaryColor)
    cssVars['--primary'] = primaryHsl
    cssVars['--primary-foreground'] = '0 0% 98%' // Light text for dark backgrounds
    
    // Also set some related properties that might use primary color
    cssVars['--active'] = primaryHsl
    cssVars['--filled'] = primaryHsl
  }

  if (theme.secondaryColor && isValidHexColor(theme.secondaryColor)) {
    const secondaryHsl = hexToHsl(theme.secondaryColor)
    cssVars['--secondary'] = secondaryHsl
    cssVars['--secondary-foreground'] = '0 0% 9%' // Dark text for light backgrounds
  }

  return cssVars
}

/**
 * Applies theme CSS variables to a DOM element
 */
export function applyThemeToElement(element: HTMLElement, theme: WidgetTheme): void {
  const cssVars = generateThemeCSS(theme)
  
  Object.entries(cssVars).forEach(([property, value]) => {
    element.style.setProperty(property, value)
  })

  // Handle mode
  if (theme.mode === 'dark') {
    element.classList.add('dark')
    element.classList.remove('light')
  } else if (theme.mode === 'light') {
    element.classList.add('light')
    element.classList.remove('dark')
  } else if (theme.mode === 'auto') {
    // Remove both classes to let CSS media queries handle it
    element.classList.remove('dark', 'light')
  }
}
