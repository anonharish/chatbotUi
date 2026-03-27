import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import AppLayout from '@/layouts/AppLayout'
import MainLayout from '@/layouts/MainLayout'
import AuthLayout from '@/layouts/AuthLayout'
import ErrorBoundary from '@/components/ErrorBoundary'
import LoginPage from '@/pages/auth/LoginPage'
import CardPreviewPage from '@/pages/CardPreviewPage'
import UserRoles from '@/features/UserRoles'
import CreateRegionsAreas from '@/components/pages/CreateRegionsAreas'
import RegionSuccessPage from '@/components/pages/RegionSuccessPage'

const ChatbotPage       = lazy(() => import('@/pages/chatbot/ChatbotPage'))
const NotFoundPage      = lazy(() => import('@/pages/NotFoundPage'))
const RegionSelectionPage = lazy(() => import('@/pages/region-selection/RegionSelectionPage'))
const MapboxPage        = lazy(() => import('@/pages/mapbox-region-selection/MapboxPage'))
const DummyPage         = lazy(() => import('@/pages/DummyPage'))
const DirectoryPage     = lazy(() => import('@/features/RoleManager/DirectoryPage'))
const DashboardPage     = lazy(() => import('@/features/RoleManager/DashboardPage'))
const DesignSystemPage  = lazy(() => import('@/pages/DesignSystemPage'))
const SuperAdminDashboard = lazy(() => import('@/features/super-admin/SuperAdminDashboard'))

const PageLoader = () => (
    <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
)

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
                // Root: let AuthLayout/MainLayout handle redirect based on role
                path: '/',
                element: <Navigate to="/login" replace />,
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
                // All protected routes live here — MainLayout handles unauthed redirect
                element: <MainLayout />,
                children: [
                    // ── Role Manager routes ──────────────────────────
                    {
                        path: 'dashboardpage',
                        element: withSuspense(DashboardPage),
                    },
                    {
                        path: 'directory',
                        element: withSuspense(DirectoryPage),
                    },

                    // ── Super Admin routes ───────────────────────────
                    {
                        path: 'super-admin',
                        element: withSuspense(SuperAdminDashboard),
                    },
                    {
                        path: 'UserRoles',
                        element: withSuspense(UserRoles),
                    },

                    // ── Shared routes ────────────────────────────────
                    {
                        path: 'create-regions-areas',
                        element: withSuspense(CreateRegionsAreas),
                    },
                    {
                        path: 'region-success',
                        element: withSuspense(RegionSuccessPage),
                    },
                    {
                        path: 'region-selection',
                        element: withSuspense(RegionSelectionPage),
                    },
                    {
                        path: 'mapbox-region-selection',
                        element: withSuspense(MapboxPage),
                    },
                    {
                        path: 'dashboard',
                        element: withSuspense(MapboxPage),
                    },
                    {
                        path: 'chat',
                        element: withSuspense(ChatbotPage),
                    },
                    {
                        path: 'card-preview',
                        element: withSuspense(CardPreviewPage),
                    },
                    {
                        path: 'dummy',
                        element: withSuspense(DummyPage),
                    },
                    {
                        path: 'design-system',
                        element: withSuspense(DesignSystemPage),
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
                     {
            path: "agent-profile",
            element: withSuspense(AgentProfilePage),
          },
          {
            path: "profile-info",
            element: withSuspense(ProfileInfoPage),
          },
          {
            path: "settings-profile",
            element: withSuspense(SettingsProfilePage),
          },
          {
            path: "region-success",
            element: withSuspense(RegionSuccessPage),
          },
          {
            path: "create-regions-areas",
            element: withSuspense(CreateRegionsAreas),
          },
        ],
      },
    ],
  },
  {
    path: "/404",
    element: withSuspense(NotFoundPage),
  },
  {
    path: "*",
    element: <Navigate to="/404" replace />,
  },
]);

export default router