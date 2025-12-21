import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { 
  Send, 
  Calendar as CalendarIcon, 
  Clock, 
  Save, 
  Eye, 
  Wand2, 
  Hash, 
  Smile, 
  Image, 
  Link, 
  BarChart3, 
  Target, 
  Lightbulb, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw,
  Upload,
  X,
  Plus,
  Smartphone,
  Monitor,
  Globe,
  TrendingUp,
  Users
} from 'lucide-react';

interface Platform {
  id: string;
  name: string;
  charLimit: number;
  color: string;
  icon: string;
  supportsPoll: boolean;
  supportsImages: boolean;
  supportsVideo: boolean;
}

const platforms: Platform[] = [
  { 
    id: 'twitter', 
    name: 'Twitter', 
    charLimit: 280, 
    color: 'text-blue-400', 
    icon: '𝕏',
    supportsPoll: true,
    supportsImages: true,
    supportsVideo: true
  },
  { 
    id: 'reddit', 
    name: 'Reddit', 
    charLimit: 40000, 
    color: 'text-orange-500', 
    icon: '🔴',
    supportsPoll: true,
    supportsImages: true,
    supportsVideo: true
  },
  { 
    id: 'linkedin', 
    name: 'LinkedIn', 
    charLimit: 3000, 
    color: 'text-blue-600', 
    icon: '💼',
    supportsPoll: true,
    supportsImages: true,
    supportsVideo: true
  },
  { 
    id: 'instagram', 
    name: 'Instagram', 
    charLimit: 2200, 
    color: 'text-pink-500', 
    icon: '📷',
    supportsPoll: false,
    supportsImages: true,
    supportsVideo: true
  }
];

const contentStyles = [
  'Professional/Business',
  'Casual/Friendly', 
  'News/Informative',
  'Engaging/Creative',
  'Summary/Analytical'
];

const targetAudiences = [
  'General Public',
  'Business Professionals',
  'Tech Community',
  'Lifestyle Enthusiasts',
  'Students & Educators'
];

const trendingTopics = [
  'AI in Healthcare',
  'Sustainable Technology',
  'Remote Work Trends',
  'Digital Marketing Evolution',
  'Climate Change Solutions',
  'Blockchain Innovation'
];


import api from "@/lib/api";

