import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Star,
  StarOff,
  Sparkles,
  Copy,
  Download,
  Share,
  RefreshCw,
  Calendar as CalendarIcon,
  Filter,
  Search,
  Eye,
  Heart,
  MessageSquare,
  Repeat,
  BarChart3,
  PieChart,
  LineChart,
  MapPin,
  Users,
  Clock,
  Hash,
  Zap,
  Target,
  Globe,
  Activity,
  Flame,
  Award,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileText,
  Code,
  Mail,
  Bell,
  Settings,
  MoreHorizontal,
  Bookmark,
  BookmarkCheck
} from "lucide-react";
import { LineChart as RechartsLineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ScatterChart, Scatter } from "recharts";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface TrendDetail {
  id: string;
  hashtag: string;
  title: string;
  popularity: number;
  ranking: number;
  growth: number;
  platforms: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  totalMentions: number;
  peakTime: string;
  description: string;
  lifecycle: 'emerging' | 'trending' | 'peak' | 'declining';
  predictedDirection: 'up' | 'down' | 'stable';
}

interface RelatedPost {
  id: string;
  content: string;
  author: string;
  platform: string;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
  timestamp: string;
  verified: boolean;
}

interface Influencer {
  id: string;
  name: string;
  handle: string;
  platform: string;
  followers: number;
  engagement: number;
  posts: number;
  avatar: string;
}

