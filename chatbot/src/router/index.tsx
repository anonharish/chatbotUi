import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router'
import RootLayout from '@/layouts/RootLayout'
import ErrorBoundary from '@/components/ErrorBoundary'

// Lazy load pages for optimal bundle splitting
const HomePage = lazy(() => import('@/pages/HomePage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
const RegionSelectionPage = lazy(() => import('@/pages/region-selection'))
const MapboxRegionSelectionPage = lazy(() => import('@/pages/mapbox-region-selection'))

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
        path: 'region-selection',
        element: withSuspense(RegionSelectionPage),
      },
      {
        path: 'mapbox-region-selection',
        element: withSuspense(MapboxRegionSelectionPage),
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
])

export default router