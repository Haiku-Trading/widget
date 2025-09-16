# Widget Theming

The Haiku Widget supports custom theming through props, allowing you to match your brand colors and support both light and dark modes.

## Basic Usage

```tsx
import { HaikuWidget, WidgetTheme } from '@your-org/haiku-widget'

const theme: WidgetTheme = {
  mode: 'light',
  primaryColor: '#3B82F6', // Blue
  secondaryColor: '#10B981' // Green
}

function App() {
  return <HaikuWidget theme={theme} />
}
```

## Theme Configuration

### WidgetTheme Interface

```typescript
interface WidgetTheme {
  mode?: 'light' | 'dark' | 'auto'
  primaryColor?: string
  secondaryColor?: string
}
```

### Properties

- **mode**: Controls the color scheme
  - `'light'`: Forces light mode
  - `'dark'`: Forces dark mode  
  - `'auto'`: Uses system preference (default)
- **primaryColor**: Hex color for primary elements (buttons, links, etc.)
- **secondaryColor**: Hex color for secondary elements

## Examples

### Brand Colors
```tsx
const brandTheme: WidgetTheme = {
  primaryColor: '#FF6B6B', // Your brand red
  secondaryColor: '#4ECDC4' // Your brand teal
}
```

### Dark Mode
```tsx
const darkTheme: WidgetTheme = {
  mode: 'dark',
  primaryColor: '#8B5CF6', // Purple
  secondaryColor: '#F59E0B' // Amber
}
```

### System Preference
```tsx
const autoTheme: WidgetTheme = {
  mode: 'auto',
  primaryColor: '#EF4444' // Red
}
```

## Color Format

Colors should be provided as hex values:
- ✅ `#3B82F6`
- ✅ `#FF6B6B`
- ❌ `rgb(59, 130, 246)`
- ❌ `hsl(217, 91%, 60%)`

## Advanced Usage

For more control, you can use the `ThemeProvider` directly:

```tsx
import { ThemeProvider, WidgetHttpProvider } from '@your-org/haiku-widget'

function CustomWidget() {
  return (
    <ThemeProvider theme={{ primaryColor: '#FF6B6B' }}>
      <WidgetHttpProvider>
        {/* Your custom widget content */}
      </WidgetHttpProvider>
    </ThemeProvider>
  )
}
```

## Future Enhancements

This is a simple implementation. Future versions will support:
- More color tokens (background, surface, text, etc.)
- Custom border radius
- Typography customization
- Animation preferences
- Theme presets
