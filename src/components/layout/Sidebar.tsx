import React from 'react';
import { Home, Calendar, CheckSquare, BarChart3, Settings, Clock, Layers } from 'lucide-react';
import { useSchedule } from '../../context/ScheduleContext';
import { NavTab } from '../../types';
import { getTodayDateString } from '../../utils/dateUtils';

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'วันนี้', icon: Home },
  { id: 'calendar', label: 'ปฏิทิน', icon: Calendar },
  { id: 'tasks', label: 'งาน', icon: CheckSquare },
  { id: 'statistics', label: 'สถิติ', icon: BarChart3 },
  { id: 'settings', label: 'ตั้งค่า', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, activities, tasks } = useSchedule();
  const today = getTodayDateString();

  // Compute pending counts
  const todayPendingCount = activities.filter((a) => a.date === today && !a.completed).length;
  const pendingTasksCount = tasks.filter((t) => !t.completed).length;

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-slate-900 shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200 dark:shadow-none">
            <Clock className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              DailyFlow
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              ตารางเวลาและกิจกรรม
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          let badgeCount = 0;
          if (item.id === 'dashboard' && todayPendingCount > 0) {
            badgeCount = todayPendingCount;
          } else if (item.id === 'tasks' && pendingTasksCount > 0) {
            badgeCount = pendingTasksCount;
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer text-left ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600 font-semibold dark:bg-indigo-950/50 dark:text-indigo-400'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {badgeCount > 0 && (
                <span
                  className={`text-xs tabular-nums px-2 py-0.5 rounded text-center ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Status / Motivation footer */}
      <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              จังหวะเวลาของคุณ
            </span>
          </div>
          <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">
            จัดเวลาให้สอดคล้องกับพลังงาน แล้วทุกวันจะลื่นไหลอย่างเป็นธรรมชาติ
          </p>
        </div>
      </div>
    </aside>
  );
};
