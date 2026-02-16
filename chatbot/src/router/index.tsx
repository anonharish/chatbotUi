import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router'
import RootLayout from '@/layouts/RootLayout'
import ErrorBoundary from '@/components/ErrorBoundary'
import DashboardPage from '@/pages/DashboardPage'



// Lazy load pages for optimal bundle splitting
const CardPreviewPage = lazy(() => import('@/pages/CardPreviewPage'))
const HomePage = lazy(() => import('@/pages/HomePage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))



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

      {
        path: 'card-preview',
        element: withSuspense(CardPreviewPage),
      },


      // Add more routes here as needed
      // Example:
      // {
      //   path: 'settings',
      //   element: withSuspense(SettingsPage),
      // },
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
  {
  path: "/dashboard",
  element: <DashboardPage />,
}

])

export default router
