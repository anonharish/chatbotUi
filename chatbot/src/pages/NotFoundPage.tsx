import { Link } from 'react-router'
import { Home } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-6 text-center">
      <div className="text-8xl font-bold text-primary">404</div>
      <h1 className="text-3xl font-semibold">Page Not Found</h1>
      <p className="max-w-md text-muted-foreground">
        Sorry, we couldn't find the page you're looking for. 
        It might have been moved or doesn't exist.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <Home className="h-4 w-4" />
        Back to Home
      </Link>
    </div>
  )
}
