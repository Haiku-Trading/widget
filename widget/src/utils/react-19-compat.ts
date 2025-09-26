import React, { useEffect, useRef, useCallback } from 'react'

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
 * Safe useEffect that prevents infinite loops in React 19
 * Uses a ref to track if the effect is already running
 */
export const useSafeEffect = (
  effect: () => void | (() => void),
  deps: React.DependencyList
) => {
  const isRunningRef = useRef(false)
  const cleanupRef = useRef<(() => void) | void>()

  useEffect(() => {
    if (isRunningRef.current) {
      return
    }

    isRunningRef.current = true
    cleanupRef.current = effect()
    
    return () => {
      isRunningRef.current = false
      if (cleanupRef.current) {
        cleanupRef.current()
      }
    }
  }, deps)
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

/**
 * Debounced state update to prevent rapid state changes in React 19
 */
export const useDebouncedState = <T>(
  initialValue: T,
  delay: number = 100
): [T, (value: T) => void] => {
  const [state, setState] = React.useState(initialValue)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const setDebouncedState = useCallback((value: T) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      setState(value)
    }, delay)
  }, [delay])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return [state, setDebouncedState]
}

/**
 * Safe store subscription that prevents memory leaks in React 19
 */
export const useSafeStoreSubscription = <T>(
  store: { 
    subscribe: (listener: (state: T) => void) => () => void
    getState?: () => T
  },
  selector: (state: T) => any,
  initialState?: T
) => {
  const [state, setState] = React.useState(() => {
    if (store.getState && initialState) {
      return selector(store.getState())
    }
    return selector(initialState as T)
  })
  const selectorRef = useRef(selector)
  selectorRef.current = selector

  useEffect(() => {
    const unsubscribe = store.subscribe((newState) => {
      const selectedValue = selectorRef.current(newState)
      setState(selectedValue)
    })

    return unsubscribe
  }, [store])

  return state
}
