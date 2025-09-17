import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Home, TrendingUp } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center gradient-dashboard p-4">
      <Card className="w-full max-w-md gradient-card border-border shadow-card text-center">
        <CardHeader className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Page Not Found</CardTitle>
            <CardDescription className="mt-2">
              The page you're looking for doesn't exist or has been moved.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Route: <code className="text-primary">{location.pathname}</code>
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={() => window.location.href = "/dashboard"} 
              className="gradient-primary shadow-glow transition-spring hover:scale-[1.02] flex-1"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = "/"} 
              className="transition-smooth flex-1"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
