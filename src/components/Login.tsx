import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp, BarChart3, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      if (email === "demo@analytics.com" && password === "demo123") {
        localStorage.setItem("auth_token", "demo_jwt_token");
        toast({
          title: "Login successful",
          description: "Welcome to Social Media Analytics Platform",
        });
        navigate("/dashboard");
      } else {
        setError("Invalid credentials. Try demo@analytics.com / demo123");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-dashboard p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            TrendScope Analytics
          </h1>
          <p className="text-muted-foreground">
            Real-time social media trend monitoring
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center space-y-2">
            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center mx-auto">
              <TrendingUp className="w-5 h-5 text-sentiment-positive" />
            </div>
            <p className="text-xs text-muted-foreground">Live Trends</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center mx-auto">
              <BarChart3 className="w-5 h-5 text-chart-secondary" />
            </div>
            <p className="text-xs text-muted-foreground">Analytics</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center mx-auto">
              <Users className="w-5 h-5 text-chart-tertiary" />
            </div>
            <p className="text-xs text-muted-foreground">Sentiment</p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="gradient-card border-border shadow-card">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the analytics dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="demo@analytics.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="transition-smooth"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="demo123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="transition-smooth"
                />
              </div>
              
              <Button
                type="submit"
                className="w-full gradient-primary shadow-glow transition-spring hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Demo credentials: demo@analytics.com / demo123
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;