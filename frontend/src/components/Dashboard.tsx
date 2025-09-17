import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Filter, 
  Bell,
  BarChart3,
  Users,
  Globe,
  Calendar,
  ArrowUp,
  ArrowDown,
  Minus,
  RefreshCw,
  Download,
  Zap,
  Activity,
  Clock,
  Wifi,
  WifiOff,
  Eye,
  MessageSquare,
  Heart,
  Share,
  Sparkles,
  Target,
  PieChart,
  LineChart,
  Hash,
  MapPin,
  Flame,
  Star,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface TrendData {
  id: string;
  hashtag: string;
  count: number;
  platform: 'Twitter' | 'Reddit' | 'Instagram' | 'LinkedIn';
  sentiment: 'positive' | 'negative' | 'neutral';
  change: number;
  peakTime: string;
  popularity: number;
  growth: number;
}

interface ActivityItem {
  id: string;
  type: 'trend_discovered' | 'post_generated' | 'alert' | 'user_action';
  title: string;
  description: string;
  timestamp: string;
  platform?: string;
  icon: any;
}

interface PlatformStatus {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'syncing';
  lastSync: string;
  postsCollected: number;
  trendsFound: number;
  icon: string;
  color: string;
}

const Dashboard = () => {
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h");
  const [selectedSentiment, setSelectedSentiment] = useState("all");
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const { toast } = useToast();

  // Mock data for charts
  const trendActivityData = [
    { time: '00:00', trends: 45, engagement: 1200 },
    { time: '04:00', trends: 32, engagement: 800 },
    { time: '08:00', trends: 78, engagement: 2100 },
    { time: '12:00', trends: 95, engagement: 3200 },
    { time: '16:00', trends: 87, engagement: 2800 },
    { time: '20:00', trends: 112, engagement: 4100 },
  ];

  const platformComparisonData = [
    { platform: 'Twitter', trends: 156, posts: 2340 },
    { platform: 'Reddit', trends: 89, posts: 1560 },
    { platform: 'Instagram', trends: 67, posts: 890 },
    { platform: 'LinkedIn', trends: 34, posts: 450 },
  ];

  const sentimentData = [
    { name: 'Positive', value: 45, color: '#10B981' },
    { name: 'Neutral', value: 35, color: '#F59E0B' },
    { name: 'Negative', value: 20, color: '#EF4444' },
  ];

  const heatmapData = [
    { hour: '00', day: 'Mon', value: 12 },
    { hour: '04', day: 'Mon', value: 8 },
    { hour: '08', day: 'Mon', value: 25 },
    { hour: '12', day: 'Mon', value: 45 },
    { hour: '16', day: 'Mon', value: 38 },
    { hour: '20', day: 'Mon', value: 52 },
  ];

  // Mock real-time trend data
  useEffect(() => {
    const mockTrends: TrendData[] = [
      { id: '1', hashtag: '#AIRevolution', count: 45672, platform: 'Twitter', sentiment: 'positive', change: 12.5, peakTime: '2h ago', popularity: 95, growth: 12.5 },
      { id: '2', hashtag: '#ClimateAction', count: 38291, platform: 'Reddit', sentiment: 'positive', change: 8.3, peakTime: '1h ago', popularity: 88, growth: 8.3 },
      { id: '3', hashtag: '#TechLayoffs', count: 29853, platform: 'Twitter', sentiment: 'negative', change: -15.2, peakTime: '3h ago', popularity: 76, growth: -15.2 },
      { id: '4', hashtag: '#WorldCup2024', count: 67431, platform: 'Instagram', sentiment: 'positive', change: 22.1, peakTime: '30m ago', popularity: 92, growth: 22.1 },
      { id: '5', hashtag: '#CryptoNews', count: 19284, platform: 'Twitter', sentiment: 'neutral', change: -3.7, peakTime: '2h ago', popularity: 68, growth: -3.7 },
      { id: '6', hashtag: '#HealthTech', count: 15632, platform: 'LinkedIn', sentiment: 'positive', change: 18.9, peakTime: '1h ago', popularity: 71, growth: 18.9 },
      { id: '7', hashtag: '#RemoteWork', count: 24567, platform: 'LinkedIn', sentiment: 'neutral', change: 5.2, peakTime: '4h ago', popularity: 82, growth: 5.2 },
      { id: '8', hashtag: '#Sustainability', count: 31245, platform: 'Reddit', sentiment: 'positive', change: 14.7, peakTime: '2h ago', popularity: 79, growth: 14.7 },
      { id: '9', hashtag: '#DigitalMarketing', count: 18934, platform: 'Instagram', sentiment: 'positive', change: 9.8, peakTime: '3h ago', popularity: 74, growth: 9.8 },
      { id: '10', hashtag: '#Innovation', count: 22156, platform: 'Twitter', sentiment: 'positive', change: 11.3, peakTime: '1h ago', popularity: 77, growth: 11.3 },
    ];

    setTrends(mockTrends);

    // Simulate real-time updates
    const interval = setInterval(() => {
      if (isLive) {
        setTrends(prevTrends => 
          prevTrends.map(trend => ({
            ...trend,
            count: trend.count + Math.floor(Math.random() * 100),
            change: trend.change + (Math.random() - 0.5) * 2
          }))
        );
        setLastUpdate(new Date());
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive]);

  const recentActivities: ActivityItem[] = [
    {
      id: '1',
      type: 'trend_discovered',
      title: 'New trending topic discovered',
      description: '#AIRevolution is gaining momentum on Twitter',
      timestamp: '2 minutes ago',
      platform: 'Twitter',
      icon: TrendingUp
    },
    {
      id: '2',
      type: 'post_generated',
      title: 'AI post generated',
      description: 'Created engaging content for #ClimateAction',
      timestamp: '5 minutes ago',
      platform: 'Reddit',
      icon: Sparkles
    },
    {
      id: '3',
      type: 'alert',
      title: 'High engagement detected',
      description: '#WorldCup2024 showing 300% increase in mentions',
      timestamp: '12 minutes ago',
      platform: 'Instagram',
      icon: AlertCircle
    },
    {
      id: '4',
      type: 'user_action',
      title: 'Dashboard exported',
      description: 'Weekly trend report generated successfully',
      timestamp: '1 hour ago',
      icon: Download
    }
  ];

  const platformStatuses: PlatformStatus[] = [
    {
      id: 'twitter',
      name: 'Twitter',
      status: 'connected',
      lastSync: '2 minutes ago',
      postsCollected: 15420,
      trendsFound: 156,
      icon: '𝕏',
      color: 'text-blue-400'
    },
    {
      id: 'reddit',
      name: 'Reddit',
      status: 'connected',
      lastSync: '3 minutes ago',
      postsCollected: 8930,
      trendsFound: 89,
      icon: '🔴',
      color: 'text-orange-500'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      status: 'syncing',
      lastSync: '5 minutes ago',
      postsCollected: 6780,
      trendsFound: 67,
      icon: '📷',
      color: 'text-pink-500'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      status: 'connected',
      lastSync: '1 minute ago',
      postsCollected: 3450,
      trendsFound: 34,
      icon: '💼',
      color: 'text-blue-600'
    }
  ];

  const filteredTrends = trends.filter(trend => {
    const matchesSearch = trend.hashtag.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = selectedPlatform === "all" || trend.platform === selectedPlatform;
    const matchesSentiment = selectedSentiment === "all" || trend.sentiment === selectedSentiment;
    return matchesSearch && matchesPlatform && matchesSentiment;
  });

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-sentiment-positive';
      case 'negative': return 'text-sentiment-negative';
      default: return 'text-sentiment-neutral';
    }
  };

  const getSentimentBadgeVariant = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'default';
      case 'negative': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Twitter': return 'text-chart-primary';
      case 'Reddit': return 'text-chart-secondary';
      case 'Instagram': return 'text-chart-tertiary';
      case 'LinkedIn': return 'text-blue-600';
      default: return 'text-muted-foreground';
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="w-3 h-3" />;
    if (change < 0) return <ArrowDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4 text-sentiment-positive" />;
      case 'syncing': return <RefreshCw className="w-4 h-4 text-sentiment-neutral animate-spin" />;
      case 'disconnected': return <AlertCircle className="w-4 h-4 text-sentiment-negative" />;
      default: return <Info className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const handleGeneratePost = (trend: TrendData) => {
    toast({
      title: "AI Post Generation Started",
      description: `Creating content for ${trend.hashtag}...`,
    });
    // Navigate to post creation with pre-filled trend
    // This would typically use React Router
  };

  const handleRefreshData = () => {
    setLastUpdate(new Date());
    toast({
      title: "Data Refreshed",
      description: "Dashboard data has been updated with the latest trends.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Your dashboard data is being prepared for download.",
    });
  };

  const totalMentions = trends.reduce((sum, trend) => sum + trend.count, 0);
  const positiveTrends = trends.filter(t => t.sentiment === 'positive').length;
  const activePlatforms = platformStatuses.filter(p => p.status === 'connected').length;
  const aiPostsToday = 47; // Mock data

  return (
    <div className="min-h-screen gradient-dashboard p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Welcome back, Demo Analyst
              </h1>
              <div className="flex items-center gap-2">
                {isLive ? (
                  <div className="flex items-center gap-1 text-sentiment-positive">
                    <div className="w-2 h-2 bg-sentiment-positive rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium">Live</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                    <span className="text-xs font-medium">Offline</span>
                  </div>
                )}
              </div>
            </div>
            <p className="text-muted-foreground">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last Hour</SelectItem>
                <SelectItem value="6h">Last 6 Hours</SelectItem>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={handleRefreshData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="gradient-card border-border shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Mentions</p>
                  <p className="text-2xl font-bold">{totalMentions.toLocaleString()}</p>
                  <p className="text-xs text-sentiment-positive flex items-center gap-1 mt-1">
                    <ArrowUp className="w-3 h-3" />
                    +12.5% from yesterday
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-border shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Platforms</p>
                  <p className="text-2xl font-bold">{activePlatforms}/4</p>
                  <p className="text-xs text-sentiment-positive flex items-center gap-1 mt-1">
                    <CheckCircle className="w-3 h-3" />
                    All systems operational
                  </p>
                </div>
                <Globe className="w-8 h-8 text-chart-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-border shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">AI Posts Today</p>
                  <p className="text-2xl font-bold">{aiPostsToday}</p>
                  <p className="text-xs text-sentiment-positive flex items-center gap-1 mt-1">
                    <Sparkles className="w-3 h-3" />
                    +8 from yesterday
                  </p>
                </div>
                <Zap className="w-8 h-8 text-sentiment-positive" />
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-border shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Trending Topics</p>
                  <p className="text-2xl font-bold">{trends.length}</p>
                  <p className="text-xs text-sentiment-positive flex items-center gap-1 mt-1">
                    <Flame className="w-3 h-3" />
                    {positiveTrends} positive sentiment
                  </p>
                </div>
                <Hash className="w-8 h-8 text-chart-tertiary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Trends Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <Card className="gradient-card border-border shadow-card">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search trends..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                    <SelectTrigger className="w-full lg:w-[180px]">
                      <SelectValue placeholder="Platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Platforms</SelectItem>
                      <SelectItem value="Twitter">Twitter</SelectItem>
                      <SelectItem value="Reddit">Reddit</SelectItem>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedSentiment} onValueChange={setSelectedSentiment}>
                    <SelectTrigger className="w-full lg:w-[180px]">
                      <SelectValue placeholder="Sentiment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sentiments</SelectItem>
                      <SelectItem value="positive">Positive</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="negative">Negative</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" onClick={handleExportData}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Trending Topics List */}
            <Card className="gradient-card border-border shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-primary" />
                    Live Trending Topics
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-sentiment-positive rounded-full animate-pulse"></div>
                    <span className="text-xs text-muted-foreground">Live updates</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {filteredTrends.map((trend, index) => (
                      <div key={trend.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-muted-foreground">#{index + 1}</span>
                            <Badge variant="outline" className="text-xs">
                              {trend.platform}
                            </Badge>
                          </div>
                          <div>
                            <h4 className="font-semibold text-primary">{trend.hashtag}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{trend.count.toLocaleString()} mentions</span>
                              <span>•</span>
                              <span className={`flex items-center gap-1 ${trend.change >= 0 ? 'text-sentiment-positive' : 'text-sentiment-negative'}`}>
                                {getChangeIcon(trend.change)}
                                {Math.abs(trend.change).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getSentimentBadgeVariant(trend.sentiment)} className="capitalize text-xs">
                            {trend.sentiment}
                          </Badge>
                          <Button 
                            size="sm" 
                            onClick={() => handleGeneratePost(trend)}
                            className="bg-primary hover:bg-primary/90"
                          >
                            <Sparkles className="w-3 h-3 mr-1" />
                            Generate
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="gradient-card border-border shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Trend Activity Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={trendActivityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="trends" 
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary))" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="gradient-card border-border shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Platform Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={platformComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="platform" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar dataKey="trends" fill="hsl(var(--chart-primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Sentiment Distribution */}
            <Card className="gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Sentiment Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-4">
                  {sentimentData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <activity.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Platform Status */}
            <Card className="gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Platform Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {platformStatuses.map((platform) => (
                    <div key={platform.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{platform.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{platform.name}</span>
                            {getStatusIcon(platform.status)}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Last sync: {platform.lastSync}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{platform.trendsFound}</p>
                        <p className="text-xs text-muted-foreground">trends</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;