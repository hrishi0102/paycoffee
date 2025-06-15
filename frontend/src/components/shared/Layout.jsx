import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/button";
import { Coffee, LogOut, Plus, LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Create Widget", href: "/create-widget", icon: Plus },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Subtle background pattern */}
      <div
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(120, 53, 15, 0.03) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(120, 53, 15, 0.03) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      ></div>

      {/* Header */}
      <header className="relative z-10 bg-white/90 backdrop-blur-sm border-b border-amber-200 sticky top-0">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            to="/dashboard"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Coffee className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-900 to-orange-800 bg-clip-text text-transparent">
              PayCoffee
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-2 bg-amber-50 px-4 py-2 rounded-xl border border-amber-200">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user?.display_name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div className="text-sm">
                <div className="font-medium text-amber-900">
                  {user?.display_name}
                </div>
                <div className="text-amber-700/70 text-xs">{user?.email}</div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-amber-800 hover:text-amber-900 hover:bg-amber-100 flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-amber-200">
        <div className="container mx-auto px-6">
          <div className="flex space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-all duration-200 ${
                    isActive
                      ? "border-amber-600 text-amber-900 bg-amber-50/50"
                      : "border-transparent text-amber-700 hover:text-amber-900 hover:border-amber-300"
                  } px-3 rounded-t-lg`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