const TrendDetails = () => {
  const { trendId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<Date>();
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['all']);
  const [engagementFilter, setEngagementFilter] = useState([0]);
  const [contentTypeFilter, setContentTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [generatedContent, setGeneratedContent] = useState('');
  const [contentStyle, setContentStyle] = useState('engaging');
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['analytics', 'content']);

  // Fetch Trend Details
  const { data: trendDetail, isLoading } = useQuery({
    queryKey: ['trend', trendId],
    queryFn: async () => {
      const response = await api.get(`/trends/${trendId}`);
      return response.data;
    }
  });

  const trendEvolutionData = [
    { time: '00:00', mentions: 120, sentiment: 65, engagement: 1200 },
    { time: '04:00', mentions: 89, sentiment: 72, engagement: 890 },
    { time: '08:00', mentions: 245, sentiment: 68, engagement: 2100 },
    { time: '12:00', mentions: 387, sentiment: 75, engagement: 3200 },
    { time: '16:00', mentions: 456, sentiment: 71, engagement: 4100 },
    { time: '20:00', mentions: 523, sentiment: 78, engagement: 4800 },
  ];

  const geographicData = [
    { region: 'North America', mentions: 15420, percentage: 34 },
    { region: 'Europe', mentions: 12890, percentage: 28 },
    { region: 'Asia Pacific', mentions: 11230, percentage: 25 },
    { region: 'Latin America', mentions: 3890, percentage: 8 },
    { region: 'Others', mentions: 2242, percentage: 5 },
  ];

  const hourlyHeatmapData = [
    { hour: 0, day: 'Mon', value: 12 }, { hour: 1, day: 'Mon', value: 8 }, { hour: 2, day: 'Mon', value: 6 },
    { hour: 3, day: 'Mon', value: 4 }, { hour: 4, day: 'Mon', value: 7 }, { hour: 5, day: 'Mon', value: 15 },
    { hour: 6, day: 'Mon', value: 25 }, { hour: 7, day: 'Mon', value: 35 }, { hour: 8, day: 'Mon', value: 45 },
    { hour: 9, day: 'Mon', value: 52 }, { hour: 10, day: 'Mon', value: 48 }, { hour: 11, day: 'Mon', value: 42 },
    { hour: 12, day: 'Mon', value: 38 }, { hour: 13, day: 'Mon', value: 35 }, { hour: 14, day: 'Mon', value: 40 },
    { hour: 15, day: 'Mon', value: 45 }, { hour: 16, day: 'Mon', value: 50 }, { hour: 17, day: 'Mon', value: 55 },
    { hour: 18, day: 'Mon', value: 48 }, { hour: 19, day: 'Mon', value: 42 }, { hour: 20, day: 'Mon', value: 38 },
    { hour: 21, day: 'Mon', value: 32 }, { hour: 22, day: 'Mon', value: 25 }, { hour: 23, day: 'Mon', value: 18 },
  ];

  const relatedPosts: RelatedPost[] = [
    {
      id: '1',
      content: 'The future of healthcare is here! AI-powered diagnostics are revolutionizing patient care. #AIRevolution #Healthcare',
      author: 'Dr. Sarah Johnson',
      platform: 'Twitter',
      engagement: { likes: 1240, shares: 340, comments: 89 },
      timestamp: '2 hours ago',
      verified: true
    },
    {
      id: '2',
      content: 'Just witnessed an AI system detect early-stage cancer with 99.7% accuracy. This is game-changing for millions of patients worldwide.',
      author: 'MedTech Insider',
      platform: 'LinkedIn',
      engagement: { likes: 2890, shares: 567, comments: 234 },
      timestamp: '4 hours ago',
      verified: false
    },
    {
      id: '3',
      content: 'AI in healthcare discussion: While the technology is promising, we need to address ethical concerns and data privacy issues.',
      author: 'HealthEthics',
      platform: 'Reddit',
      engagement: { likes: 456, shares: 123, comments: 67 },
      timestamp: '6 hours ago',
      verified: false
    }
  ];

  const topInfluencers: Influencer[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      handle: '@drsarahj',
      platform: 'Twitter',
      followers: 125000,
      engagement: 8.5,
      posts: 12,
      avatar: 'SJ'
    },
    {
      id: '2',
      name: 'AI Healthcare Today',
      handle: '@aihealthtoday',
      platform: 'LinkedIn',
      followers: 89000,
      engagement: 12.3,
      posts: 8,
      avatar: 'AH'
    },
    {
      id: '3',
      name: 'MedTech Innovations',
      handle: 'u/medtechinnovations',
      platform: 'Reddit',
      followers: 67000,
      engagement: 15.7,
      posts: 15,
      avatar: 'MI'
    }
  ];

  const relatedHashtags = [
    '#Healthcare', '#MedicalAI', '#DigitalHealth', '#Innovation', '#Technology',
    '#MachineLearning', '#DeepLearning', '#Diagnostics', '#PatientCare', '#MedTech'
  ];

  const similarTrends = [
    { name: '#HealthTech', similarity: 89, period: 'Last month' },
    { name: '#MedicalInnovation', similarity: 76, period: '2 months ago' },
    { name: '#AIinMedicine', similarity: 92, period: '3 months ago' }
  ];

  const handleGenerateAIContent = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const styles = {
        summary: `📊 TREND ANALYSIS: ${trendDetail.topic}

Current Status: ${trendDetail.postCount} posts
Velocity: ${trendDetail.velocity}

Key Insights:
• Strong momentum in discussions
• High level of engagement from community

This trend shows strong potential.`,

        engaging: `🚀 The ${trendDetail.topic} is trending right now! 

Everyone is talking about it.
Based on ${trendDetail.subreddit} discussions.

What's your take? 👇 #TrendPulse`,

        news: `BREAKING: ${trendDetail.topic} Gains Traction on Reddit

Subreddit: r/${trendDetail.subreddit}
Current Score: ${trendDetail.score}

The discussion is heating up with meaningful community engagement.`,

        casual: `Have you seen what's going on with ${trendDetail.topic}? 🤯

It's blowing up on r/${trendDetail.subreddit} right now.
People are really into it!`
      };

      // @ts-ignore
      setGeneratedContent(styles[contentStyle as keyof typeof styles] || styles.engaging);
      
      toast({
        title: "AI Content Generated!",
        description: "Your trend-based content is ready to use.",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: isBookmarked ? 
        "Trend removed from your saved items" : 
        "Trend saved to your bookmarks",
    });
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(generatedContent);
    toast({
      title: "Content copied",
      description: "AI-generated content copied to clipboard",
    });
  };

  const handleExportReport = () => {
    toast({
      title: "Report generation started",
      description: "Your trend report will be ready for download shortly",
    });
  };

  const handleShareTrend = () => {
    const shareUrl = `${window.location.origin}/trends/${trendId}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Share link copied",
      description: "Trend URL copied to clipboard",
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-dashboard p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-32 bg-muted rounded"></div>
             <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!trendDetail) {
    return (
        <div className="min-h-screen gradient-dashboard p-6 flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-white mb-4">Trend not found</h2>
            <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
    );
  }

  const getLifecycleColor = (lifecycle: string) => {
    switch(lifecycle) {
      case 'emerging': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'trending': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'peak': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'declining': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <div className="min-h-screen gradient-dashboard p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            className="text-muted-foreground hover:text-foreground"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShareTrend}>
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportReport}>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Main Trend Header */}
        <Card className="glass-card border-none text-card-foreground">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold tracking-tight">{trendDetail.topic}</h1>
                    {/* Using mock values via OR for missing fields or assuming default */}
                  <Badge variant="outline" className={cn("capitalize px-3 py-1", getLifecycleColor('trending'))}> 
                    <TrendingUp className="mr-1.5 h-3.5 w-3.5" />
                    Trending
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <Hash className="mr-1 h-3.5 w-3.5" />
                    {trendDetail.subreddit}
                  </span>
                  <span className="flex items-center">
                    <Activity className="mr-1 h-3.5 w-3.5" />
                    Score: {trendDetail.score}
                  </span>
                  <span className="flex items-center">
                    <Clock className="mr-1 h-3.5 w-3.5" />
                    Found {new Date(trendDetail.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <Button 
                  size="lg" 
                  className={cn(
                    "w-full md:w-auto transition-all",
                    isBookmarked ? "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30" : ""
                  )}
                  variant={isBookmarked ? "secondary" : "default"}
                  onClick={handleBookmark}
                >
                  {isBookmarked ? (
                    <>
                      <Star className="mr-2 h-4 w-4 fill-yellow-500" />
                      Bookmarked
                    </>
                  ) : (
                    <>
                      <StarOff className="mr-2 h-4 w-4" />
                      Bookmark Trend
                    </>
                  )}
                </Button>
                <Button size="lg" className="premium-button shadow-lg shadow-primary/20" onClick={() => {
                   document.getElementById('content-generator')?.scrollIntoView({ behavior: 'smooth' });
                   if (!generatedContent) handleGenerateAIContent();
                }}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Content
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl">
              {trendDetail.title || "Trending discussion detected on Reddit."}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="p-4 rounded-lg bg-background/40 border border-border/50 backdrop-blur-sm">
                <div className="text-sm font-medium text-muted-foreground mb-1">Total Mentions</div>
                <div className="text-2xl font-bold flex items-center gap-2">
                  {trendDetail.postCount || 0}
                  <Badge className="bg-green-500/20 text-green-500 border-none text-xs">+12.5%</Badge>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-background/40 border border-border/50 backdrop-blur-sm">
                <div className="text-sm font-medium text-muted-foreground mb-1">Sentiment</div>
                <div className="text-2xl font-bold capitalize text-green-500">
                    {trendDetail.status || 'Active'}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-background/40 border border-border/50 backdrop-blur-sm">
                <div className="text-sm font-medium text-muted-foreground mb-1">Velocity</div>
                <div className="text-2xl font-bold">{trendDetail.velocity || 0}/hr</div>
              </div>
               <div className="p-4 rounded-lg bg-background/40 border border-border/50 backdrop-blur-sm">
                <div className="text-sm font-medium text-muted-foreground mb-1">Predicted Growth</div>
                 <div className="text-2xl font-bold flex items-center gap-1 text-green-500">
                   <TrendingUp className="h-4 w-4" />
                   High
                 </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Generator */}
         <div id="content-generator" className="glass-card rounded-xl border-none p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-purple-500" />
                        AI Content Generator
                    </h2>
                    <p className="text-sm text-muted-foreground">Draft high-engagement posts based on this trend</p>
                </div>
                 <Select value={contentStyle} onValueChange={setContentStyle}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="summary">Analytical Summary</SelectItem>
                        <SelectItem value="engaging">Viral / Engaging</SelectItem>
                        <SelectItem value="news">News / Journalistic</SelectItem>
                        <SelectItem value="casual">Casual / Conversational</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-4">
                     <div className="p-4 rounded-lg bg-background/50 border border-border/50 min-h-[200px] relative group">
                        {isGenerating ? (
                             <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10 rounded-lg">
                                <Sparkles className="h-8 w-8 text-purple-500 animate-spin mb-2" />
                                <span className="text-sm font-medium animate-pulse">Generating magic...</span>
                             </div>
                        ) : null}
                         
                        {generatedContent ? (
                            <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                                {generatedContent}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-2 opacity-70">
                                <Sparkles className="h-8 w-8" />
                                <p>Select a style and click generate</p>
                            </div>
                        )}
                        
                        {generatedContent && (
                             <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <Button size="icon" variant="ghost" className="h-8 w-8 bg-background/80 backdrop-blur shadow-sm" onClick={handleCopyContent}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                             </div>
                        )}
                     </div>
                     
                     <div className="flex gap-3">
                        <Button 
                            className="flex-1 premium-button" 
                            onClick={handleGenerateAIContent}
                            disabled={isGenerating}
                        >
                             <Sparkles className="mr-2 h-4 w-4" />
                             {generatedContent ? "Regenerate Content" : "Generate Draft"}
                        </Button>
                         {generatedContent && (
                            <Button variant="secondary" className="flex-1">
                                <Share className="mr-2 h-4 w-4" />
                                Schedule Post
                            </Button>
                        )}
                     </div>
                 </div>
                 
                 <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Platform Preview</h3>
                     <Tabs defaultValue="twitter">
                        <TabsList className="w-full grid grid-cols-3">
                            <TabsTrigger value="twitter">Twitter</TabsTrigger>
                            <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
                            <TabsTrigger value="reddit">Reddit</TabsTrigger>
                        </TabsList>
                        <TabsContent value="twitter" className="mt-4">
                             <div className="p-4 rounded-xl border border-border/40 bg-black/40 backdrop-blur-sm">
                                <div className="flex gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center font-bold text-white">
                                        K
                                    </div>
                                    <div className="space-y-1.5 flex-1">
                                         <div className="flex items-center gap-2">
                                            <span className="font-bold">Kavya</span>
                                            <span className="text-sm text-muted-foreground">@kavya_trends</span>
                                         </div>
                                         <p className="text-[15px] leading-normal">
                                            {generatedContent || "Your AI-generated tweet will appear here..."}
                                         </p>
                                         {generatedContent && <p className="text-blue-400 text-[15px] mt-1">#TrendPulse #{trendDetail.topic.replace(/\s+/g, '')}</p>}
                                    </div>
                                </div>
                             </div>
                        </TabsContent>
                         {/* Add other tab contents if needed */}
                     </Tabs>
                 </div>
            </div>
         </div>
        
        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <Card className="col-span-1 lg:col-span-2 glass-card border-none">
             <CardHeader>
               <CardTitle>Trend Evolution</CardTitle>
               <CardDescription>Mentions and sentiment over the last 24h</CardDescription>
             </CardHeader>
             <CardContent className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={trendEvolutionData}>
                   <defs>
                     <linearGradient id="colorMentions" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                       <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                   <XAxis dataKey="time" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                   <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                   <Tooltip 
                     contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                     itemStyle={{ color: '#fff' }}
                   />
                   <Area type="monotone" dataKey="mentions" stroke="#8884d8" fillOpacity={1} fill="url(#colorMentions)" strokeWidth={2} />
                 </AreaChart>
               </ResponsiveContainer>
             </CardContent>
           </Card>
           
           <Card className="glass-card border-none">
             <CardHeader>
                <CardTitle>Demographics</CardTitle>
                <CardDescription>Audience distribution</CardDescription>
             </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                 <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={geographicData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="percentage"
                      >
                        {geographicData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'][index % 5]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', borderRadius: '8px' }} />
                      <Legend />
                    </RechartsPieChart>
                 </ResponsiveContainer>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default TrendDetails;