# Widget Theming

The Haiku Widget supports comprehensive custom theming through props, allowing you to match your brand colors and support both light and dark modes with automatically generated color palettes.

## Basic Usage

```tsx
import { HaikuWidget, WidgetTheme } from '@your-org/haiku-widget'

const theme: WidgetTheme = {
  mode: 'light',
  primaryColor: '#3B82F6', // Blue
  secondaryColor: '#10B981' // Green
}

function App() {
  return <HaikuWidget config={{ theme }} />
}
```

## Theme Configuration

### WidgetTheme Interface

```typescript
interface WidgetTheme {
  mode?: 'light' | 'dark' | 'auto'
  primaryColor?: string
  secondaryColor?: string
  // Optional overrides for specific color roles
  accentColor?: string
  successColor?: string
  warningColor?: string
  errorColor?: string
}
```

### Properties

- **mode**: Controls the color scheme
  - `'light'`: Forces light mode
  - `'dark'`: Forces dark mode  
  - `'auto'`: Uses system preference (default)
- **primaryColor**: Main brand color for primary elements (buttons, links, etc.)
- **secondaryColor**: Secondary brand color for supporting elements
- **accentColor**: Accent color (defaults to primary if not specified)
- **successColor**: Success state color (defaults to green if not specified)
- **warningColor**: Warning state color (defaults to amber if not specified)
- **errorColor**: Error state color (defaults to red if not specified)

## Color Palette Generation

The widget automatically generates comprehensive color palettes from your specified colors:

- **50-950 scales**: Each color generates 11 shades from lightest (50) to darkest (950)
- **Automatic contrast**: Foreground colors are automatically calculated for optimal readability
- **Smart defaults**: Unspecified colors use sensible defaults or inherit from primary/secondary

## Examples

### Brand Colors
```tsx
const brandTheme: WidgetTheme = {
  primaryColor: '#FF6B6B', // Your brand red
  secondaryColor: '#4ECDC4' // Your brand teal
}
```

### Complete Custom Theme
```tsx
const customTheme: WidgetTheme = {
  mode: 'dark',
  primaryColor: '#8B5CF6', // Purple
  secondaryColor: '#F59E0B', // Amber
  accentColor: '#EC4899', // Pink
  successColor: '#10B981', // Green
  warningColor: '#F59E0B', // Amber
  errorColor: '#EF4444' // Red
}
```

### Minimal Theme
```tsx
const minimalTheme: WidgetTheme = {
  primaryColor: '#3B82F6' // Only primary color specified
  // All other colors will use defaults or inherit from primary
}
```

## Color Format

Colors can be provided in various formats:
- ✅ `#3B82F6` (hex)
- ✅ `rgb(59, 130, 246)` (rgb)
- ✅ `hsl(217, 91%, 60%)` (hsl)
- ✅ `blue` (named colors)

## Background Colors

Background colors are controlled by the light/dark mode only and cannot be customized. This ensures:
- Consistent accessibility
- Proper contrast ratios
- System integration

## Advanced Usage

For more control, you can use the `ThemeProvider` directly:

```tsx
import { ThemeProvider, WidgetHttpProvider } from '@your-org/haiku-widget'

function CustomWidget() {
  return (
    <ThemeProvider theme={{ 
      primaryColor: '#FF6B6B',
      secondaryColor: '#4ECDC4',
      accentColor: '#EC4899'
    }}>
      <WidgetHttpProvider>
        {/* Your custom widget content */}
      </WidgetHttpProvider>
    </ThemeProvider>
  )
}
```

## Color Scale Usage

The generated color scales can be used in your custom components:

```tsx
// Using Tailwind classes
<div className="bg-primary-100 text-primary-900">
  Light primary background with dark primary text
</div>

<div className="bg-success-50 border-success-200 text-success-800">
  Success state with multiple shades
</div>
```

## Best Practices

1. **Start simple**: Begin with just `primaryColor` and `secondaryColor`
2. **Test contrast**: The system automatically calculates foreground colors, but test in both light and dark modes
3. **Use semantic colors**: Leverage `successColor`, `warningColor`, and `errorColor` for better UX
4. **Consistent branding**: Use your brand colors across all theme properties for cohesive design
