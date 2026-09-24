export type Priority = 'low' | 'medium' | 'high';

export type RepeatType = 'daily' | 'weekly' | 'monthly';

export interface Activity {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  category: string;
  priority: Priority;
  color: string;
  completed: boolean;
  recurring: boolean;
  repeatType?: RepeatType;
  createdAt?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate?: string; // YYYY-MM-DD
  priority: Priority;
  completed: boolean;
  category?: string;
  createdAt: string;
}

export interface CategoryInfo {
  id: string;
  name: string;
  color: string;
  bgLight: string;
  bgDark: string;
  textLight: string;
  textDark: string;
  iconName: string;
}

export type NavTab = 'dashboard' | 'calendar' | 'tasks' | 'statistics' | 'settings';

export type CalendarViewType = 'month' | 'week' | 'day';

export interface UserPreferences {
  userName: string;
  theme: 'light' | 'dark' | 'system';
  buddhistYear: boolean;
  soundEnabled: boolean;
}
