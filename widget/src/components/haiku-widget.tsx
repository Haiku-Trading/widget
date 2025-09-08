'use client'
import { WidgetHttpProvider } from '../providers/widget-provider'
import { SwapContainer } from './swap'

export function HaikuWidget() {
  return (
    <WidgetHttpProvider>
      <SwapContainer />
    </WidgetHttpProvider>
  )
}
