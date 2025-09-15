import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Minus
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TrendData {
  id: string;
  hashtag: string;
  count: number;
  platform: 'Twitter' | 'Reddit' | 'Instagram';
  sentiment: 'positive' | 'negative' | 'neutral';
  change: number;
  peakTime: string;
}

const Dashboard = () => {
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h");

  // Mock real-time trend data
  useEffect(() => {
    const mockTrends: TrendData[] = [
      { id: '1', hashtag: '#AIRevolution', count: 45672, platform: 'Twitter', sentiment: 'positive', change: 12.5, peakTime: '2h ago' },
      { id: '2', hashtag: '#ClimateAction', count: 38291, platform: 'Reddit', sentiment: 'positive', change: 8.3, peakTime: '1h ago' },
      { id: '3', hashtag: '#TechLayoffs', count: 29853, platform: 'Twitter', sentiment: 'negative', change: -15.2, peakTime: '3h ago' },
      { id: '4', hashtag: '#WorldCup2024', count: 67431, platform: 'Instagram', sentiment: 'positive', change: 22.1, peakTime: '30m ago' },
      { id: '5', hashtag: '#CryptoNews', count: 19284, platform: 'Twitter', sentiment: 'neutral', change: -3.7, peakTime: '2h ago' },
      { id: '6', hashtag: '#HealthTech', count: 15632, platform: 'Reddit', sentiment: 'positive', change: 18.9, peakTime: '1h ago' },
    ];

    setTrends(mockTrends);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setTrends(prevTrends => 
        prevTrends.map(trend => ({
          ...trend,
          count: trend.count + Math.floor(Math.random() * 100),
          change: trend.change + (Math.random() - 0.5) * 2
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredTrends = trends.filter(trend => {
    const matchesSearch = trend.hashtag.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = selectedPlatform === "all" || trend.platform === selectedPlatform;
    return matchesSearch && matchesPlatform;
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
      default: return 'text-muted-foreground';
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="w-3 h-3" />;
    if (change < 0) return <ArrowDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  const totalMentions = trends.reduce((sum, trend) => sum + trend.count, 0);
  const positiveTrends = trends.filter(t => t.sentiment === 'positive').length;
  const negativeTrends = trends.filter(t => t.sentiment === 'negative').length;

  return (
    <div className="min-h-screen gradient-dashboard p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Live Trend Analytics
            </h1>
            <p className="text-muted-foreground">
              Real-time social media trend monitoring and sentiment analysis
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="transition-smooth">
              <Bell className="w-4 h-4 mr-2" />
              Alerts
            </Button>
            <Button variant="outline" size="sm" className="transition-smooth">
              <Calendar className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="gradient-card border-border shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Mentions</p>
                  <p className="text-2xl font-bold">{totalMentions.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-border shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Trends</p>
                  <p className="text-2xl font-bold">{trends.length}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-chart-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-border shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Positive Sentiment</p>
                  <p className="text-2xl font-bold text-sentiment-positive">{positiveTrends}</p>
                </div>
                <Users className="w-8 h-8 text-sentiment-positive" />
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-border shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Negative Sentiment</p>
                  <p className="text-2xl font-bold text-sentiment-negative">{negativeTrends}</p>
                </div>
                <Globe className="w-8 h-8 text-sentiment-negative" />
              </div>
            </CardContent>
          </Card>
        </div>

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
                </SelectContent>
              </Select>

              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger className="w-full lg:w-[180px]">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="6h">Last 6 Hours</SelectItem>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Trends Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTrends.map((trend) => (
            <Card key={trend.id} className="gradient-card border-border shadow-card transition-spring hover:scale-[1.02] cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-primary">
                    {trend.hashtag}
                  </CardTitle>
                  <Badge variant={getSentimentBadgeVariant(trend.sentiment)} className="capitalize">
                    {trend.sentiment}
                  </Badge>
                </div>
                <CardDescription className={getPlatformColor(trend.platform)}>
                  {trend.platform} • Peak: {trend.peakTime}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{trend.count.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">mentions</p>
                  </div>
                  <div className={`flex items-center gap-1 ${trend.change >= 0 ? 'text-sentiment-positive' : 'text-sentiment-negative'}`}>
                    {getChangeIcon(trend.change)}
                    <span className="font-medium">{Math.abs(trend.change).toFixed(1)}%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Engagement Level</span>
                    <span>{Math.floor(trend.count / 1000)}K</span>
                  </div>
                  <Progress 
                    value={Math.min((trend.count / 70000) * 100, 100)} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;