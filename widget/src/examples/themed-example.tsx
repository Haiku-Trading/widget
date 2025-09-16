import React from 'react'
import { HaikuWidget, WidgetTheme } from '../index'

// Example showing how to use the theming system
export function ThemedExample() {
  const blueTheme: WidgetTheme = {
    mode: 'light',
    primaryColor: '#3B82F6', // Blue
    secondaryColor: '#10B981' // Green
  }

  const purpleTheme: WidgetTheme = {
    mode: 'dark',
    primaryColor: '#8B5CF6', // Purple
    secondaryColor: '#F59E0B' // Amber
  }

  const autoTheme: WidgetTheme = {
    mode: 'auto',
    primaryColor: '#EF4444', // Red
    secondaryColor: '#06B6D4' // Cyan
  }

  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-xl font-bold mb-4">Blue Theme (Light Mode)</h2>
        <div className="border rounded-lg p-4">
          <HaikuWidget theme={blueTheme} />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Purple Theme (Dark Mode)</h2>
        <div className="border rounded-lg p-4">
          <HaikuWidget theme={purpleTheme} />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Red Theme (Auto Mode)</h2>
        <div className="border rounded-lg p-4">
          <HaikuWidget theme={autoTheme} />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Default Theme</h2>
        <div className="border rounded-lg p-4">
          <HaikuWidget />
        </div>
      </div>
    </div>
  )
}
