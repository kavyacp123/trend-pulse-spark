import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Key, 
  Download, 
  Trash2,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Camera,
  Mail,
  Globe,
  Smartphone,
  Monitor,
  Clock,
  Database,
  Settings as SettingsIcon,
  Zap,
  Code,
  Webhook,
  Lock,
  Unlock,
  CheckCircle,
  AlertCircle,
  Info,
  Search,
  RotateCcw,
  HardDrive,
  Wifi,
  Activity,
  FileText,
  Calendar,
  Languages,
  Palette as PaletteIcon
} from "lucide-react";

interface ActiveSession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}

interface LoginActivity {
  id: string;
  timestamp: string;
  location: string;
  device: string;
  ip: string;
  success: boolean;
}

const Settings = () => {
  const { toast } = useToast();
  
  // Form states
  const [profile, setProfile] = useState({
    displayName: "Demo Analyst",
    email: "demo@analytics.com",
    username: "demo_analyst",
    role: "Analyst"
  });
  
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [notifications, setNotifications] = useState({
    realTimeAlerts: true,
    emailNotifications: true,
    weeklyDigest: false,
    pushNotifications: true,
    systemUpdates: true,
    marketingEmails: false,
    frequency: "immediate",
    quietHoursEnabled: false,
    quietStart: "22:00",
    quietEnd: "08:00"
  });

  const [displaySettings, setDisplaySettings] = useState({
    theme: "dark",
    language: "en",
    region: "US",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    defaultLayout: "grid",
    chartStyle: "modern",
    refreshInterval: "30s"
  });

  const [privacy, setPrivacy] = useState({
    analyticsTracking: true,
    cookieConsent: true,
    dataRetention: "1year",
    profileVisibility: "public"
  });

  const [advanced, setAdvanced] = useState({
    betaFeatures: false,
    developerMode: false,
    debugMode: false,
    cacheEnabled: true
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [apiKey] = useState("sk_live_abc123def456ghi789jkl012mno345pqr678");
  const [searchQuery, setSearchQuery] = useState("");

  const activeSessions: ActiveSession[] = [
    {
      id: '1',
      device: 'Chrome on Windows 11',
      location: 'San Francisco, CA',
      lastActive: '2 minutes ago',
      current: true
    },
    {
      id: '2',
      device: 'Safari on iPhone 15',
      location: 'San Francisco, CA',
      lastActive: '1 hour ago',
      current: false
    },
    {
      id: '3',
      device: 'Firefox on macOS',
      location: 'San Francisco, CA',
      lastActive: '2 days ago',
      current: false
    }
  ];

  const loginActivities: LoginActivity[] = [
    {
      id: '1',
      timestamp: '2024-01-15 14:30:22',
      location: 'San Francisco, CA',
      device: 'Chrome on Windows',
      ip: '192.168.1.100',
      success: true
    },
    {
      id: '2',
      timestamp: '2024-01-15 09:15:45',
      location: 'San Francisco, CA',
      device: 'Safari on iPhone',
      ip: '192.168.1.101',
      success: true
    },
    {
      id: '3',
      timestamp: '2024-01-14 18:22:10',
      location: 'Unknown Location',
      device: 'Chrome on Linux',
      ip: '203.0.113.1',
      success: false
    }
  ];

  const connectedAccounts = [
    {
      id: 'twitter',
      name: 'Twitter',
      connected: true,
      username: '@demo_analyst',
      icon: '𝕏',
      color: 'text-blue-400'
    },
    {
      id: 'reddit',
      name: 'Reddit',
      connected: false,
      username: null,
      icon: '🔴',
      color: 'text-orange-500'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      connected: true,
      username: 'demo-analyst',
      icon: '💼',
      color: 'text-blue-600'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      connected: false,
      username: null,
      icon: '📷',
      color: 'text-pink-500'
    }
  ];

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleChangePassword = () => {
    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirm password do not match.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully.",
    });
    
    setPasswords({ current: "", new: "", confirm: "" });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notifications Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleSaveDisplaySettings = () => {
    toast({
      title: "Display Settings Updated", 
      description: "Your display preferences have been saved.",
    });
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast({
      title: "API Key Copied",
      description: "Your API key has been copied to clipboard.",
    });
  };

  const handleRegenerateApiKey = () => {
    toast({
      title: "API Key Regenerated",
      description: "A new API key has been generated. Please update your integrations.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Data Export Started",
      description: "Your data export has been initiated. You will receive an email when ready.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account Deletion Requested",
      description: "Your account deletion request has been submitted for review.",
      variant: "destructive"
    });
  };

  const handleLogoutSession = (sessionId: string) => {
    toast({
      title: "Session Terminated",
      description: "The selected session has been logged out successfully.",
    });
  };

  const handleClearCache = () => {
    toast({
      title: "Cache Cleared",
      description: "Application cache has been cleared successfully.",
    });
  };

  const handleResetSettings = () => {
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values.",
    });
  };

  const filteredSettings = searchQuery ? 
    ['profile', 'account', 'notifications', 'display', 'api', 'privacy'].filter(tab => 
      tab.toLowerCase().includes(searchQuery.toLowerCase())
    ) : 
    ['profile', 'account', 'notifications', 'display', 'api', 'privacy'];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Settings & Configuration
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings, preferences, and integrations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search settings..."
              className="pl-10 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={handleResetSettings}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset All
          </Button>
        </div>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="display" className="flex items-center gap-2">
            <PaletteIcon className="w-4 h-4" />
            Display
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            API & Data
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <SettingsIcon className="w-4 h-4" />
            Advanced
          </TabsTrigger>
        </TabsList>

        {/* Account Security Tab */}
        <TabsContent value="account" className="space-y-6">
          {/* Change Password */}
          <Card className="gradient-card border-border shadow-card">
            <CardHeader>
              <CardTitle>Password & Security</CardTitle>
              <CardDescription>
                Update your password and manage security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPasswords.current ? "text" : "password"}
                      value={passwords.current}
                      onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                    >
                      {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPasswords.new ? "text" : "password"}
                      value={passwords.new}
                      onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                    >
                      {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                    >
                      {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <Button onClick={handleChangePassword} className="w-full md:w-auto">
                Update Password
              </Button>

              <Separator />

              {/* Two-Factor Authentication */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch 
                    checked={twoFactorEnabled}
                    onCheckedChange={setTwoFactorEnabled}
                  />
                </div>

                {twoFactorEnabled && (
                  <div className="p-4 border rounded-lg space-y-4">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-muted mx-auto rounded-lg flex items-center justify-center mb-4">
                        <div className="text-xs text-muted-foreground">QR Code</div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Scan this QR code with your authenticator app
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Backup Codes</Label>
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="p-2 bg-muted rounded">1234-5678</div>
                        <div className="p-2 bg-muted rounded">9876-5432</div>
                        <div className="p-2 bg-muted rounded">1111-2222</div>
                        <div className="p-2 bg-muted rounded">3333-4444</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card className="gradient-card border-border shadow-card">
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>
                Manage your active login sessions across devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        {session.device.includes('iPhone') ? <Smartphone className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{session.device}</span>
                          {session.current && <Badge variant="secondary">Current</Badge>}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {session.location} • Last active {session.lastActive}
                        </div>
                      </div>
                    </div>
                    {!session.current && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleLogoutSession(session.id)}
                      >
                        Logout
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Login Activity */}
          <Card className="gradient-card border-border shadow-card">
            <CardHeader>
              <CardTitle>Login Activity</CardTitle>
              <CardDescription>
                Recent login attempts and security events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {loginActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.success ? 'bg-sentiment-positive/20' : 'bg-sentiment-negative/20'
                        }`}>
                          {activity.success ? 
                            <CheckCircle className="w-4 h-4 text-sentiment-positive" /> : 
                            <AlertCircle className="w-4 h-4 text-sentiment-negative" />
                          }
                        </div>
                        <div>
                          <div className="font-medium text-sm">{activity.device}</div>
                          <div className="text-xs text-muted-foreground">
                            {activity.location} • {activity.ip}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {activity.timestamp}
                          </div>
                        </div>
                      </div>
                      <Badge variant={activity.success ? "secondary" : "destructive"}>
                        {activity.success ? "Success" : "Failed"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="gradient-card border-border shadow-card">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how and when you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-base font-medium">Email Notifications</Label>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm">Real-time Trend Alerts</Label>
                        <p className="text-xs text-muted-foreground">
                          Get notified instantly when new trends emerge
                        </p>
                      </div>
                      <Switch 
                        checked={notifications.realTimeAlerts}
                        onCheckedChange={(checked) => setNotifications({...notifications, realTimeAlerts: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm">Weekly Trend Digest</Label>
                        <p className="text-xs text-muted-foreground">
                          Receive a summary of trending topics each week
                        </p>
                      </div>
                      <Switch 
                        checked={notifications.weeklyDigest}
                        onCheckedChange={(checked) => setNotifications({...notifications, weeklyDigest: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm">System Updates</Label>
                        <p className="text-xs text-muted-foreground">
                          Important system updates and maintenance notifications
                        </p>
                      </div>
                      <Switch 
                        checked={notifications.systemUpdates}
                        onCheckedChange={(checked) => setNotifications({...notifications, systemUpdates: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm">Marketing Communications</Label>
                        <p className="text-xs text-muted-foreground">
                          Product updates, tips, and promotional content
                        </p>
                      </div>
                      <Switch 
                        checked={notifications.marketingEmails}
                        onCheckedChange={(checked) => setNotifications({...notifications, marketingEmails: checked})}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label className="text-base font-medium">Push Notifications</Label>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        Mobile Push Notifications
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Receive push notifications on your mobile device
                      </p>
                    </div>
                    <Switch 
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) => setNotifications({...notifications, pushNotifications: checked})}
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Notification Frequency</Label>
                    <Select value={notifications.frequency} onValueChange={(value) => setNotifications({...notifications, frequency: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="hourly">Hourly Digest</SelectItem>
                        <SelectItem value="daily">Daily Summary</SelectItem>
                        <SelectItem value="weekly">Weekly Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={notifications.quietHoursEnabled}
                        onCheckedChange={(checked) => setNotifications({...notifications, quietHoursEnabled: checked})}
                      />
                      <Label>Quiet Hours</Label>
                    </div>
                    {notifications.quietHoursEnabled && (
                      <div className="flex gap-2">
                        <Input
                          type="time"
                          value={notifications.quietStart}
                          onChange={(e) => setNotifications({...notifications, quietStart: e.target.value})}
                          className="flex-1"
                        />
                        <span className="self-center text-sm text-muted-foreground">to</span>
                        <Input
                          type="time"
                          value={notifications.quietEnd}
                          onChange={(e) => setNotifications({...notifications, quietEnd: e.target.value})}
                          className="flex-1"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveNotifications}>Save Notification Settings</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Settings Tab */}
        <TabsContent value="display" className="space-y-6">
          <Card className="gradient-card border-border shadow-card">
            <CardHeader>
              <CardTitle>Display & Interface</CardTitle>
              <CardDescription>
                Customize your dashboard appearance and behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={displaySettings.theme} onValueChange={(value) => setDisplaySettings({...displaySettings, theme: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light Mode</SelectItem>
                      <SelectItem value="dark">Dark Mode</SelectItem>
                      <SelectItem value="auto">Auto (System)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={displaySettings.language} onValueChange={(value) => setDisplaySettings({...displaySettings, language: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Select value={displaySettings.region} onValueChange={(value) => setDisplaySettings({...displaySettings, region: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="EU">Europe</SelectItem>
                      <SelectItem value="APAC">Asia Pacific</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select value={displaySettings.dateFormat} onValueChange={(value) => setDisplaySettings({...displaySettings, dateFormat: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeFormat">Time Format</Label>
                  <Select value={displaySettings.timeFormat} onValueChange={(value) => setDisplaySettings({...displaySettings, timeFormat: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12 Hour (AM/PM)</SelectItem>
                      <SelectItem value="24h">24 Hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="refreshInterval">Data Refresh Interval</Label>
                  <Select value={displaySettings.refreshInterval} onValueChange={(value) => setDisplaySettings({...displaySettings, refreshInterval: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15s">15 seconds</SelectItem>
                      <SelectItem value="30s">30 seconds</SelectItem>
                      <SelectItem value="1m">1 minute</SelectItem>
                      <SelectItem value="5m">5 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="text-base font-medium">Dashboard Layout</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Default Layout</Label>
                    <Select value={displaySettings.defaultLayout} onValueChange={(value) => setDisplaySettings({...displaySettings, defaultLayout: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grid">Grid View</SelectItem>
                        <SelectItem value="list">List View</SelectItem>
                        <SelectItem value="compact">Compact View</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Chart Style</Label>
                    <Select value={displaySettings.chartStyle} onValueChange={(value) => setDisplaySettings({...displaySettings, chartStyle: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="classic">Classic</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveDisplaySettings}>Save Display Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API & Integrations Tab */}
        <TabsContent value="api" className="space-y-6">
          {/* API Keys */}
          <Card className="gradient-card border-border shadow-card">
            <CardHeader>
              <CardTitle>API Keys & Integration</CardTitle>
              <CardDescription>
                Manage your API keys and external integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base font-medium">API Key Management</Label>
                <div className="flex items-center space-x-2">
                  <Input 
                    value={apiKey} 
                    readOnly 
                    type="password"
                    className="font-mono flex-1"
                  />
                  <Button variant="outline" size="sm" onClick={handleCopyApiKey}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleRegenerateApiKey}>
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Keep your API key secure. Never share it publicly or commit it to version control.
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="text-base font-medium">Connected Social Media Accounts</Label>
                <div className="space-y-3">
                  {connectedAccounts.map((account) => (
                    <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${account.color}`}>
                          <span className="text-lg">{account.icon}</span>
                        </div>
                        <div>
                          <p className="font-medium">{account.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {account.connected ? `Connected as ${account.username}` : 'Not connected'}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant={account.connected ? "destructive" : "outline"} 
                        size="sm"
                      >
                        {account.connected ? 'Disconnect' : 'Connect'}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="text-base font-medium">Webhook Configuration</Label>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-sm">Trend Alerts Webhook</Label>
                    <Input placeholder="https://your-domain.com/webhook/trends" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Content Generation Webhook</Label>
                    <Input placeholder="https://your-domain.com/webhook/content" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Configure webhook URLs to receive real-time notifications about trends and content generation
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Export */}
          <Card className="gradient-card border-border shadow-card">
            <CardHeader>
              <CardTitle>Data Export & Formats</CardTitle>
              <CardDescription>
                Configure data export preferences and formats
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <FileText className="w-6 h-6 mb-2" />
                  <span className="text-sm">Export as JSON</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Database className="w-6 h-6 mb-2" />
                  <span className="text-sm">Export as CSV</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Code className="w-6 h-6 mb-2" />
                  <span className="text-sm">Export as XML</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card className="gradient-card border-border shadow-card">
            <CardHeader>
              <CardTitle>Privacy & Data Management</CardTitle>
              <CardDescription>
                Control your data privacy and retention settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Analytics Tracking</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow us to collect usage analytics to improve the platform
                    </p>
                  </div>
                  <Switch 
                    checked={privacy.analyticsTracking}
                    onCheckedChange={(checked) => setPrivacy({...privacy, analyticsTracking: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Cookie Consent</Label>
                    <p className="text-sm text-muted-foreground">
                      Accept cookies for enhanced functionality
                    </p>
                  </div>
                  <Switch 
                    checked={privacy.cookieConsent}
                    onCheckedChange={(checked) => setPrivacy({...privacy, cookieConsent: checked})}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Data Retention Period</Label>
                  <Select value={privacy.dataRetention} onValueChange={(value) => setPrivacy({...privacy, dataRetention: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3months">3 Months</SelectItem>
                      <SelectItem value="6months">6 Months</SelectItem>
                      <SelectItem value="1year">1 Year</SelectItem>
                      <SelectItem value="2years">2 Years</SelectItem>
                      <SelectItem value="indefinite">Indefinite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Profile Visibility</Label>
                  <Select value={privacy.profileVisibility} onValueChange={(value) => setPrivacy({...privacy, profileVisibility: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="team">Team Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Download className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Download Your Data</p>
                      <p className="text-sm text-muted-foreground">
                        Export all your personal data in a portable format
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleExportData}>
                    Request Export
                  </Button>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg cursor-pointer hover:bg-destructive/5">
                      <div className="flex items-center space-x-3">
                        <Trash2 className="w-5 h-5 text-destructive" />
                        <div>
                          <p className="font-medium text-destructive">Delete All Data</p>
                          <p className="text-sm text-muted-foreground">
                            Permanently delete all your data from our servers
                          </p>
                        </div>
                      </div>
                      <Button variant="destructive" size="sm">
                        Delete Data
                      </Button>
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete All Data?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete all your data, including trends, 
                        analytics, and account information. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete All Data
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <Card className="gradient-card border-border shadow-card">
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Advanced configuration options for power users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base font-medium">Beta Features</Label>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Enable Beta Features</Label>
                      <p className="text-xs text-muted-foreground">
                        Get early access to new features and improvements
                      </p>
                    </div>
                    <Switch 
                      checked={advanced.betaFeatures}
                      onCheckedChange={(checked) => setAdvanced({...advanced, betaFeatures: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Developer Mode</Label>
                      <p className="text-xs text-muted-foreground">
                        Enable advanced debugging and development tools
                      </p>
                    </div>
                    <Switch 
                      checked={advanced.developerMode}
                      onCheckedChange={(checked) => setAdvanced({...advanced, developerMode: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Debug Mode</Label>
                      <p className="text-xs text-muted-foreground">
                        Show detailed error messages and performance metrics
                      </p>
                    </div>
                    <Switch 
                      checked={advanced.debugMode}
                      onCheckedChange={(checked) => setAdvanced({...advanced, debugMode: checked})}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="text-base font-medium">System Management</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <HardDrive className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Clear Cache</p>
                        <p className="text-sm text-muted-foreground">
                          Clear application cache and temporary data
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleClearCache}>
                      Clear
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Activity className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">System Diagnostics</p>
                        <p className="text-sm text-muted-foreground">
                          Run system health check and diagnostics
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Run Check
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Enable Caching</Label>
                    <p className="text-xs text-muted-foreground">
                      Cache data locally for faster performance
                    </p>
                  </div>
                  <Switch 
                    checked={advanced.cacheEnabled}
                    onCheckedChange={(checked) => setAdvanced({...advanced, cacheEnabled: checked})}
                  />
                </div>
              </div>

              <Separator />

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your
                      account and remove all your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;