const PostCreation = () => {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['twitter']);
  const [contentStyle, setContentStyle] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [tone, setTone] = useState([50]);
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [scheduledTime, setScheduledTime] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [isGenerating, setIsGenerating] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
  const [showPoll, setShowPoll] = useState(false);
  const [addedLinks, setAddedLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState('');
  const { toast } = useToast();

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && content.trim()) {
      const timer = setTimeout(() => {
        localStorage.setItem('post_draft', JSON.stringify({
          content,
          selectedPlatforms,
          contentStyle,
          targetAudience,
          tone,
          scheduledDate,
          scheduledTime,
          isScheduled
        }));
        toast({
          title: "Draft saved",
          description: "Your post has been automatically saved.",
        });
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [content, selectedPlatforms, contentStyle, targetAudience, tone, scheduledDate, scheduledTime, isScheduled, autoSave]);

  // Load draft on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('post_draft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setContent(draft.content || '');
        setSelectedPlatforms(draft.selectedPlatforms || ['twitter']);
        setContentStyle(draft.contentStyle || '');
        setTargetAudience(draft.targetAudience || '');
        setTone(draft.tone || [50]);
        if (draft.scheduledDate) setScheduledDate(new Date(draft.scheduledDate));
        setScheduledTime(draft.scheduledTime || '');
        setIsScheduled(draft.isScheduled || false);
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);

  const generateAIContent = async () => {
    setIsGenerating(true);
    try {
      const payload = {
        topic: trendingTopics[Math.floor(Math.random() * trendingTopics.length)], // ideally user selects this
        platforms: selectedPlatforms,
        tone: tone[0] > 60 ? 'casual' : tone[0] < 40 ? 'professional' : 'balanced',
        style: contentStyle,
        audience: targetAudience || 'general'
      };

      const response = await api.post('/posts/generate', payload);
      
      // Assuming the backend returns { content: "..." }
      // If the backend returns a different structure, this will need adjustment.
      // Fallback for demo purposes if backend response is empty or structure differs slightly in dev
      const generatedText = response.data.content || response.data; 

      if (typeof generatedText === 'string') {
          setContent(generatedText);
      } else {
          console.error("Unexpected API response format", response.data);
          throw new Error("Invalid response format");
      }

      toast({
        title: "Content generated successfully!",
        description: "AI has created optimized content based on your preferences.",
      });
    } catch (error) {
      console.error("AI Generation error:", error);
      toast({
        title: "Generation failed",
        description: "Could not generate content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
    toast({
      title: "Files uploaded",
      description: `${files.length} file(s) added to your post`,
    });
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const addPollOption = () => {
    setPollOptions(prev => [...prev, '']);
  };

  const updatePollOption = (index: number, value: string) => {
    setPollOptions(prev => prev.map((option, i) => i === index ? value : option));
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(prev => prev.filter((_, i) => i !== index));
    }
  };

  const addLink = () => {
    if (newLink.trim()) {
      setAddedLinks(prev => [...prev, newLink.trim()]);
      setNewLink('');
      toast({
        title: "Link added",
        description: "Link preview will be generated automatically",
      });
    }
  };

  const removeLink = (index: number) => {
    setAddedLinks(prev => prev.filter((_, i) => i !== index));
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
    const positiveWords = ['exciting', 'amazing', 'great', 'awesome', 'excellent', 'wonderful', 'revolutionary', 'fascinating'];
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'disappointing', 'failed'];
    
    const words = content.toLowerCase().split(/\s+/);
    const positive = words.filter(word => positiveWords.some(pw => word.includes(pw))).length;
    const negative = words.filter(word => negativeWords.some(nw => word.includes(nw))).length;
    
    if (positive > negative) return { label: 'Positive', emoji: '😊', score: 85, color: 'text-green-500' };
    if (negative > positive) return { label: 'Negative', emoji: '😔', score: 30, color: 'text-red-500' };
    return { label: 'Neutral', emoji: '😐', score: 65, color: 'text-yellow-500' };
  };

  const getEngagementPrediction = () => {
    const hasHashtags = content.includes('#');
    const hasEmojis = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(content);
    const hasQuestion = content.includes('?');
    const wordCount = content.split(/\s+/).length;
    const hasMedia = attachments.length > 0;
    
    let score = 40;
    if (hasHashtags) score += 15;
    if (hasEmojis) score += 10;
    if (hasQuestion) score += 15;
    if (hasMedia) score += 20;
    if (wordCount > 10 && wordCount < 50) score += 10;
    
    return Math.min(score, 95);
  };

  const publishPost = async () => {
    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please add some content before publishing",
        variant: "destructive"
      });
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast({
        title: "Platform required", 
        description: "Please select at least one platform",
        variant: "destructive"
      });
      return;
    }

    try {
      const payload = {
          content,
          platforms: selectedPlatforms,
          scheduledAt: isScheduled && scheduledDate ? scheduledDate.toISOString() : null,
          scheduledTime: isScheduled ? scheduledTime : null,
          attachments: attachments.map(f => f.name), // In a real app, we'd upload these first and send IDs/URLs
          pollOptions: showPoll ? pollOptions.filter(o => o.trim()) : [],
          links: addedLinks
      };

      await api.post('/posts/submit', payload);
      
      if (isScheduled && scheduledDate) {
        toast({
          title: "Post scheduled successfully!",
          description: `Your post will be published on ${format(scheduledDate, 'PPP')} at ${scheduledTime}`,
        });
      } else {
        toast({
          title: "Post published successfully!",
          description: `Published to ${selectedPlatforms.join(', ')}`,
        });
      }
      
      // Clear form
      setContent('');
      setAttachments([]);
      setPollOptions(['', '']);
      setAddedLinks([]);
      localStorage.removeItem('post_draft');
      
    } catch (error) {
      console.error("Publishing error:", error);
      toast({
        title: "Publishing failed",
        description: "Could not publish post. Please try again.",
        variant: "destructive"
      });
    }
  };

  const saveDraft = () => {
    const draft = {
      content,
      selectedPlatforms,
      contentStyle,
      targetAudience,
      tone,
      scheduledDate,
      scheduledTime,
      isScheduled,
      attachments: attachments.map(f => f.name),
      pollOptions,
      addedLinks
    };
    
    localStorage.setItem('post_draft', JSON.stringify(draft));
    toast({
      title: "Draft saved",
      description: "Your post has been saved to drafts",
    });
  };

  const sentiment = getSentimentAnalysis();
  const engagementScore = getEngagementPrediction();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create New Post</h1>
          <p className="text-muted-foreground">Compose and schedule your social media posts</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch
              checked={autoSave}
              onCheckedChange={setAutoSave}
            />
            <span className="text-sm">Auto-save</span>
          </div>
          <Button variant="outline" onClick={saveDraft}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Composition - Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Post Composition */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Post Composition
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  placeholder="What's happening? Share your thoughts..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[150px] resize-none text-base"
                />
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>{content.length} characters</span>
                  <div className="flex gap-4">
                    {selectedPlatforms.map(platformId => {
                      const charCount = getCharacterCount(platformId);
                      const platform = platforms.find(p => p.id === platformId);
                      return (
                        <span key={platformId} className={cn(
                          platform?.color,
                          charCount.percentage > 90 && 'text-destructive font-medium'
                        )}>
                          {platform?.name}: {charCount.current}/{charCount.limit}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Content Enhancement Tools */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setContent(content + '#')}
                >
                  <Hash className="h-4 w-4 mr-1" />
                  Hashtag
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setContent(content + '😊')}
                >
                  <Smile className="h-4 w-4 mr-1" />
                  Emoji
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Image className="h-4 w-4 mr-1" />
                  Media
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPoll(!showPoll)}
                  disabled={!selectedPlatforms.some(id => platforms.find(p => p.id === id)?.supportsPoll)}
                >
                  <BarChart3 className="h-4 w-4 mr-1" />
                  Poll
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Media Attachments */}
              {attachments.length > 0 && (
                <div className="space-y-2">
                  <Label>Media Attachments ({attachments.length})</Label>
                  <div className="flex flex-wrap gap-2">
                    {attachments.map((file, index) => (
                      <Badge key={index} variant="secondary" className="gap-2">
                        <span className="truncate max-w-[100px]">{file.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0"
                          onClick={() => removeAttachment(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Poll Creation */}
              {showPoll && (
                <div className="space-y-3 p-4 border rounded-lg">
                  <Label>Create Poll</Label>
                  {pollOptions.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => updatePollOption(index, e.target.value)}
                      />
                      {pollOptions.length > 2 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePollOption(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {pollOptions.length < 4 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addPollOption}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Option
                    </Button>
                  )}
                </div>
              )}

              {/* Link Previews */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a link..."
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addLink()}
                  />
                  <Button onClick={addLink} disabled={!newLink.trim()}>
                    <Link className="h-4 w-4" />
                  </Button>
                </div>
                {addedLinks.length > 0 && (
                  <div className="space-y-2">
                    {addedLinks.map((link, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                        <Link className="h-4 w-4 text-muted-foreground" />
                        <span className="flex-1 text-sm truncate">{link}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLink(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* AI Generation Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5" />
                AI Content Enhancement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block">Content Style</Label>
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
                  <Label className="mb-2 block">Target Audience</Label>
                  <Select value={targetAudience} onValueChange={setTargetAudience}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      {targetAudiences.map(audience => (
                        <SelectItem key={audience} value={audience}>{audience}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="mb-2 block">
                  Tone: {tone[0] < 30 ? 'Very Formal' : tone[0] < 70 ? 'Balanced' : 'Very Casual'}
                </Label>
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

          {/* Platform Selection & Scheduling */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Platform & Scheduling
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Platform Selection */}
              <div className="space-y-3">
                <Label>Select Platforms</Label>
                <div className="grid grid-cols-2 gap-3">
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
                      <label htmlFor={platform.id} className={`text-sm flex items-center gap-2 ${platform.color}`}>
                        <span>{platform.icon}</span>
                        {platform.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Scheduling Options */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="schedule-toggle"
                    checked={isScheduled}
                    onCheckedChange={setIsScheduled}
                  />
                  <Label htmlFor="schedule-toggle">Schedule for later</Label>
                </div>

                {isScheduled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="mb-2 block">Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "justify-start text-left font-normal w-full",
                              !scheduledDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {scheduledDate ? format(scheduledDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={scheduledDate}
                            onSelect={setScheduledDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label className="mb-2 block">Time</Label>
                      <Input
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Publishing Actions */}
          <div className="flex gap-3">
            <Button 
              onClick={publishPost}
              className="flex-1"
              disabled={!content.trim() || selectedPlatforms.length === 0}
            >
              <Send className="h-4 w-4 mr-2" />
              {isScheduled ? 'Schedule Post' : 'Publish Now'}
            </Button>
            <Button variant="outline" onClick={() => setPreviewMode(previewMode === 'mobile' ? 'desktop' : 'mobile')}>
              {previewMode === 'mobile' ? <Monitor className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Sidebar - Analytics & Preview */}
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
                <div className="flex justify-between items-center">
                  <span className="text-sm">Sentiment Analysis</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{sentiment.emoji}</span>
                    <Badge variant="secondary" className={sentiment.color}>
                      {sentiment.label}
                    </Badge>
                  </div>
                </div>
                <Progress value={sentiment.score} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Engagement Prediction</span>
                  <span className="text-sm font-medium">{engagementScore}%</span>
                </div>
                <Progress value={engagementScore} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Readability Score</span>
                  <Badge variant="outline">Good</Badge>
                </div>
                <Progress value={78} className="h-2" />
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium">Hashtag Analysis</span>
                <div className="text-xs text-muted-foreground">
                  {content.match(/#\w+/g)?.length || 0} hashtags detected
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Platform Previews */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Live Preview
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant={previewMode === 'mobile' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setPreviewMode('mobile')}
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={previewMode === 'desktop' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setPreviewMode('desktop')}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={selectedPlatforms[0]} className="w-full">
                <TabsList className="grid grid-cols-4 w-full">
                  {platforms.map(platform => (
                    <TabsTrigger
                      key={platform.id}
                      value={platform.id}
                      disabled={!selectedPlatforms.includes(platform.id)}
                      className="text-xs"
                    >
                      {platform.icon}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {platforms.map(platform => (
                  <TabsContent key={platform.id} value={platform.id}>
                    <div className={cn(
                      "space-y-3 p-4 border rounded-lg bg-background",
                      previewMode === 'mobile' ? 'max-w-sm' : 'w-full'
                    )}>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center">
                          <span className="text-xs font-medium text-primary-foreground">DA</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Demo Analyst</div>
                          <div className="text-xs text-muted-foreground">@demo_analyst</div>
                        </div>
                      </div>
                      <div className="text-sm whitespace-pre-wrap">
                        {content || 'Your post content will appear here...'}
                      </div>
                      {attachments.length > 0 && (
                        <div className="grid grid-cols-2 gap-2">
                          {attachments.slice(0, 4).map((file, index) => (
                            <div key={index} className="aspect-square bg-muted rounded flex items-center justify-center">
                              <Image className="h-6 w-6 text-muted-foreground" />
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-muted-foreground text-xs">
                        <span>❤️ 0</span>
                        <span>🔄 0</span>
                        <span>💬 0</span>
                        <span>📤</span>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* Optimal Timing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Optimal Timing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <div className="font-medium mb-2">Best times to post:</div>
                <div className="space-y-1 text-muted-foreground text-xs">
                  <div className="flex justify-between">
                    <span>Twitter:</span>
                    <span>9-10 AM, 7-9 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>LinkedIn:</span>
                    <span>8-9 AM, 12 PM, 5-6 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Instagram:</span>
                    <span>11 AM-1 PM, 7-9 PM</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Full Analytics
              </Button>
            </CardContent>
          </Card>

          {/* Trending Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Trending Now
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {trendingTopics.slice(0, 4).map((topic, index) => (
                <Button
                  key={topic}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-auto p-2"
                  onClick={() => setContent(content + ` #${topic.replace(/\s+/g, '')}`)}
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <span className="text-sm truncate">{topic}</span>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PostCreation;