/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ScheduleProvider, useSchedule } from './context/ScheduleContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { DashboardView } from './components/dashboard/DashboardView';
import { CalendarView } from './components/calendar/CalendarView';
import { TasksView } from './components/tasks/TasksView';
import { StatisticsView } from './components/statistics/StatisticsView';
import { SettingsView } from './components/settings/SettingsView';
import { ActivityModal } from './components/modals/ActivityModal';
import { ActivityDetailModal } from './components/modals/ActivityDetailModal';
import { TaskModal } from './components/modals/TaskModal';

const AppContent: React.FC = () => {
  const { activeTab } = useSchedule();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased">
      {/* Desktop Left Sidebar */}
      <Sidebar />

      {/* Main Viewport */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <Header />

        {/* Scrollable Content Viewport with pb-20 on mobile for BottomNav */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-10">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'calendar' && <CalendarView />}
          {activeTab === 'tasks' && <TasksView />}
          {activeTab === 'statistics' && <StatisticsView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>

        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </div>

      {/* Global Modals */}
      <ActivityModal />
      <ActivityDetailModal />
      <TaskModal />
    </div>
  );
};

export default function App() {
  return (
    <ScheduleProvider>
      <AppContent />
    </ScheduleProvider>
  );
}
