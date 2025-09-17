import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
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
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
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
  BookmarkCheck,
  CheckCircle
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ScatterChart, Scatter } from 'recharts';

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
  
  const [trendDetail, setTrendDetail] = useState<TrendDetail | null>(null);
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

  // Mock data
  const mockTrendDetail: TrendDetail = {
    id: '1',
    hashtag: '#AIRevolution',
    title: 'AI Revolution in Healthcare',
    popularity: 95,
    ranking: 1,
    growth: 12.5,
    platforms: ['Twitter', 'LinkedIn', 'Reddit'],
    sentiment: 'positive',
    totalMentions: 45672,
    peakTime: '2 hours ago',
    description: 'A trending discussion about artificial intelligence transforming healthcare industry with breakthrough innovations.',
    lifecycle: 'trending',
    predictedDirection: 'up'
  };

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

  useEffect(() => {
    // Simulate loading trend details
    setTrendDetail(mockTrendDetail);
  }, [trendId]);

  const handleGenerateAIContent = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const styles = {
        summary: `📊 TREND ANALYSIS: ${mockTrendDetail.hashtag}

Current Status: ${mockTrendDetail.totalMentions.toLocaleString()} mentions (+${mockTrendDetail.growth}%)
Sentiment: ${mockTrendDetail.sentiment.toUpperCase()}
Peak Activity: ${mockTrendDetail.peakTime}

Key Insights:
• Breakthrough AI diagnostics showing 99.7% accuracy
• Major healthcare institutions adopting AI solutions
• Growing discussion around ethical implications

This trend shows strong momentum across ${mockTrendDetail.platforms.join(', ')} with sustained growth expected.`,

        engaging: `🚀 The ${mockTrendDetail.hashtag} is absolutely EXPLODING right now! 

Here's what's got everyone talking:
✨ AI systems detecting diseases faster than ever
🏥 Hospitals worldwide embracing this technology  
💡 Game-changing innovations saving lives daily

With ${mockTrendDetail.totalMentions.toLocaleString()} mentions and climbing, this isn't just a trend - it's a revolution! 

What's your take on AI transforming healthcare? 👇

#Innovation #FutureOfMedicine #TechForGood`,

        news: `BREAKING: ${mockTrendDetail.hashtag} Gains Massive Traction

The healthcare AI revolution continues to dominate social media conversations, with mentions surging ${mockTrendDetail.growth}% in the past 24 hours.

KEY DEVELOPMENTS:
- Major medical institutions report successful AI implementation
- New diagnostic tools showing unprecedented accuracy rates
- Industry leaders calling for standardized AI ethics guidelines

The trend spans multiple platforms including ${mockTrendDetail.platforms.join(', ')}, indicating broad industry and public interest.

Current metrics: ${mockTrendDetail.totalMentions.toLocaleString()} total mentions, ${mockTrendDetail.sentiment} sentiment majority.`,

        casual: `Okay, can we talk about how INSANE the ${mockTrendDetail.hashtag} trend is right now? 🤯

Like, we're literally watching the future of healthcare unfold in real-time. AI is out here diagnosing diseases better than humans, and everyone's (rightfully) losing their minds about it.

The numbers are wild:
• ${mockTrendDetail.totalMentions.toLocaleString()} people talking about it
• Growing by ${mockTrendDetail.growth}% daily
• Trending across ${mockTrendDetail.platforms.length} major platforms

Honestly, this feels like one of those moments we'll look back on and be like "yep, that's when everything changed."

Anyone else following this? What do you think? 🤔`
      };

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

  const getLifecycleColor = (lifecycle: string) => {
    switch (lifecycle) {
      case 'emerging': return 'text-blue-500';
      case 'trending': return 'text-green-500';
      case 'peak': return 'text-orange-500';
      case 'declining': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getLifecycleIcon = (lifecycle: string) => {
    switch (lifecycle) {
      case 'emerging': return <TrendingUp className="w-4 h-4" />;
      case 'trending': return <Flame className="w-4 h-4" />;
      case 'peak': return <Award className="w-4 h-4" />;
      case 'declining': return <TrendingDown className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  if (!trendDetail) {
    return (
      <div className="min-h-screen gradient-dashboard p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-muted rounded"></div>
                <div className="h-96 bg-muted rounded"></div>
              </div>
              <div className="space-y-6">
                <div className="h-48 bg-muted rounded"></div>
                <div className="h-64 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-dashboard p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/dashboard')}
            className="p-0 h-auto font-normal"
          >
            Dashboard
          </Button>
          <span>/</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/trends')}
            className="p-0 h-auto font-normal"
          >
            Trends
          </Button>
          <span>/</span>
          <span className="text-foreground">{trendDetail.hashtag}</span>
        </div>

        {/* Trend Header */}
        <Card className="gradient-card border-border shadow-card">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate('/dashboard')}
                    className="p-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                    {trendDetail.hashtag}
                  </h1>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    #{trendDetail.ranking}
                  </Badge>
                </div>
                
                <p className="text-lg text-muted-foreground mb-4">{trendDetail.title}</p>
                <p className="text-muted-foreground mb-4">{trendDetail.description}</p>
                
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Popularity:</span>
                    <div className="flex items-center gap-2">
                      <Progress value={trendDetail.popularity} className="w-20" />
                      <span className="text-sm font-bold">{trendDetail.popularity}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Growth:</span>
                    <div className={`flex items-center gap-1 ${trendDetail.growth >= 0 ? 'text-sentiment-positive' : 'text-sentiment-negative'}`}>
                      {trendDetail.growth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span className="font-bold">{Math.abs(trendDetail.growth).toFixed(1)}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Lifecycle:</span>
                    <div className={`flex items-center gap-1 ${getLifecycleColor(trendDetail.lifecycle)}`}>
                      {getLifecycleIcon(trendDetail.lifecycle)}
                      <span className="font-medium capitalize">{trendDetail.lifecycle}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {trendDetail.platforms.map(platform => (
                    <Badge key={platform} variant="secondary">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleBookmark}>
                  {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                </Button>
                <Button variant="outline" onClick={handleShareTrend}>
                  <Share className="w-4 h-4" />
                </Button>
                <Button variant="outline" onClick={handleExportReport}>
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Content Generation */}
            <Card className="gradient-card border-border shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    AI Content Generation
                  </CardTitle>
                  <Button 
                    onClick={() => toggleSection('content')}
                    variant="ghost" 
                    size="sm"
                  >
                    {expandedSections.includes('content') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                </div>
              </CardHeader>
              {expandedSections.includes('content') && (
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <Select value={contentStyle} onValueChange={setContentStyle}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="summary">Summary</SelectItem>
                        <SelectItem value="engaging">Engaging</SelectItem>
                        <SelectItem value="news">News-style</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button 
                      onClick={handleGenerateAIContent}
                      disabled={isGenerating}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {isGenerating ? (
                        <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Sparkles className="w-4 h-4 mr-2" />
                      )}
                      {isGenerating ? 'Generating...' : 'Generate AI Post'}
                    </Button>
                  </div>
                  
                  {generatedContent && (
                    <div className="space-y-3">
                      <div className="bg-muted/20 p-4 rounded-lg">
                        <pre className="whitespace-pre-wrap text-sm font-mono">{generatedContent}</pre>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleCopyContent}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleGenerateAIContent}>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Regenerate
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          Save Draft
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Character count: {generatedContent.length} | Optimized for: {trendDetail.platforms.join(', ')}
                      </div>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>

            {/* Detailed Analytics */}
            <Card className="gradient-card border-border shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Detailed Analytics
                  </CardTitle>
                  <Button 
                    onClick={() => toggleSection('analytics')}
                    variant="ghost" 
                    size="sm"
                  >
                    {expandedSections.includes('analytics') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                </div>
              </CardHeader>
              {expandedSections.includes('analytics') && (
                <CardContent>
                  <Tabs defaultValue="evolution" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="evolution">Evolution</TabsTrigger>
                      <TabsTrigger value="geographic">Geographic</TabsTrigger>
                      <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
                      <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="evolution" className="mt-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">Trend Evolution Over Time</h4>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={trendEvolutionData}>
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
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="mentions" 
                              stroke="hsl(var(--primary))" 
                              strokeWidth={2}
                              name="Mentions"
                            />
                            <Line 
                              type="monotone" 
                              dataKey="engagement" 
                              stroke="hsl(var(--chart-secondary))" 
                              strokeWidth={2}
                              name="Engagement"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="geographic" className="mt-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">Geographic Distribution</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                              <Pie
                                data={geographicData}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="mentions"
                              >
                                {geographicData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${['primary', 'secondary', 'tertiary', 'quaternary'][index % 4]}))`} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="space-y-3">
                            {geographicData.map((region, index) => (
                              <div key={region.region} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-3 h-3 rounded-full" 
                                    style={{ backgroundColor: `hsl(var(--chart-${['primary', 'secondary', 'tertiary', 'quaternary'][index % 4]}))` }}
                                  ></div>
                                  <span className="text-sm">{region.region}</span>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-medium">{region.mentions.toLocaleString()}</div>
                                  <div className="text-xs text-muted-foreground">{region.percentage}%</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="heatmap" className="mt-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">Hourly Activity Heatmap</h4>
                        <div className="grid grid-cols-24 gap-1">
                          {hourlyHeatmapData.map((item, index) => (
                            <div
                              key={index}
                              className="aspect-square rounded-sm flex items-center justify-center text-xs"
                              style={{
                                backgroundColor: `hsl(var(--primary) / ${item.value / 60})`,
                                color: item.value > 30 ? 'white' : 'hsl(var(--foreground))'
                              }}
                              title={`${item.hour}:00 - ${item.value} mentions`}
                            >
                              {item.hour}
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>12 AM</span>
                          <span>6 AM</span>
                          <span>12 PM</span>
                          <span>6 PM</span>
                          <span>11 PM</span>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="sentiment" className="mt-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">Sentiment Analysis Timeline</h4>
                        <ResponsiveContainer width="100%" height={300}>
                          <AreaChart data={trendEvolutionData}>
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
                              dataKey="sentiment" 
                              stroke="hsl(var(--sentiment-positive))" 
                              fill="hsl(var(--sentiment-positive))" 
                              fillOpacity={0.3}
                              name="Sentiment Score"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              )}
            </Card>

            {/* Related Content Explorer */}
            <Card className="gradient-card border-border shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Related Content
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">Most Recent</SelectItem>
                        <SelectItem value="popular">Most Popular</SelectItem>
                        <SelectItem value="engagement">Highest Engagement</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                    >
                      {viewMode === 'list' ? <BarChart3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
                    {relatedPosts.map((post) => (
                      <div key={post.id} className="p-4 border rounded-lg hover:bg-muted/20 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-medium">{post.author.split(' ').map(n => n[0]).join('')}</span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{post.author}</span>
                                {post.verified && <CheckCircle className="w-3 h-3 text-blue-500" />}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Badge variant="outline" className="text-xs">{post.platform}</Badge>
                                <span>{post.timestamp}</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        <p className="text-sm mb-3 line-clamp-3">{post.content}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            <span>{post.engagement.likes.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Repeat className="w-3 h-3" />
                            <span>{post.engagement.shares.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            <span>{post.engagement.comments.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Mentions</span>
                  <span className="font-bold">{trendDetail.totalMentions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Peak Activity</span>
                  <span className="font-bold">{trendDetail.peakTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Sentiment</span>
                  <Badge variant={trendDetail.sentiment === 'positive' ? 'default' : trendDetail.sentiment === 'negative' ? 'destructive' : 'secondary'}>
                    {trendDetail.sentiment}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Predicted Direction</span>
                  <div className={`flex items-center gap-1 ${trendDetail.predictedDirection === 'up' ? 'text-sentiment-positive' : trendDetail.predictedDirection === 'down' ? 'text-sentiment-negative' : 'text-muted-foreground'}`}>
                    {trendDetail.predictedDirection === 'up' ? <TrendingUp className="w-4 h-4" /> : 
                     trendDetail.predictedDirection === 'down' ? <TrendingDown className="w-4 h-4" /> : 
                     <Activity className="w-4 h-4" />}
                    <span className="capitalize font-medium">{trendDetail.predictedDirection}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Influencers */}
            <Card className="gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Top Influencers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topInfluencers.map((influencer) => (
                    <div key={influencer.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium">{influencer.avatar}</span>
                        </div>
                        <div>
                          <div className="font-medium text-sm">{influencer.name}</div>
                          <div className="text-xs text-muted-foreground">{influencer.handle}</div>
                          <div className="text-xs text-muted-foreground">
                            {influencer.followers.toLocaleString()} followers
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{influencer.posts}</div>
                        <div className="text-xs text-muted-foreground">posts</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Related Hashtags */}
            <Card className="gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Hash className="w-5 h-5" />
                  Related Hashtags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {relatedHashtags.map((hashtag) => (
                    <Badge key={hashtag} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      {hashtag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Similar Past Trends */}
            <Card className="gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Similar Past Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {similarTrends.map((trend) => (
                    <div key={trend.name} className="flex items-center justify-between p-2 hover:bg-muted/20 rounded cursor-pointer">
                      <div>
                        <div className="font-medium text-sm">{trend.name}</div>
                        <div className="text-xs text-muted-foreground">{trend.period}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{trend.similarity}%</div>
                        <div className="text-xs text-muted-foreground">similarity</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="w-4 h-4 mr-2" />
                  Set Alert
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Code className="w-4 h-4 mr-2" />
                  Embed Widget
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Target className="w-4 h-4 mr-2" />
                  Compare Trends
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendDetails;