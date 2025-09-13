import React, { useState } from 'react';
import { Play, Settings, History, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { useMeditationStore, type MeditationSettings } from '../hooks/useMeditationStore';
import { type MeditationTheme } from '../hooks/useMeditationTheme';

interface MeditationLandingProps {
  onStartSession: (settings: MeditationSettings) => void;
}

export const MeditationLanding: React.FC<MeditationLandingProps> = ({ onStartSession }) => {
  const { sessions, settings, updateSettings } = useMeditationStore();
  const [showCustomization, setShowCustomization] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleStartSession = () => {
    onStartSession(settings);
  };

  const handleSettingChange = (key: keyof MeditationSettings, value: string | number | boolean) => {
    updateSettings({ [key]: value });
  };

  const formatDuration = (minutes: number) => {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  };

  const getThemeDisplayName = (theme: MeditationTheme) => {
    switch (theme) {
      case 'galaxy':
        return '🌌 Galaxy';
      case 'forest':
        return '🌲 Forest';
      case 'ocean':
        return '🌊 Ocean';
      default:
        return theme;
    }
  };

  const recentSessions = sessions.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-slate-800">
            Mindful Meditation
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Find peace and clarity through guided meditation. Choose your session duration, 
            customize your experience, and begin your journey to inner calm.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Session Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Start Session Card */}
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Start Your Session
                </CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-6">
                {/* Duration Selection */}
                <div className="space-y-2">
                  <Label htmlFor="duration-select" className="text-sm font-medium">
                    Session Duration
                  </Label>
                  <Select
                    value={settings.sessionDuration.toString()}
                    onValueChange={(value: string) => handleSettingChange('sessionDuration', parseInt(value))}
                  >
                    <SelectTrigger id="duration-select" className="w-full">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="10">10 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="20">20 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Start Button */}
                <Button
                  onClick={handleStartSession}
                  size="lg"
                  className="w-full h-16 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                >
                  <Play className="h-6 w-6 mr-2" />
                  Begin Meditation ({formatDuration(settings.sessionDuration)})
                </Button>
              </CardContent>
            </Card>

            {/* Customization */}
            <Card>
              <Collapsible open={showCustomization} onOpenChange={setShowCustomization}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Customize Experience
                      </div>
                      <ChevronDown 
                        className={`h-4 w-4 transition-transform ${showCustomization ? 'rotate-180' : ''}`} 
                      />
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-6">
                    {/* Theme Selection */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Background Theme</Label>
                      <Select
                        value={settings.selectedTheme}
                        onValueChange={(value: MeditationTheme) => handleSettingChange('selectedTheme', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="galaxy">{getThemeDisplayName('galaxy')}</SelectItem>
                          <SelectItem value="forest">{getThemeDisplayName('forest')}</SelectItem>
                          <SelectItem value="ocean">{getThemeDisplayName('ocean')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Audio Settings */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="speech-enabled" className="text-sm font-medium">
                          Guided Narration
                        </Label>
                        <Switch
                          id="speech-enabled"
                          checked={settings.speechEnabled}
                          onCheckedChange={(checked: boolean) => handleSettingChange('speechEnabled', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="audio-enabled" className="text-sm font-medium">
                          Background Audio
                        </Label>
                        <Switch
                          id="audio-enabled"
                          checked={settings.backgroundAudioEnabled}
                          onCheckedChange={(checked: boolean) => handleSettingChange('backgroundAudioEnabled', checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Session History */}
            <Card>
              <Collapsible open={showHistory} onOpenChange={setShowHistory}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <History className="h-5 w-5" />
                        Recent Sessions
                      </div>
                      <ChevronDown 
                        className={`h-4 w-4 transition-transform ${showHistory ? 'rotate-180' : ''}`} 
                      />
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    {recentSessions.length > 0 ? (
                      <div className="space-y-3">
                        {recentSessions.map((session) => (
                          <div
                            key={session.id}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                          >
                            <div className="text-sm">
                              <div className="font-medium">{session.date}</div>
                              <div className="text-slate-600">
                                {getThemeDisplayName(session.theme)}
                              </div>
                            </div>
                            <div className="text-sm text-slate-600">
                              {formatDuration(session.completedDuration)}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <div className="text-4xl mb-2">🧘‍♀️</div>
                        <p className="text-sm">No sessions yet</p>
                        <p className="text-xs">Start your first meditation!</p>
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Quick Stats */}
            {sessions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Your Journey</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Total Sessions</span>
                    <span className="font-medium">{sessions.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Total Time</span>
                    <span className="font-medium">
                      {formatDuration(sessions.reduce((total: number, session) => total + session.completedDuration, 0))}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};