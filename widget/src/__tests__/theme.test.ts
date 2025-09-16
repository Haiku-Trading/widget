import { hexToHsl, isValidHexColor, generateThemeCSS } from '../utils/theme-utils'
import { WidgetTheme } from '../types/theme'

describe('Theme Utils', () => {
  describe('hexToHsl', () => {
    it('should convert hex colors to HSL format', () => {
      expect(hexToHsl('#3B82F6')).toBe('217 91% 60%')
      expect(hexToHsl('#10B981')).toBe('158 84% 39%')
      expect(hexToHsl('#EF4444')).toBe('0 84% 60%')
    })

    it('should handle hex colors without # prefix', () => {
      expect(hexToHsl('3B82F6')).toBe('217 91% 60%')
    })
  })

  describe('isValidHexColor', () => {
    it('should validate hex colors correctly', () => {
      expect(isValidHexColor('#3B82F6')).toBe(true)
      expect(isValidHexColor('#FF6B6B')).toBe(true)
      expect(isValidHexColor('#ABC')).toBe(true)
      expect(isValidHexColor('3B82F6')).toBe(true)
      
      expect(isValidHexColor('invalid')).toBe(false)
      expect(isValidHexColor('#GGGGGG')).toBe(false)
      expect(isValidHexColor('rgb(255,0,0)')).toBe(false)
    })
  })

  describe('generateThemeCSS', () => {
    it('should generate CSS variables for valid colors', () => {
      const theme: WidgetTheme = {
        primaryColor: '#3B82F6',
        secondaryColor: '#10B981'
      }

      const cssVars = generateThemeCSS(theme)
      
      expect(cssVars['--primary']).toBe('217 91% 60%')
      expect(cssVars['--secondary']).toBe('158 84% 39%')
      expect(cssVars['--primary-foreground']).toBe('0 0% 98%')
      expect(cssVars['--secondary-foreground']).toBe('0 0% 9%')
    })

    it('should ignore invalid colors', () => {
      const theme: WidgetTheme = {
        primaryColor: 'invalid-color',
        secondaryColor: '#10B981'
      }

      const cssVars = generateThemeCSS(theme)
      
      expect(cssVars['--primary']).toBeUndefined()
      expect(cssVars['--secondary']).toBe('158 84% 39%')
    })

    it('should handle empty theme', () => {
      const theme: WidgetTheme = {}
      const cssVars = generateThemeCSS(theme)
      
      expect(Object.keys(cssVars)).toHaveLength(0)
    })
  })
})
