// Mock data for dashboard charts
// Based on the database schema designed for mental wellness tracking

// Task Completion Data for Pie Chart
export interface TaskCompletionData {
  id: string;
  label: string;
  value: number;
  color: string;
}

export const mockTaskCompletionData: TaskCompletionData[] = (() => {
  // Create mutable objects to avoid React 19 extensibility issues with Nivo
  const data = [
    {
      id: 'completed',
      label: 'Completed Tasks',
      value: 65,
      color: '#10b981' // green
    },
    {
      id: 'in-progress', 
      label: 'In Progress',
      value: 20,
      color: '#f59e0b' // amber
    },
    {
      id: 'pending',
      label: 'Pending Tasks',
      value: 15,
      color: '#ef4444' // red
    }
  ];
  // Ensure objects are mutable
  return data.map(item => ({ ...item }));
})();

// Weekly Activity Data for Calendar Heatmap
export interface ActivityData {
  day: string; // YYYY-MM-DD format
  value: number; // Activity level 0-100
}

export const mockWeeklyActivityData: ActivityData[] = (() => {
  const data: ActivityData[] = [];
  const startDate = new Date('2025-01-01');
  const endDate = new Date('2025-09-18'); // Current date
  
  // Generate activity data for each day of the year so far
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Create more discrete activity levels:
    // 0 = No activity (colorless)
    // 20-40 = Light green (low activity)
    // 60-80 = Medium green (moderate activity) 
    // 90-100 = Dark green (high activity)
    
    let activityLevel = 0;
    
    // Random distribution for more realistic patterns
    const rand = Math.random();
    
    // 15% chance of no activity (rest days, weekends, etc.)
    if (rand < 0.15) {
      activityLevel = 0;
    }
    // 30% chance of light activity
    else if (rand < 0.45) {
      activityLevel = Math.floor(Math.random() * 21) + 20; // 20-40
    }
    // 35% chance of moderate activity
    else if (rand < 0.80) {
      activityLevel = Math.floor(Math.random() * 21) + 60; // 60-80
    }
    // 20% chance of high activity
    else {
      activityLevel = Math.floor(Math.random() * 11) + 90; // 90-100
    }
    
    // Adjust patterns based on day of week
    if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekends
      // Higher chance of no activity or light activity on weekends
      if (activityLevel > 60 && Math.random() < 0.4) {
        activityLevel = Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 21) + 20;
      }
    }
    
    // Occasionally have complete rest periods (sick days, vacations)
    if (Math.random() < 0.08) { // 8% chance
      activityLevel = 0;
    }
    
    data.push({
      day: d.toISOString().split('T')[0], // YYYY-MM-DD format
      value: activityLevel
    });
  }
  
  // Ensure objects are mutable
  return data.map(item => ({ ...item }));
})();

// Emotion Distribution Data for Radar Chart
export interface EmotionRadarData {
  emotion: string;
  intensity: number; // 0-100 scale
  [key: string]: unknown; // Index signature for Nivo compatibility
}

export const mockEmotionData: EmotionRadarData[] = (() => {
  const data = [
    { emotion: 'Happy', intensity: 85 },
    { emotion: 'Calm', intensity: 92 },
    { emotion: 'Focused', intensity: 78 },
    { emotion: 'Confident', intensity: 82 },
    { emotion: 'Energetic', intensity: 75 },
    { emotion: 'Relaxed', intensity: 88 }
  ];
  // Ensure objects are mutable
  return data.map(item => ({ ...item }));
})();

// Additional data types for future use
export interface DailyMoodData {
  date: string;
  mood_score: number; // 1-10 scale
  energy_level: number; // 1-10 scale
  stress_level: number; // 1-10 scale
  sleep_hours: number;
  notes?: string;
}

export interface TherapySessionData {
  session_id: string;
  date: string;
  duration_minutes: number;
  session_type: 'individual' | 'group' | 'family';
  mood_before: number; // 1-10
  mood_after: number; // 1-10
  topics_discussed: string[];
  homework_assigned: boolean;
  next_session: string;
}

// Export all data for easy importing - create fresh copies to ensure mutability
export const chartData = {
  taskCompletion: mockTaskCompletionData.map(item => ({ ...item })),
  weeklyActivity: mockWeeklyActivityData.map(item => ({ ...item })),
  emotionDistribution: mockEmotionData.map(item => ({ ...item }))
};