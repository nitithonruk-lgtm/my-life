import { Activity, Task, UserPreferences } from '../types';
import { getInitialActivities, getInitialTasks, DEFAULT_PREFERENCES } from './constants';

const STORAGE_KEYS = {
  ACTIVITIES: 'dailyflow_activities_v1',
  TASKS: 'dailyflow_tasks_v1',
  PREFERENCES: 'dailyflow_preferences_v1',
};

export function loadActivitiesFromStorage(): Activity[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    if (!data) {
      const initial = getInitialActivities();
      saveActivitiesToStorage(initial);
      return initial;
    }
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    const initial = getInitialActivities();
    saveActivitiesToStorage(initial);
    return initial;
  } catch (error) {
    console.error('Failed to load activities from storage:', error);
    return getInitialActivities();
  }
}

export function saveActivitiesToStorage(activities: Activity[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  } catch (error) {
    console.error('Failed to save activities to storage:', error);
  }
}

export function loadTasksFromStorage(): Task[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!data) {
      const initial = getInitialTasks();
      saveTasksToStorage(initial);
      return initial;
    }
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return getInitialTasks();
  } catch (error) {
    console.error('Failed to load tasks from storage:', error);
    return getInitialTasks();
  }
}

export function saveTasksToStorage(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to storage:', error);
  }
}

export function loadPreferencesFromStorage(): UserPreferences {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (!data) {
      return DEFAULT_PREFERENCES;
    }
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(data) };
  } catch (error) {
    console.error('Failed to load preferences from storage:', error);
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferencesToStorage(prefs: UserPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
  } catch (error) {
    console.error('Failed to save preferences to storage:', error);
  }
}

/**
 * Export all data to JSON file
 */
export function exportAppData(): void {
  const activities = loadActivitiesFromStorage();
  const tasks = loadTasksFromStorage();
  const preferences = loadPreferencesFromStorage();

  const exportPayload = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    activities,
    tasks,
    preferences,
  };

  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dailyflow-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Reset all data to initial sample state
 */
export function resetAppData(): { activities: Activity[]; tasks: Task[]; preferences: UserPreferences } {
  const activities = getInitialActivities();
  const tasks = getInitialTasks();
  const preferences = DEFAULT_PREFERENCES;

  saveActivitiesToStorage(activities);
  saveTasksToStorage(tasks);
  savePreferencesToStorage(preferences);

  return { activities, tasks, preferences };
}

/**
 * Clear all user activities and tasks
 */
export function clearAllAppData(): { activities: Activity[]; tasks: Task[] } {
  saveActivitiesToStorage([]);
  saveTasksToStorage([]);
  return { activities: [], tasks: [] };
}
