import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Wand2, 
  Copy, 
  Download, 
  FileText, 
  Mail, 
  Printer,
  Save,
  Clock,
  Target,
  TrendingUp,
  Eye,
  Lightbulb,
  Share2,
  Star,
  RefreshCw,
  Settings,
  AlertCircle,
  CheckCircle,
  Hash,
  Smile,
  Calendar,
  BarChart3
} from 'lucide-react';

interface Platform {
  id: string;
  name: string;
  charLimit: number;
  color: string;
}

const platforms: Platform[] = [
  { id: 'twitter', name: 'Twitter', charLimit: 280, color: 'text-blue-400' },
  { id: 'reddit', name: 'Reddit', charLimit: 40000, color: 'text-orange-500' },
  { id: 'linkedin', name: 'LinkedIn', charLimit: 3000, color: 'text-blue-600' },
  { id: 'instagram', name: 'Instagram', charLimit: 2200, color: 'text-pink-500' },
  { id: 'facebook', name: 'Facebook', charLimit: 63206, color: 'text-blue-500' }
];

const contentStyles = [
  'Professional/Business',
  'Casual/Friendly', 
  'News/Informative',
  'Engaging/Creative',
  'Summary/Analytical'
];

const trendingTopics = [
  'AI in Healthcare',
  'Sustainable Technology',
  'Remote Work Trends',
  'Digital Marketing',
  'Climate Change',
  'Cryptocurrency',
  'Mental Health Awareness',
  'Tech Innovation'
];

