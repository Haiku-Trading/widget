import chroma from 'chroma-js'
import { WidgetTheme, ColorPalette } from '../types/theme'

/**
 * Validates if a string is a valid color
 */
export function isValidColor(color: string): boolean {
  return chroma.valid(color)
}

/**
 * Converts a color to HSL format for CSS variables
 */
export function colorToHsl(color: string): string {
  const [h, s, l] = chroma(color).hsl()
  return `${Math.round(h || 0)} ${Math.round((s || 0) * 100)}% ${Math.round((l || 0) * 100)}%`
}

/**
 * Generates a color scale from a base color
 */
export function generateColorScale(baseColor: string, name: string): Record<string, string> {
  const scale = chroma.scale([baseColor]).mode('hsl')
  const cssVars: Record<string, string> = {}
  
  // Generate scale from 50 (lightest) to 600 (darkest)
  const scaleValues = [0.95, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.05]
  const scaleNames = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']
  
  scaleValues.forEach((value, index) => {
    const color = scale(value)
    cssVars[`--${name}-${scaleNames[index]}`] = colorToHsl(color.hex())
  })
  
  // Set the main color as the 500 value
  cssVars[`--${name}`] = colorToHsl(baseColor)
  
  return cssVars
}

/**
 * Calculates appropriate foreground color based on background color
 */
export function getContrastColor(backgroundColor: string): string {
  const bg = chroma(backgroundColor)
  const white = chroma('white')
  const black = chroma('black')
  
  // Calculate contrast ratios
  const whiteContrast = chroma.contrast(bg, white)
  const blackContrast = chroma.contrast(bg, black)
  
  // Return the color with better contrast
  return whiteContrast > blackContrast ? '0 0% 98%' : '0 0% 9%'
}

/**
 * Generates CSS custom properties from a color palette
 */
export function generatePaletteCSS(palette: ColorPalette): Record<string, string> {
  const cssVars: Record<string, string> = {}

  // Generate primary color palette
  if (palette.primaryColor && isValidColor(palette.primaryColor)) {
    const primaryScale = generateColorScale(palette.primaryColor, 'primary')
    Object.assign(cssVars, primaryScale)
    
    // Set primary foreground based on contrast
    cssVars['--primary-foreground'] = getContrastColor(palette.primaryColor)
    
    // Set related properties
    cssVars['--active'] = cssVars['--primary']
    cssVars['--filled'] = cssVars['--primary']
    cssVars['--info'] = cssVars['--primary']
  }

  // Generate secondary color palette
  if (palette.secondaryColor && isValidColor(palette.secondaryColor)) {
    const secondaryScale = generateColorScale(palette.secondaryColor, 'secondary')
    Object.assign(cssVars, secondaryScale)
    
    // Set secondary foreground based on contrast
    cssVars['--secondary-foreground'] = getContrastColor(palette.secondaryColor)
  }

  // Handle accent color (defaults to primary if not specified)
  if (palette.accentColor && isValidColor(palette.accentColor)) {
    const accentScale = generateColorScale(palette.accentColor, 'accent')
    Object.assign(cssVars, accentScale)
  } else if (palette.primaryColor && isValidColor(palette.primaryColor)) {
    // Use primary as accent if not specified
    cssVars['--accent'] = cssVars['--primary']
    cssVars['--accent-foreground'] = cssVars['--primary-foreground']
  }

  // Handle success color (defaults to green if not specified)
  if (palette.successColor && isValidColor(palette.successColor)) {
    const successScale = generateColorScale(palette.successColor, 'success')
    Object.assign(cssVars, successScale)
  } else {
    // Default success colors
    cssVars['--success'] = '142 76% 36%'
    cssVars['--success-foreground'] = '0 0% 98%'
  }

  // Handle warning color (defaults to amber if not specified)
  if (palette.warningColor && isValidColor(palette.warningColor)) {
    const warningScale = generateColorScale(palette.warningColor, 'warning')
    Object.assign(cssVars, warningScale)
    cssVars['--warning-bg'] = `${cssVars['--warning']} / 0.1`
    cssVars['--warning-border'] = `${cssVars['--warning']} / 0.2`
  } else {
    // Default warning colors
    cssVars['--warning'] = '38 92% 50%'
    cssVars['--warning-bg'] = '38 92% 50% / 0.1'
    cssVars['--warning-border'] = '38 92% 50% / 0.2'
  }

  // Handle error color (defaults to red if not specified)
  if (palette.errorColor && isValidColor(palette.errorColor)) {
    const errorScale = generateColorScale(palette.errorColor, 'error')
    Object.assign(cssVars, errorScale)
    cssVars['--failed'] = cssVars['--error']
    cssVars['--slippage-error-bg'] = `${cssVars['--error']} / 0.1`
    cssVars['--slippage-error-text'] = cssVars['--error']
  } else {
    // Default error colors
    cssVars['--error'] = '0 84% 60%'
    cssVars['--failed'] = '0 84% 60%'
    cssVars['--slippage-error-bg'] = '0 84% 60% / 0.1'
    cssVars['--slippage-error-text'] = '0 84% 60%'
  }

  return cssVars
}

/**
 * Generates comprehensive CSS custom properties from theme configuration
 */
export function generateThemeCSS(theme: WidgetTheme): Record<string, string> {
  const cssVars: Record<string, string> = {}

  // Generate light mode colors
  if (theme.light) {
    const lightVars = generatePaletteCSS(theme.light)
    Object.assign(cssVars, lightVars)
  }

  // Generate dark mode colors with -dark suffix
  if (theme.dark) {
    const darkVars = generatePaletteCSS(theme.dark)
    Object.entries(darkVars).forEach(([key, value]) => {
      cssVars[`${key}-dark`] = value
    })
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
    
    // Apply dark mode colors by overriding the base colors with -dark variants
    if (theme.dark) {
      const darkVars = generatePaletteCSS(theme.dark)
      Object.entries(darkVars).forEach(([key, value]) => {
        element.style.setProperty(key, value)
      })
    }
  } else if (theme.mode === 'light') {
    element.classList.add('light')
    element.classList.remove('dark')
    
    // Apply light mode colors (these are already set as base colors)
    if (theme.light) {
      const lightVars = generatePaletteCSS(theme.light)
      Object.entries(lightVars).forEach(([key, value]) => {
        element.style.setProperty(key, value)
      })
    }
  } else if (theme.mode === 'auto') {
    // Remove both classes to let CSS media queries handle it
    element.classList.remove('dark', 'light')
    
    // For auto mode, set up CSS custom properties that work with media queries
    // The base colors are already set, and -dark variants are available for media queries
  }
}
