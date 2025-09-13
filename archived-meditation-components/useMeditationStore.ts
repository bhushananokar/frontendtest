import { useState, useEffect, useCallback } from 'react';

// Types following DigitalTwin's TypeScript patterns
export interface MeditationSession {
  id: string;
  date: string;
  duration: number; // planned duration in minutes
  completedDuration: number; // actual completed duration in minutes
  theme: 'galaxy' | 'forest' | 'ocean';
  timestamp: number;
}

export interface MeditationSettings {
  sessionDuration: number;
  selectedTheme: 'galaxy' | 'forest' | 'ocean';
  speechEnabled: boolean;
  backgroundAudioEnabled: boolean;
  backgroundAudioVolume: number;
}

const DEFAULT_SETTINGS: MeditationSettings = {
  sessionDuration: 5,
  selectedTheme: 'galaxy',
  speechEnabled: true,
  backgroundAudioEnabled: true,
  backgroundAudioVolume: 0.3,
};

const STORAGE_KEYS = {
  SESSIONS: 'meditation_sessions',
  SETTINGS: 'meditation_settings',
} as const;

/**
 * Custom hook for managing meditation session persistence and settings
 * Follows DigitalTwin's pattern of localStorage persistence with CustomEvents
 */
export const useMeditationStore = () => {
  const [sessions, setSessions] = useState<MeditationSession[]>([]);
  const [settings, setSettings] = useState<MeditationSettings>(DEFAULT_SETTINGS);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (savedSessions) {
        setSessions(JSON.parse(savedSessions));
      }

      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (savedSettings) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) });
      }
    } catch (error) {
      console.error('Error loading meditation data from localStorage:', error);
    }
  }, []);

  // Save session and dispatch event (following DigitalTwin's event pattern)
  const saveSession = useCallback((session: Omit<MeditationSession, 'id' | 'timestamp'>) => {
    try {
      const newSession: MeditationSession = {
        ...session,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
      };

      const updatedSessions = [newSession, ...sessions].slice(0, 20); // Keep last 20 sessions
      setSessions(updatedSessions);
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updatedSessions));

      // Dispatch event for other components to listen (following DigitalTwin pattern)
      window.dispatchEvent(new CustomEvent('meditation-session-saved', {
        detail: { session: newSession }
      }));

      return newSession;
    } catch (error) {
      console.error('Error saving meditation session:', error);
      throw error;
    }
  }, [sessions]);

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<MeditationSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updatedSettings));

      // Dispatch event for settings changes
      window.dispatchEvent(new CustomEvent('meditation-settings-updated', {
        detail: { settings: updatedSettings }
      }));
    } catch (error) {
      console.error('Error updating meditation settings:', error);
      throw error;
    }
  }, [settings]);

  // Delete session
  const deleteSession = useCallback((sessionId: string) => {
    try {
      const updatedSessions = sessions.filter(session => session.id !== sessionId);
      setSessions(updatedSessions);
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updatedSessions));

      window.dispatchEvent(new CustomEvent('meditation-session-deleted', {
        detail: { sessionId }
      }));
    } catch (error) {
      console.error('Error deleting meditation session:', error);
      throw error;
    }
  }, [sessions]);

  // Get sessions by date range
  const getSessionsByDateRange = useCallback((startDate: Date, endDate: Date) => {
    return sessions.filter(session => {
      const sessionDate = new Date(session.timestamp);
      return sessionDate >= startDate && sessionDate <= endDate;
    });
  }, [sessions]);

  // Get total meditation time
  const getTotalMeditationTime = useCallback(() => {
    return sessions.reduce((total, session) => total + session.completedDuration, 0);
  }, [sessions]);

  // Get streak information
  const getCurrentStreak = useCallback(() => {
    if (sessions.length === 0) return 0;

    const sortedSessions = [...sessions].sort((a, b) => b.timestamp - a.timestamp);
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const session of sortedSessions) {
      const sessionDate = new Date(session.timestamp);
      sessionDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === streak || (streak === 0 && daysDiff === 0)) {
        streak++;
        currentDate = sessionDate;
      } else if (daysDiff === streak + 1) {
        // Gap of one day, continue streak if it's the first day
        break;
      } else {
        break;
      }
    }

    return streak;
  }, [sessions]);

  return {
    // Data
    sessions,
    settings,
    
    // Actions
    saveSession,
    updateSettings,
    deleteSession,
    
    // Computed values
    getSessionsByDateRange,
    getTotalMeditationTime,
    getCurrentStreak,
  };
};