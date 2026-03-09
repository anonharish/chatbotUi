import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoginPage from "@/pages/auth/LoginPage";
import CardPreviewPage from "@/pages/CardPreviewPage";
import UserRoles from "@/features/UserRoles";
import CreateRegionsAreas from "@/components/pages/CreateRegionsAreas";
import RegionSuccessPage from "@/components/pages/RegionSuccessPage";

// Lazy load pages for optimal bundle splitting
const ChatbotPage = lazy(() => import("@/pages/chatbot/ChatbotPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const RegionSelectionPage = lazy(
  () => import("@/pages/region-selection/RegionSelectionPage"),
);
const MapboxPage = lazy(
  () => import("@/pages/mapbox-region-selection/MapboxPage"),
);
const DummyPage = lazy(() => import("@/pages/DummyPage"));

const DirectoryPage = lazy(() => import("@/pages/DirectoryPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
<<<<<<< HEAD
const AgentProfilePage = lazy(() => import('@/pages/AgentProfilePage'));
const ProfileInfoPage = lazy(() => import('@/pages/ProfileInfoPage'));
const DesignSystemPage = lazy(() => import('@/pages/DesignSystemPage'))
const SettingsProfilePage = lazy(() => import('@/pages/SettingsProfilePage'))
=======
const AgentProfilePage = lazy(() => import("@/pages/AgentProfilePage"));
const ProfileInfoPage = lazy(() => import("@/pages/ProfileInfoPage"));
const DesignSystemPage = lazy(() => import("@/pages/DesignSystemPage"));
const SettingsProfilePage = lazy(() => import("@/pages/SettingsProfilePage"));
>>>>>>> 7c9f557d4cefc77262e2c4ddc34072ae11b8da76

// Loading fallback component
const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

// Wrap lazy components with Suspense
const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        element: <Navigate to="/dashboard" replace />,
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: <LoginPage />,
          },
        ],
      },
      {
        element: <MainLayout />,
        children: [
          {
            path: "dashboard",
            element: withSuspense(MapboxPage),
          },
          {
            path: "region-selection",
            element: withSuspense(RegionSelectionPage),
          },
          {
            path: "dashboardpagev2",
            element: withSuspense(DashboardPage),
          },
          {
            path: "directory",
            element: withSuspense(DirectoryPage),
          },
          {
            path: "agent-profile",
            element: withSuspense(AgentProfilePage),
          },
          {
            path: "profile-info",
            element: withSuspense(ProfileInfoPage),
          },
          {
<<<<<<< HEAD
            path: 'settings-profile',
=======
            path: "settings-profile",
>>>>>>> 7c9f557d4cefc77262e2c4ddc34072ae11b8da76
            element: withSuspense(SettingsProfilePage),
          },
          {
            path: "design-system",
            element: withSuspense(DesignSystemPage),
          },
          {
            path: "mapbox-region-selection",
            element: withSuspense(MapboxPage),
          },
          {
            path: "dummy",
            element: withSuspense(DummyPage),
          },
          {
            path: "chat",
            element: withSuspense(ChatbotPage),
          },
          {
            path: "dashboardpage",
            element: withSuspense(DashboardPage),
          },
          {
            path: "card-preview",
            element: withSuspense(CardPreviewPage),
          },
          {
            path: "directory",
            element: withSuspense(DirectoryPage),
          },
          {
            path: "UserRoles",
            element: withSuspense(UserRoles),
          },
          {
            path: "design-system",
            element: withSuspense(DesignSystemPage),
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

export default router;
