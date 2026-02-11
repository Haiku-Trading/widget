import React, { useRef, useCallback } from 'react'

/**
 * React 19 compatibility utilities
 */

// Check if we're running in React 19
export const isReact19 = (): boolean => {
  try {
    const version = require('react/package.json').version
    return version.startsWith('19.')
  } catch {
    return false
  }
}


/**
 * Stable callback that doesn't change reference in React 19
 * Prevents unnecessary re-renders caused by function reference changes
 */
export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T
): T => {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  return useCallback((...args: Parameters<T>) => {
    return callbackRef.current(...args)
  }, []) as T
}


