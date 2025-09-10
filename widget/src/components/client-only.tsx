/**
 * Component to ensure client-side only rendering
 * Useful for components that need to avoid hydration mismatches
 * @see https://github.com/uidotdev/usehooks/issues/218
 */
import React from 'react'
import { useIsClient } from '@uidotdev/usehooks'

type ClientOnlyProps = {
  children: React.ReactNode
}

export function ClientOnly({ children }: ClientOnlyProps) {
  const isClient = useIsClient()

  return isClient ? <>{children}</> : null
}
