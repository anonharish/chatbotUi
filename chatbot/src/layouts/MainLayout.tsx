import { Outlet, Navigate, useNavigate } from "react-router";
import { useState, useRef, useEffect } from "react";
import { GLCLogo as Logo } from "@/assets/icons";
import { useAuth } from "@/context/AuthContext";

import { Sidebar } from "@/navigation/Sidebar";
import { Bell, LogOut } from "lucide-react";

export default function MainLayout() {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsPopoverOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setIsPopoverOpen(false);
    logout();
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen w-full flex-col text-foreground relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/background.jpg")',
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.3)",
        }}
      />

      <header className="flex-shrink-0 z-50 transition-all duration-300 bg-transparent text-white">
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
                w-10 h-10
                rounded-full
                flex items-center justify-center
                border border-white/60
                bg-white/10
                backdrop-blur-xl
                text-white
                hover:bg-white/20
                transition-all duration-200
                "
            >
              <Bell className="w-6 h-6" />
            </button>
            {/* Profile Avatar */}
            <div className="relative" ref={popoverRef}>
              <div
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/40 cursor-pointer hover:border-white/60 transition-colors"
                onClick={() => setIsPopoverOpen(!isPopoverOpen)}
              >
                {user?.avatar ? (
                  <img
                    src={user?.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white/20 flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}
              </div>

              {/* Popover */}
              {isPopoverOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/20 bg-black/60 backdrop-blur-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden text-left">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm font-medium text-white truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-white/70 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-white/10 hover:text-red-300 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 w-full overflow-y-auto relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
