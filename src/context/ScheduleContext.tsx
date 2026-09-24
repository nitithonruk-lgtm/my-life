import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Activity, Task, UserPreferences, NavTab } from '../types';
import {
  loadActivitiesFromStorage,
  saveActivitiesToStorage,
  loadTasksFromStorage,
  saveTasksToStorage,
  loadPreferencesFromStorage,
  savePreferencesToStorage,
  resetAppData,
  clearAllAppData,
} from '../utils/storage';
import { getTodayDateString } from '../utils/dateUtils';

interface ScheduleContextType {
  activities: Activity[];
  tasks: Task[];
  preferences: UserPreferences;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  
  // Activity actions
  addActivity: (activityData: Omit<Activity, 'id' | 'createdAt'>) => Activity;
  updateActivity: (id: string, updates: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
  toggleActivityComplete: (id: string) => void;
  shiftActivityTime: (id: string, shiftMinutes: number) => void;

  // Task actions
  addTask: (taskData: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;

  // Preferences & Theme
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  toggleTheme: () => void;
  resetToSampleData: () => void;
  clearAllData: () => void;
  importData: (payload: any) => boolean;

  // Modals state
  isActivityModalOpen: boolean;
  activityToEdit: Activity | null;
  activityPresetDate: string | null;
  activityPresetTime: string | null;
  openAddActivityModal: (presetDate?: string, presetStartTime?: string) => void;
  openEditActivityModal: (activity: Activity) => void;
  closeActivityModal: () => void;

  activityDetailItem: Activity | null;
  openActivityDetail: (activity: Activity) => void;
  closeActivityDetail: () => void;

  isTaskModalOpen: boolean;
  taskToEdit: Task | null;
  openAddTaskModal: () => void;
  openEditTaskModal: (task: Task) => void;
  closeTaskModal: () => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<Activity[]>(() => loadActivitiesFromStorage());
  const [tasks, setTasks] = useState<Task[]>(() => loadTasksFromStorage());
  const [preferences, setPreferences] = useState<UserPreferences>(() => loadPreferencesFromStorage());
  const [selectedDate, setSelectedDate] = useState<string>(() => getTodayDateString());
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  // Modals
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [activityToEdit, setActivityToEdit] = useState<Activity | null>(null);
  const [activityPresetDate, setActivityPresetDate] = useState<string | null>(null);
  const [activityPresetTime, setActivityPresetTime] = useState<string | null>(null);

  const [activityDetailItem, setActivityDetailItem] = useState<Activity | null>(null);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // Sync dark theme to HTML element
  useEffect(() => {
    const isDark =
      preferences.theme === 'dark' ||
      (preferences.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences.theme]);

  // Persist activities
  const handleSaveActivities = useCallback((newActivities: Activity[]) => {
    setActivities(newActivities);
    saveActivitiesToStorage(newActivities);
  }, []);

  // Persist tasks
  const handleSaveTasks = useCallback((newTasks: Task[]) => {
    setTasks(newTasks);
    saveTasksToStorage(newTasks);
  }, []);

  // Persist preferences
  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    setPreferences((prev) => {
      const updated = { ...prev, ...updates };
      savePreferencesToStorage(updated);
      return updated;
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setPreferences((prev) => {
      const newTheme: 'light' | 'dark' = prev.theme === 'dark' ? 'light' : 'dark';
      const updated: UserPreferences = { ...prev, theme: newTheme };
      savePreferencesToStorage(updated);
      return updated;
    });
  }, []);

  // Activity CRUD
  const addActivity = useCallback(
    (activityData: Omit<Activity, 'id' | 'createdAt'>): Activity => {
      const newActivity: Activity = {
        ...activityData,
        id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        createdAt: new Date().toISOString(),
      };
      setActivities((prev) => {
        const next = [...prev, newActivity];
        saveActivitiesToStorage(next);
        return next;
      });
      return newActivity;
    },
    []
  );

  const updateActivity = useCallback((id: string, updates: Partial<Activity>) => {
    setActivities((prev) => {
      const next = prev.map((act) => (act.id === id ? { ...act, ...updates } : act));
      saveActivitiesToStorage(next);
      return next;
    });
    setActivityDetailItem((curr) => (curr && curr.id === id ? { ...curr, ...updates } : curr));
  }, []);

  const deleteActivity = useCallback((id: string) => {
    setActivities((prev) => {
      const next = prev.filter((act) => act.id !== id);
      saveActivitiesToStorage(next);
      return next;
    });
    setActivityDetailItem((curr) => (curr && curr.id === id ? null : curr));
  }, []);

  const toggleActivityComplete = useCallback((id: string) => {
    setActivities((prev) => {
      const next = prev.map((act) =>
        act.id === id ? { ...act, completed: !act.completed } : act
      );
      saveActivitiesToStorage(next);
      return next;
    });
    setActivityDetailItem((curr) =>
      curr && curr.id === id ? { ...curr, completed: !curr.completed } : curr
    );
  }, []);

  const shiftActivityTime = useCallback((id: string, shiftMinutes: number) => {
    setActivities((prev) => {
      const target = prev.find((a) => a.id === id);
      if (!target) return prev;

      const [startH, startM] = target.startTime.split(':').map(Number);
      const [endH, endM] = target.endTime.split(':').map(Number);

      const oldStartMin = startH * 60 + startM;
      const oldEndMin = endH * 60 + endM;
      const duration = oldEndMin - oldStartMin;

      let newStartMin = oldStartMin + shiftMinutes;
      // Clamp between 00:00 and 23:59
      if (newStartMin < 0) newStartMin = 0;
      if (newStartMin + duration > 1439) newStartMin = 1439 - duration;
      const newEndMin = newStartMin + duration;

      const newStartH = String(Math.floor(newStartMin / 60)).padStart(2, '0');
      const newStartM = String(newStartMin % 60).padStart(2, '0');
      const newEndH = String(Math.floor(newEndMin / 60)).padStart(2, '0');
      const newEndM = String(newEndMin % 60).padStart(2, '0');

      const updated = prev.map((act) =>
        act.id === id
          ? {
              ...act,
              startTime: `${newStartH}:${newStartM}`,
              endTime: `${newEndH}:${newEndM}`,
            }
          : act
      );
      saveActivitiesToStorage(updated);
      return updated;
    });
  }, []);

  // Task CRUD
  const addTask = useCallback(
    (taskData: Omit<Task, 'id' | 'createdAt'>): Task => {
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => {
        const next = [newTask, ...prev];
        saveTasksToStorage(next);
        return next;
      });
      return newTask;
    },
    []
  );

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, ...updates } : t));
      saveTasksToStorage(next);
      return next;
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => {
      const next = prev.filter((t) => t.id !== id);
      saveTasksToStorage(next);
      return next;
    });
  }, []);

  const toggleTaskComplete = useCallback((id: string) => {
    setTasks((prev) => {
      const next = prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      );
      saveTasksToStorage(next);
      return next;
    });
  }, []);

  // Reset & Clear
  const resetToSampleData = useCallback(() => {
    const res = resetAppData();
    setActivities(res.activities);
    setTasks(res.tasks);
    setPreferences(res.preferences);
  }, []);

  const clearAllData = useCallback(() => {
    const res = clearAllAppData();
    setActivities(res.activities);
    setTasks(res.tasks);
  }, []);

  const importData = useCallback((payload: any): boolean => {
    try {
      if (!payload || typeof payload !== 'object') return false;
      if (Array.isArray(payload.activities)) {
        handleSaveActivities(payload.activities);
      }
      if (Array.isArray(payload.tasks)) {
        handleSaveTasks(payload.tasks);
      }
      if (payload.preferences) {
        updatePreferences(payload.preferences);
      }
      return true;
    } catch (e) {
      console.error('Failed to import data:', e);
      return false;
    }
  }, [handleSaveActivities, handleSaveTasks, updatePreferences]);

  // Modal Handlers
  const openAddActivityModal = useCallback((presetDate?: string, presetStartTime?: string) => {
    setActivityToEdit(null);
    setActivityPresetDate(presetDate || selectedDate);
    setActivityPresetTime(presetStartTime || '09:00');
    setIsActivityModalOpen(true);
  }, [selectedDate]);

  const openEditActivityModal = useCallback((activity: Activity) => {
    setActivityToEdit(activity);
    setActivityPresetDate(null);
    setActivityPresetTime(null);
    setIsActivityModalOpen(true);
  }, []);

  const closeActivityModal = useCallback(() => {
    setIsActivityModalOpen(false);
    setActivityToEdit(null);
    setActivityPresetDate(null);
    setActivityPresetTime(null);
  }, []);

  const openActivityDetail = useCallback((activity: Activity) => {
    setActivityDetailItem(activity);
  }, []);

  const closeActivityDetail = useCallback(() => {
    setActivityDetailItem(null);
  }, []);

  const openAddTaskModal = useCallback(() => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  }, []);

  const openEditTaskModal = useCallback((task: Task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  }, []);

  const closeTaskModal = useCallback(() => {
    setIsTaskModalOpen(false);
    setTaskToEdit(null);
  }, []);

  const contextValue = useMemo(
    () => ({
      activities,
      tasks,
      preferences,
      selectedDate,
      setSelectedDate,
      activeTab,
      setActiveTab,
      addActivity,
      updateActivity,
      deleteActivity,
      toggleActivityComplete,
      shiftActivityTime,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskComplete,
      updatePreferences,
      toggleTheme,
      resetToSampleData,
      clearAllData,
      importData,
      isActivityModalOpen,
      activityToEdit,
      activityPresetDate,
      activityPresetTime,
      openAddActivityModal,
      openEditActivityModal,
      closeActivityModal,
      activityDetailItem,
      openActivityDetail,
      closeActivityDetail,
      isTaskModalOpen,
      taskToEdit,
      openAddTaskModal,
      openEditTaskModal,
      closeTaskModal,
    }),
    [
      activities,
      tasks,
      preferences,
      selectedDate,
      activeTab,
      addActivity,
      updateActivity,
      deleteActivity,
      toggleActivityComplete,
      shiftActivityTime,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskComplete,
      updatePreferences,
      toggleTheme,
      resetToSampleData,
      clearAllData,
      importData,
      isActivityModalOpen,
      activityToEdit,
      activityPresetDate,
      activityPresetTime,
      openAddActivityModal,
      openEditActivityModal,
      closeActivityModal,
      activityDetailItem,
      openActivityDetail,
      closeActivityDetail,
      isTaskModalOpen,
      taskToEdit,
      openAddTaskModal,
      openEditTaskModal,
      closeTaskModal,
    ]
  );

  return <ScheduleContext.Provider value={contextValue}>{children}</ScheduleContext.Provider>;
};

export function useSchedule(): ScheduleContextType {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
}
