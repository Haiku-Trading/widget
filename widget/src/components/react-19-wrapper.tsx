import React, { Suspense } from 'react'
import { isReact19 } from '../utils/react-19-compat'

interface React19WrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * React 19 compatibility wrapper that provides necessary polyfills and error boundaries
 */
export function React19Wrapper({ children, fallback = null }: React19WrapperProps) {
  // In React 19, we need to be more careful about error boundaries
  if (isReact19()) {
    return (
      <ErrorBoundary
        fallback={({ error, resetError }) => (
          <div style={{ padding: '20px', border: '1px solid #ff6b6b', borderRadius: '8px' }}>
            <h3>Widget Error</h3>
            <p>Something went wrong: {error.message}</p>
            <button onClick={resetError} style={{ marginTop: '10px' }}>
              Try Again
            </button>
          </div>
        )}
        onError={(error, errorInfo) => {
          console.error('Widget Error:', error, errorInfo)
        }}
      >
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      </ErrorBoundary>
    )
  }

  // For React 18 and below, use simpler wrapper
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  )
}

/**
 * Error boundary component for React 19 compatibility
 */
class ErrorBoundary extends React.Component<
  {
    children: React.ReactNode
    fallback: (props: { error: Error; resetError: () => void }) => React.ReactNode
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo)
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return this.props.fallback({
        error: this.state.error,
        resetError: () => this.setState({ hasError: false, error: null })
      })
    }

    return this.props.children
  }
}
