import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router'
import AppLayout from '@/layouts/AppLayout'
import MainLayout from '@/layouts/MainLayout'
import AuthLayout from '@/layouts/AuthLayout'
import FullScreenLayout from '@/layouts/FullScreenLayout'
import ErrorBoundary from '@/components/ErrorBoundary'
import LoginPage from '@/pages/auth/LoginPage'

// Lazy load pages for optimal bundle splitting
const ChatbotPage = lazy(() => import('@/pages/chatbot/ChatbotPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
const RegionSelectionPage = lazy(() => import('@/pages/region-selection/RegionSelectionPage'))
const MapboxPage = lazy(() => import('@/pages/mapbox-region-selection/MapboxPage'))
const DummyPage = lazy(() => import('@/pages/DummyPage'))
const SatelliteHistoryPage = lazy(() => import('@/pages/satellite-history/SatelliteHistoryPage'))

// ✅ Keep BOTH feature + master pages
const DirectoryPage = lazy(() => import('@/pages/DirectoryPage'))
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const AgentProfilePage = lazy(() => import('@/pages/AgentProfilePage'));
const ProfileInfoPage = lazy(() => import('@/pages/ProfileInfoPage'));
const DesignSystemPage = lazy(() => import('@/pages/DesignSystemPage'))
const RegionSectionPage = lazy(() => import("@/pages/region-selection/RegionSelectionPage"));

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
    element: <AppLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: 'login',
            element: <LoginPage />,
          },
        ],

      },
      {
        element: <FullScreenLayout />,
        children: [
          {
            path: 'mapbox-region-selection',
            element: withSuspense(MapboxPage),
          },
          {
            path: 'satellite-history',
            element: withSuspense(SatelliteHistoryPage),
          },
        ],
      },
      {
        element: <MainLayout />,
        children: [
          {
            path: 'dashboard',
            element: withSuspense(DummyPage),
          },
          {
            path: 'region-selection',
            element: withSuspense(RegionSelectionPage),
          },
          {
            path: 'dashboardpagev2',
            element: withSuspense(DashboardPage),
          },
          {
            path: 'directory',
            element: withSuspense(DirectoryPage),
          },
          {
            path: 'agent-profile',
            element: withSuspense(AgentProfilePage),
          },
          {
            path: 'profile-info',
            element: withSuspense(ProfileInfoPage),
          },
          {
            path: 'regions',
            element: withSuspense(RegionSectionPage),
          },
          {
            path: 'design-system',
            element: withSuspense(DesignSystemPage),
          },
          {
            path: 'dummy',
            element: withSuspense(DummyPage),
          },
          {
            path: 'chat',
            element: withSuspense(ChatbotPage),
          },
        ],
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