export const TIME_RANGE_OPTIONS = [
  '7 days', 
  '30 days', 
  '60 days', 
  '180 days', 
  'Last 365 days'
] as const;

export const DATE_FILTER_OPTIONS = [
  'Today', 
  'Yesterday', 
  'This Week', 
  'This Month', 
  'Custom Range'
] as const;

export const EMOTION_FILTER_OPTIONS = [
  'Happy', 
  'Anxious', 
  'Angry', 
  'Thrilling', 
  'Calm', 
  'Excited'
] as const;

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
] as const;

export const NAVIGATION_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { id: 'journaling', label: 'Journaling', icon: 'BookOpen' },
  { id: 'therapy', label: 'Therapy', icon: 'Brain' },
  { id: 'meditation', label: 'Meditation', icon: 'Flower2' },
  { id: 'settings', label: 'Menu settings', icon: 'Settings' }
] as const;

// Default tasks data
export const DEFAULT_TASKS = [
  { text: 'Create a user flow of social application design', completed: true },
  { text: 'Create a user flow of social application design', completed: true },
  { text: 'Landing page design for Fintech project', completed: true },
  { text: 'Interactive prototype for app screens', completed: false },
  { text: 'Interactive prototype for app screens', completed: true }
] as const;

// Sample journal entries for dashboard
export const SAMPLE_JOURNAL_ENTRIES = [
  { name: 'Spent time with Bhushan', summary: 'Meeting Friends', date: 'Aug 23, 2025', emotion: 'Happy', progress: 100, color: '#10b981' },
  { name: 'Physics exam went good', summary: 'Exams', date: 'Aug 22, 2025', emotion: 'Anxious', progress: 70, color: '#f59e0b' },
  { name: 'Media channel branding', summary: 'Meeting', date: 'Aug 21, 2025', emotion: 'Angry', progress: 60, color: '#ef4444' },
  { name: 'Date with Ameya', summary: 'Coffee Date', date: 'Aug 20, 2025', emotion: 'Happy', progress: 100, color: '#10b981' },
  { name: 'Sports with Friends', summary: 'Played Hockey', date: 'Aug 19, 2025', emotion: 'Thrilling', progress: 80, color: '#8B5CF6' }
] as const;