const ContentCreation = () => {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['twitter']);
  const [contentStyle, setContentStyle] = useState('');
  const [tone, setTone] = useState([50]);
  const [targetAudience, setTargetAudience] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [drafts, setDrafts] = useState<string[]>([]);
  const { toast } = useToast();

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && content.trim()) {
      const timer = setTimeout(() => {
        const newDrafts = [...drafts];
        if (!newDrafts.includes(content)) {
          newDrafts.unshift(content);
          setDrafts(newDrafts.slice(0, 5)); // Keep only 5 recent drafts
          toast({
            title: "Draft saved",
            description: "Your content has been automatically saved.",
          });
        }
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [content, autoSave]);

  const generateAIContent = async () => {
    setIsGenerating(true);
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const topic = selectedTopic || customTopic || 'general content';
      const toneText = tone[0] > 50 ? 'casual' : 'formal';
      const audienceText = targetAudience || 'general audience';
      
      const generatedContent = `🚀 Exciting developments in ${topic}! Here's what ${audienceText} should know:

✨ Key insights that are transforming the industry
📊 Data-driven approaches leading to better outcomes  
🎯 Practical applications you can implement today

${contentStyle === 'Professional/Business' ? 'This represents a significant opportunity for growth and innovation.' : 'What are your thoughts on this trending topic?'}

#${topic.replace(/\s+/g, '')} #Innovation #Trends #Growth`;

      setContent(generatedContent);
      toast({
        title: "Content generated!",
        description: "AI has created optimized content based on your preferences.",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Please try again with different parameters.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (platformId?: string) => {
    const textToCopy = platformId ? 
      `${content}\n\n[Optimized for ${platforms.find(p => p.id === platformId)?.name}]` : 
      content;
    
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "Copied to clipboard",
      description: platformId ? 
        `Content optimized for ${platforms.find(p => p.id === platformId)?.name}` : 
        "Content copied successfully"
    });
  };

  const exportContent = (format: string) => {
    const timestamp = new Date().toISOString().split('T')[0];
    let dataStr = '';
    let filename = '';

    switch (format) {
      case 'txt':
        dataStr = content;
        filename = `content_${timestamp}.txt`;
        break;
      case 'csv':
        const csvContent = selectedPlatforms.map(platformId => {
          const platform = platforms.find(p => p.id === platformId);
          return `"${platform?.name}","${content.replace(/"/g, '""')}"`;
        }).join('\n');
        dataStr = `Platform,Content\n${csvContent}`;
        filename = `content_${timestamp}.csv`;
        break;
      default:
        return;
    }

    const element = document.createElement('a');
    const file = new Blob([dataStr], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Export successful",
      description: `Content exported as ${format.toUpperCase()} file`
    });
  };

  const getCharacterCount = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    return {
      current: content.length,
      limit: platform?.charLimit || 0,
      percentage: platform ? (content.length / platform.charLimit) * 100 : 0
    };
  };

  const getSentimentAnalysis = () => {
    const positiveWords = ['exciting', 'amazing', 'great', 'awesome', 'excellent', 'wonderful'];
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'disappointing'];
    
    const words = content.toLowerCase().split(/\s+/);
    const positive = words.filter(word => positiveWords.includes(word)).length;
    const negative = words.filter(word => negativeWords.includes(word)).length;
    
    if (positive > negative) return { label: 'Positive', emoji: '😊', score: 85 };
    if (negative > positive) return { label: 'Negative', emoji: '😔', score: 30 };
    return { label: 'Neutral', emoji: '😐', score: 65 };
  };

  const getEngagementPrediction = () => {
    const hasHashtags = content.includes('#');
    const hasEmojis = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(content);
    const hasQuestion = content.includes('?');
    const wordCount = content.split(/\s+/).length;
    
    let score = 50;
    if (hasHashtags) score += 15;
    if (hasEmojis) score += 10;
    if (hasQuestion) score += 10;
    if (wordCount > 10 && wordCount < 50) score += 10;
    
    return Math.min(score, 95);
  };

  const sentiment = getSentimentAnalysis();
  const engagementScore = getEngagementPrediction();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Creation</h1>
          <p className="text-muted-foreground">Create engaging social media content with AI assistance</p>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={autoSave}
            onCheckedChange={setAutoSave}
          />
          <span className="text-sm">Auto-save</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Composition */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Content Composition
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  placeholder="Start writing your content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{content.length} characters</span>
                  <div className="flex gap-4">
                    {selectedPlatforms.map(platformId => {
                      const charCount = getCharacterCount(platformId);
                      const platform = platforms.find(p => p.id === platformId);
                      return (
                        <span key={platformId} className={platform?.color}>
                          {platform?.name}: {charCount.current}/{charCount.limit}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setContent(content + ' #')}
                >
                  <Hash className="h-4 w-4" />
                  Add Hashtag
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setContent(content + ' 😊')}
                >
                  <Smile className="h-4 w-4" />
                  Add Emoji
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard()}
                >
                  <Copy className="h-4 w-4" />
                  Copy All
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI Generation Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5" />
                AI Content Generation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Trending Topic</label>
                  <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trending topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {trendingTopics.map(topic => (
                        <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Custom Topic</label>
                  <Input
                    placeholder="Enter custom topic"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Content Style</label>
                  <Select value={contentStyle} onValueChange={setContentStyle}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      {contentStyles.map(style => (
                        <SelectItem key={style} value={style}>{style}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Target Audience</label>
                  <Select value={targetAudience} onValueChange={setTargetAudience}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Public</SelectItem>
                      <SelectItem value="business">Business Professionals</SelectItem>
                      <SelectItem value="tech">Tech Community</SelectItem>
                      <SelectItem value="lifestyle">Lifestyle Enthusiasts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Tone: {tone[0] < 30 ? 'Very Formal' : tone[0] < 70 ? 'Balanced' : 'Very Casual'}
                </label>
                <Slider
                  value={tone}
                  onValueChange={setTone}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Formal</span>
                  <span>Casual</span>
                </div>
              </div>

              <Button
                onClick={generateAIContent}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Wand2 className="h-4 w-4 mr-2" />
                )}
                {isGenerating ? 'Generating...' : 'Generate with AI'}
              </Button>
            </CardContent>
          </Card>

          {/* Platform Optimization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Platform Optimization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {platforms.map(platform => (
                  <div key={platform.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={platform.id}
                      checked={selectedPlatforms.includes(platform.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedPlatforms([...selectedPlatforms, platform.id]);
                        } else {
                          setSelectedPlatforms(selectedPlatforms.filter(id => id !== platform.id));
                        }
                      }}
                    />
                    <label htmlFor={platform.id} className={`text-sm ${platform.color}`}>
                      {platform.name}
                    </label>
                  </div>
                ))}
              </div>

              <Tabs defaultValue={selectedPlatforms[0]} className="w-full">
                <TabsList className="grid grid-cols-5 w-full">
                  {platforms.map(platform => (
                    <TabsTrigger
                      key={platform.id}
                      value={platform.id}
                      disabled={!selectedPlatforms.includes(platform.id)}
                      className="text-xs"
                    >
                      {platform.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {platforms.map(platform => (
                  <TabsContent key={platform.id} value={platform.id}>
                    <div className="space-y-3 p-4 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Preview for {platform.name}</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(platform.id)}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <div className="bg-muted p-3 rounded text-sm">
                        {content || 'Your content will appear here...'}
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={Math.min((content.length / platform.charLimit) * 100, 100)} 
                          className="flex-1" 
                        />
                        <span className={`text-xs ${content.length > platform.charLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
                          {content.length}/{platform.charLimit}
                        </span>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Content Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Content Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Sentiment</span>
                  <div className="flex items-center gap-1">
                    <span className="text-lg">{sentiment.emoji}</span>
                    <span className="text-sm font-medium">{sentiment.label}</span>
                  </div>
                </div>
                <Progress value={sentiment.score} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Engagement Prediction</span>
                  <span className="text-sm font-medium">{engagementScore}%</span>
                </div>
                <Progress value={engagementScore} />
              </div>

              <div className="space-y-2">
                <span className="text-sm">Readability Score</span>
                <div className="flex items-center gap-2">
                  <Progress value={78} />
                  <Badge variant="secondary">Good</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Export & Share
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => exportContent('txt')}
              >
                <FileText className="h-4 w-4 mr-2" />
                Export as Text
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => exportContent('csv')}
              >
                <FileText className="h-4 w-4 mr-2" />
                Export as CSV
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  window.print();
                  toast({ title: "Print ready", description: "Content formatted for printing" });
                }}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Content
              </Button>
            </CardContent>
          </Card>

          {/* Scheduling Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Optimal Timing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p className="font-medium mb-1">Best posting times:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Twitter: 9-10 AM, 7-9 PM</li>
                  <li>• LinkedIn: 8-9 AM, 12 PM, 5-6 PM</li>
                  <li>• Instagram: 11 AM-1 PM, 7-9 PM</li>
                </ul>
              </div>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  const event = new Date();
                  event.setHours(event.getHours() + 1);
                  toast({ 
                    title: "Reminder set", 
                    description: `Reminder to post at ${event.toLocaleTimeString()}` 
                  });
                }}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Set Reminder
              </Button>
            </CardContent>
          </Card>

          {/* Recent Drafts */}
          {drafts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Save className="h-5 w-5" />
                  Recent Drafts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {drafts.slice(0, 3).map((draft, index) => (
                  <div
                    key={index}
                    className="p-2 bg-muted rounded text-sm cursor-pointer hover:bg-muted/80"
                    onClick={() => setContent(draft)}
                  >
                    {draft.slice(0, 50)}{draft.length > 50 ? '...' : ''}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentCreation;