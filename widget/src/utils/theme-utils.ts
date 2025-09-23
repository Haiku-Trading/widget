import chroma from 'chroma-js'
import { WidgetTheme } from '../types/theme'

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
 * Generates comprehensive CSS custom properties from theme configuration
 */
export function generateThemeCSS(theme: WidgetTheme): Record<string, string> {
  const cssVars: Record<string, string> = {}

  // Generate primary color palette
  if (theme.primaryColor && isValidColor(theme.primaryColor)) {
    const primaryScale = generateColorScale(theme.primaryColor, 'primary')
    Object.assign(cssVars, primaryScale)
    
    // Set primary foreground based on contrast
    cssVars['--primary-foreground'] = getContrastColor(theme.primaryColor)
    
    // Set related properties
    cssVars['--active'] = cssVars['--primary']
    cssVars['--filled'] = cssVars['--primary']
    cssVars['--info'] = cssVars['--primary']
  }

  // Generate secondary color palette
  if (theme.secondaryColor && isValidColor(theme.secondaryColor)) {
    const secondaryScale = generateColorScale(theme.secondaryColor, 'secondary')
    Object.assign(cssVars, secondaryScale)
    
    // Set secondary foreground based on contrast
    cssVars['--secondary-foreground'] = getContrastColor(theme.secondaryColor)
  }

  // Handle accent color (defaults to primary if not specified)
  if (theme.accentColor && isValidColor(theme.accentColor)) {
    const accentScale = generateColorScale(theme.accentColor, 'accent')
    Object.assign(cssVars, accentScale)
  } else if (theme.primaryColor && isValidColor(theme.primaryColor)) {
    // Use primary as accent if not specified
    cssVars['--accent'] = cssVars['--primary']
    cssVars['--accent-foreground'] = cssVars['--primary-foreground']
  }

  // Handle success color (defaults to green if not specified)
  if (theme.successColor && isValidColor(theme.successColor)) {
    const successScale = generateColorScale(theme.successColor, 'success')
    Object.assign(cssVars, successScale)
  } else {
    // Default success colors
    cssVars['--success'] = '142 76% 36%'
    cssVars['--success-foreground'] = '0 0% 98%'
  }

  // Handle warning color (defaults to amber if not specified)
  if (theme.warningColor && isValidColor(theme.warningColor)) {
    const warningScale = generateColorScale(theme.warningColor, 'warning')
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
  if (theme.errorColor && isValidColor(theme.errorColor)) {
    const errorScale = generateColorScale(theme.errorColor, 'error')
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
    
    // Apply dark mode specific overrides for better contrast
    if (theme.warningColor && isValidColor(theme.warningColor)) {
      // For dark mode, use a lighter version of the warning color for better contrast
      const warningColor = chroma(theme.warningColor)
      const lighterWarning = warningColor.brighten(0.3).saturate(0.1)
      element.style.setProperty('--warning', colorToHsl(lighterWarning.hex()))
      element.style.setProperty('--warning-bg', `${colorToHsl(lighterWarning.hex())} / 0.15`)
      element.style.setProperty('--warning-border', `${colorToHsl(lighterWarning.hex())} / 0.3`)
    } else {
      // Even if no user warning color is set, ensure we have good contrast in dark mode
      element.style.setProperty('--warning', '38 92% 60%')
      element.style.setProperty('--warning-bg', '38 92% 50% / 0.15')
      element.style.setProperty('--warning-border', '38 92% 50% / 0.3')
    }
  } else if (theme.mode === 'light') {
    element.classList.add('light')
    element.classList.remove('dark')
  } else if (theme.mode === 'auto') {
    // Remove both classes to let CSS media queries handle it
    element.classList.remove('dark', 'light')
    
    // For auto mode, we need to handle both light and dark mode cases
    // We'll set up CSS custom properties that work with media queries
    if (theme.warningColor && isValidColor(theme.warningColor)) {
      const warningColor = chroma(theme.warningColor)
      const lighterWarning = warningColor.brighten(0.3).saturate(0.1)
      
      // Set the base warning color (for light mode)
      element.style.setProperty('--warning', colorToHsl(warningColor.hex()))
      element.style.setProperty('--warning-bg', `${colorToHsl(warningColor.hex())} / 0.1`)
      element.style.setProperty('--warning-border', `${colorToHsl(warningColor.hex())} / 0.2`)
      
      // Set dark mode specific colors that will be used by CSS media queries
      element.style.setProperty('--warning-dark', colorToHsl(lighterWarning.hex()))
      element.style.setProperty('--warning-bg-dark', `${colorToHsl(lighterWarning.hex())} / 0.15`)
      element.style.setProperty('--warning-border-dark', `${colorToHsl(lighterWarning.hex())} / 0.3`)
    }
  }
}
