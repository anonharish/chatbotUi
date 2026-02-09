import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router'
import RootLayout from '@/layouts/RootLayout'
import ErrorBoundary from '@/components/ErrorBoundary'

// Lazy load pages for optimal bundle splitting
const HomePage = lazy(() => import('@/pages/HomePage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
const DirectoryPage = lazy(() => import('@/pages/DirectoryPage')) // ✅ ADDED

// Loading fallback component
const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
)

// Wrap lazy components with Suspense
const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: withSuspense(HomePage),
      },
      {
        path: 'chat',
        element: withSuspense(HomePage),
      },

      // ✅ NEW ROUTE
      {
        path: 'directory',
        element: withSuspense(DirectoryPage),
      },
    ],
  },
  {
    path: '/404',
    element: withSuspense(NotFoundPage),
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
])

export default router
