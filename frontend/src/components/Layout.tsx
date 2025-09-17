import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";  
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  TrendingUp, 
  BarChart3, 
  User, 
  Settings, 
  LogOut,
  Bell,
  Menu
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token && location.pathname !== "/") {
      navigate("/");
    }
  }, [navigate, location]);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    navigate("/");
  };

  const isAuthenticated = localStorage.getItem("auth_token");

  if (!isAuthenticated && location.pathname !== "/") {
    return null;
  }

  if (location.pathname === "/") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen gradient-dashboard">
      {/* Navigation Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                  <TrendingUp className="w-4 h-4 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  TrendScope
                </h1>
              </div>

              <nav className="hidden md:flex items-center space-x-6">
                <Button
                  variant={location.pathname === "/dashboard" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => navigate("/dashboard")}
                  className="transition-smooth"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                
                {/* <Button
                  variant={location.pathname === "/create" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => navigate("/create")}
                  className="transition-smooth"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Create Content
                </Button> */}
                
                <Button
                  variant={location.pathname === "/post" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => navigate("/post")}
                  className="transition-smooth"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Post
                </Button>
              </nav>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-sentiment-negative rounded-full"></span>
              </Button>

              {/* Mobile Menu */}
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="w-4 h-4" />
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="gradient-primary text-primary-foreground">
                        DA
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Demo Analyst</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        demo@analytics.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;