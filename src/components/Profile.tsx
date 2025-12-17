import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Camera, 
  Edit3, 
  Save, 
  Share2, 
  Download, 
  Eye, 
  MapPin, 
  Calendar, 
  Mail, 
  Phone, 
  Globe, 
  Briefcase,
  TrendingUp,
  Sparkles,
  Bookmark,
  Activity,
  BarChart3,
  Users,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Star,
  Award,
  Target,
  Zap
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: 'trend_analyzed' | 'post_generated' | 'bookmark_added' | 'profile_updated';
  title: string;
  description: string;
  timestamp: string;
  icon: any;
}

const Profile = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "Demo Analyst",
    username: "demo_analyst",
    email: "demo@analytics.com",
    phone: "+1 (555) 123-4567",
    bio: "Social media trend analyst passionate about data-driven insights and AI-powered content creation.",
    location: "San Francisco, CA",
    timezone: "America/Los_Angeles",
    title: "Senior Trend Analyst",
    department: "Analytics Team",
    socialLinks: {
      twitter: "@demo_analyst",
      linkedin: "linkedin.com/in/demo-analyst",
      website: "demoanalyst.com"
    }
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [preferences, setPreferences] = useState({
    topics: ['Technology', 'Healthcare', 'Marketing'],
    platforms: ['Twitter', 'Reddit', 'LinkedIn'],
    contentStyle: 'Professional',
    defaultView: 'Dashboard'
  });

  const profileStats = {
    trendsAnalyzed: 1247,
    postsGenerated: 89,
    bookmarkedTrends: 156,
    profileViews: 342,
    completionPercentage: 85,
    memberSince: "January 2024"
  };

  const recentActivities: ActivityItem[] = [
    {
      id: '1',
      type: 'trend_analyzed',
      title: 'Analyzed trending topic',
      description: '#AIRevolution - Generated insights and content recommendations',
      timestamp: '2 hours ago',
      icon: TrendingUp
    },
    {
      id: '2',
      type: 'post_generated',
      title: 'AI content generated',
      description: 'Created engaging post for #ClimateAction trend',
      timestamp: '4 hours ago',
      icon: Sparkles
    },
    {
      id: '3',
      type: 'bookmark_added',
      title: 'Bookmarked trend',
      description: '#HealthTech saved to favorites for future analysis',
      timestamp: '1 day ago',
      icon: Bookmark
    },
    {
      id: '4',
      type: 'profile_updated',
      title: 'Profile updated',
      description: 'Updated bio and professional information',
      timestamp: '2 days ago',
      icon: User
    }
  ];

  const availableTopics = [
    'Technology', 'Healthcare', 'Marketing', 'Finance', 'Education', 
    'Entertainment', 'Sports', 'Politics', 'Environment', 'Business'
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
        toast({
          title: "Profile picture updated",
          description: "Your new profile picture has been uploaded successfully.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile saved",
      description: "Your profile information has been updated successfully.",
    });
  };

  const handleShareProfile = () => {
    const profileUrl = `${window.location.origin}/profile/${profileData.username}`;
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Profile link copied",
      description: "Your profile sharing link has been copied to clipboard.",
    });
  };

  const handleExportProfile = () => {
    const profileExport = {
      ...profileData,
      stats: profileStats,
      preferences,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(profileExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `profile_${profileData.username}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    toast({
      title: "Profile exported",
      description: "Your profile data has been downloaded as JSON file.",
    });
  };

  const updatePreference = (key: string, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Preference updated",
      description: "Your preference has been saved automatically.",
    });
  };

  return (
    <div className="min-h-screen gradient-dashboard p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              User Profile
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your profile information and preferences
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleShareProfile}>
              <Share2 className="w-4 h-4 mr-2" />
              Share Profile
            </Button>
            <Button variant="outline" onClick={handleExportProfile}>
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Header Card */}
          <div className="lg:col-span-2">
            <Card className="gradient-card border-border shadow-card">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  {/* Avatar Section */}
                  <div className="relative">
                    <Avatar className="w-32 h-32">
                      {profileImage ? (
                        <AvatarImage src={profileImage} alt="Profile" />
                      ) : (
                        <AvatarFallback className="gradient-primary text-primary-foreground text-2xl">
                          {profileData.fullName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <Button
                      size="sm"
                      className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        {isEditing ? (
                          <Input
                            value={profileData.fullName}
                            onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                            className="text-2xl font-bold mb-2"
                          />
                        ) : (
                          <h2 className="text-2xl font-bold">{profileData.fullName}</h2>
                        )}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-muted-foreground">@{profileData.username}</span>
                          <Badge variant="secondary">{profileData.title}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {profileData.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Member since {profileStats.memberSince}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant={isEditing ? "default" : "outline"}
                        onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                      >
                        {isEditing ? (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        ) : (
                          <>
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit Profile
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Bio */}
                    <div>
                      {isEditing ? (
                        <div className="space-y-2">
                          <Label>Bio</Label>
                          <Textarea
                            value={profileData.bio}
                            onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                            maxLength={250}
                            className="resize-none"
                          />
                          <div className="text-xs text-muted-foreground text-right">
                            {profileData.bio.length}/250 characters
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">{profileData.bio}</p>
                      )}
                    </div>

                    {/* Profile Completion */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm">Profile Completion</Label>
                        <span className="text-sm font-medium">{profileStats.completionPercentage}%</span>
                      </div>
                      <Progress value={profileStats.completionPercentage} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="gradient-card border-border shadow-card mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        />
                      ) : (
                        <span>{profileData.email}</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        />
                      ) : (
                        <span>{profileData.phone}</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Professional Title</Label>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      {isEditing ? (
                        <Input
                          id="title"
                          value={profileData.title}
                          onChange={(e) => setProfileData({...profileData, title: e.target.value})}
                        />
                      ) : (
                        <span>{profileData.title}</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    {isEditing ? (
                      <Select value={profileData.timezone} onValueChange={(value) => setProfileData({...profileData, timezone: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                          <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                          <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                          <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                          <SelectItem value="Europe/Paris">Central European Time (CET)</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span>{profileData.timezone.replace('_', ' ')}</span>
                    )}
                  </div>
                </div>

                {/* Social Links */}
                {isEditing && (
                  <div className="space-y-4">
                    <Label>Social Media Links</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs">Twitter</Label>
                        <Input
                          placeholder="@username"
                          value={profileData.socialLinks.twitter}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            socialLinks: {...profileData.socialLinks, twitter: e.target.value}
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">LinkedIn</Label>
                        <Input
                          placeholder="linkedin.com/in/username"
                          value={profileData.socialLinks.linkedin}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            socialLinks: {...profileData.socialLinks, linkedin: e.target.value}
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Website</Label>
                        <Input
                          placeholder="yourwebsite.com"
                          value={profileData.socialLinks.website}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            socialLinks: {...profileData.socialLinks, website: e.target.value}
                          })}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Preferences Panel */}
            <Card className="gradient-card border-border shadow-card mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Analysis Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="mb-3 block">Preferred Analysis Topics</Label>
                    <div className="flex flex-wrap gap-2">
                      {availableTopics.map(topic => (
                        <Badge
                          key={topic}
                          variant={preferences.topics.includes(topic) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            const newTopics = preferences.topics.includes(topic)
                              ? preferences.topics.filter(t => t !== topic)
                              : [...preferences.topics, topic];
                            updatePreference('topics', newTopics);
                          }}
                        >
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Default Content Style</Label>
                      <Select 
                        value={preferences.contentStyle} 
                        onValueChange={(value) => updatePreference('contentStyle', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Professional">Professional</SelectItem>
                          <SelectItem value="Casual">Casual</SelectItem>
                          <SelectItem value="Creative">Creative</SelectItem>
                          <SelectItem value="Analytical">Analytical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Default Dashboard View</Label>
                      <Select 
                        value={preferences.defaultView} 
                        onValueChange={(value) => updatePreference('defaultView', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Dashboard">Dashboard Overview</SelectItem>
                          <SelectItem value="Trends">Trending Topics</SelectItem>
                          <SelectItem value="Analytics">Analytics View</SelectItem>
                          <SelectItem value="Content">Content Creation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Activity Summary */}
            <Card className="gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Activity Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/20 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{profileStats.trendsAnalyzed}</div>
                    <div className="text-xs text-muted-foreground">Trends Analyzed</div>
                  </div>
                  <div className="text-center p-3 bg-muted/20 rounded-lg">
                    <div className="text-2xl font-bold text-chart-secondary">{profileStats.postsGenerated}</div>
                    <div className="text-xs text-muted-foreground">AI Posts Generated</div>
                  </div>
                  <div className="text-center p-3 bg-muted/20 rounded-lg">
                    <div className="text-2xl font-bold text-chart-tertiary">{profileStats.bookmarkedTrends}</div>
                    <div className="text-xs text-muted-foreground">Bookmarked Trends</div>
                  </div>
                  <div className="text-center p-3 bg-muted/20 rounded-lg">
                    <div className="text-2xl font-bold text-sentiment-positive">{profileStats.profileViews}</div>
                    <div className="text-xs text-muted-foreground">Profile Views</div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Top Analyst</span>
                    </div>
                    <Badge variant="secondary">This Month</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-sentiment-positive" />
                      <span className="text-sm font-medium">5-Star Accuracy</span>
                    </div>
                    <Badge variant="secondary">95% Rate</Badge>
                  </div>
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
                          <p className="text-xs text-muted-foreground line-clamp-2">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Eye className="w-4 h-4 mr-2" />
                  View Public Profile
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Profile Link
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Globe className="w-4 h-4 mr-2" />
                  Privacy Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Zap className="w-4 h-4 mr-2" />
                  Upgrade Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;