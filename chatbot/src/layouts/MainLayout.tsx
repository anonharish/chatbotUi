import {Outlet, Navigate, useNavigate} from "react-router";
import {GLCLogo as Logo} from "@/assets/icons";
import {useAuth} from "@/context/AuthContext";
import {Sidebar} from "@/navigation/Sidebar";
import {Bell} from "lucide-react";

export default function MainLayout() {
    const {user, isLoading} = useAuth();
    const navigate = useNavigate();
import { Outlet, Navigate, useNavigate, useLocation } from "react-router";
import { GLCLogo as Logo } from "@/assets/icons";
import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "@/navigation/Sidebar";
import { Bell } from "lucide-react";

export default function MainLayout() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 👇 Add any route where sidebar should be hidden
  const hideSidebarRoutes = ["/agent-profile", "/profile-info", "/settings-profile"];
  const hideSidebar = hideSidebarRoutes.some((route) =>
    location.pathname.includes(route)
  );

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                Loading...
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace/>;
    }

    return (

        <div className="min-h-screen text-foreground relative">
            {/* Global Background Image */}
            <div className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
                style={
                    {
                        backgroundImage: 'url("/background.jpg")',
                        // Optional: Add a dark overlay to ensure text readability
                        boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.3)"
                    }
                }/> {/* Header - Transparent */}
            <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent text-white">
                <div className="w-full px-6 my-4 h-14 flex justify-between items-center">
                    <div className="flex items-center space-x-3 cursor-pointer"
                        onClick={() => navigate(user.role === 'super_admin' ? '/super-admin' : '/dashboardpage')}>

                        <img src={Logo}
                            alt="Logo"
                            className="h-16 w-auto"/>
                    </div>
                    <nav className="ml-auto flex items-center space-x-2">
                        {/* Notification Button */}
                        <button className="
                                      w-10 h-10
                                      rounded-full
                                      flex items-center justify-center
                                      border border-white/60
                                      bg-white/10
                                      backdrop-blur-xl
                                      text-white
                                      hover:bg-white/20
                                      transition-all duration-200
                                    ">
                            <Bell className="w-6 h-6"/>
                        </button>
                        {/* Profile Avatar */}
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/40">
                            <img src="/profile.jpg"
                                // replace with your image path
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </nav>
                </div>
            </header>
            <Sidebar/> {/* Main content */}
            <main className="pt-14 w-full h-full">
                <Outlet/>
            </main>
        </div>
    );
}
  return (
    <div className="min-h-screen text-foreground relative">
      {/* Global Background Image */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/background.jpg")',
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.3)",
        }}
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent text-white">
        <div className="w-full px-6 my-4 h-14 flex justify-between items-center">
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <img src={Logo} alt="Logo" className="h-16 w-auto" />
          </div>
          <nav className="ml-auto flex items-center space-x-2">
            {/* Notification Button */}
            <button
              className="
                w-10 h-10 rounded-full flex items-center justify-center
                border border-white/60 bg-white/10 backdrop-blur-xl text-white
                hover:bg-white/20 transition-all duration-200
              "
            >
              <Bell className="w-6 h-6" />
            </button>
            {/* Profile Avatar */}
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/40">
              <img
                src="/profile.jpg"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </nav>
        </div>
      </header>

      {/* Sidebar — hidden on agent-profile & card-preview */}
      {!hideSidebar && <Sidebar />}

      {/* Main content */}
      <main
        className={`pt-14 w-full h-full transition-all duration-300 ${
          hideSidebar ? "pl-0" : "pl-20"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
