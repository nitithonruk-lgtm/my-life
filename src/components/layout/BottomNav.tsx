import React from 'react';
import { Home, Calendar, CheckSquare, BarChart3, Settings } from 'lucide-react';
import { useSchedule } from '../../context/ScheduleContext';
import { NavTab } from '../../types';

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

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useSchedule();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 dark:bg-slate-900/95 dark:border-slate-800 safe-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 min-w-[56px] transition-colors cursor-pointer ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              </div>
              <span className="text-[11px] mt-1 leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
