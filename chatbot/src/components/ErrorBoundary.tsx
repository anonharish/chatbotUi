import { Component, type ReactNode, type ErrorInfo } from 'react'
import { useRouteError, isRouteErrorResponse, Link } from 'react-router'

interface ErrorBoundaryProps {
  children?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

// Class-based error boundary for catching render errors
export class ReactErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
          <h1 className="text-2xl font-bold text-destructive">Something went wrong</h1>
          <p className="text-muted-foreground">{this.state.error?.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Reload Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// Router error boundary for route errors
export default function ErrorBoundary() {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
        <h1 className="text-6xl font-bold text-destructive">{error.status}</h1>
        <h2 className="text-2xl font-semibold">{error.statusText}</h2>
        <p className="text-muted-foreground">
          {error.status === 404
            ? "The page you're looking for doesn't exist."
            : 'An unexpected error occurred.'}
        </p>
        <Link
          to="/"
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Go Home
        </Link>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold text-destructive">Oops!</h1>
      <p className="text-muted-foreground">An unexpected error occurred.</p>
      <Link
        to="/"
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
      >
        Go Home
      </Link>
    </div>
  )
}
