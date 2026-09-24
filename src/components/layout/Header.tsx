import React, { useState, useEffect } from 'react';
import { Plus, Sun, Moon, CalendarDays, Sparkles, CheckCircle2 } from 'lucide-react';
import { useSchedule } from '../../context/ScheduleContext';
import { formatThaiDateFull, getThaiGreeting, getTodayDateString } from '../../utils/dateUtils';

export const Header: React.FC = () => {
  const { preferences, toggleTheme, openAddActivityModal, selectedDate, setSelectedDate, activities } = useSchedule();
  const [greeting, setGreeting] = useState<string>(() => getThaiGreeting());

  useEffect(() => {
    setGreeting(getThaiGreeting());
    const interval = setInterval(() => {
      setGreeting(getThaiGreeting());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const todayStr = getTodayDateString();
  const isViewingToday = selectedDate === todayStr;
  const thaiDateFormatted = formatThaiDateFull(selectedDate, preferences.buddhistYear);

  // Today's completion count
  const todayActs = activities.filter((a) => a.date === selectedDate);
  const completedCount = todayActs.filter((a) => a.completed).length;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-4 py-3 sm:px-6 lg:px-8 dark:border-slate-800/80 dark:bg-slate-900/90 transition-colors">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Left info: Greeting & Date */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <span>{greeting}</span>
              {preferences.userName && (
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  คุณ{preferences.userName}
                </span>
              )}
            </h1>
            {!isViewingToday && (
              <button
                onClick={() => setSelectedDate(todayStr)}
                className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors cursor-pointer ml-2"
                title="กลับมาที่วันนี้"
              >
                <span>(กลับมาดูวันนี้)</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            <CalendarDays className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
            <span>{thaiDateFormatted}</span>
            {todayActs.length > 0 && (
              <>
                <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">·</span>
                <span className="text-slate-500 dark:text-slate-400 tabular-nums">
                  สำเร็จ {completedCount}/{todayActs.length} กิจกรรม
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right actions: Add Activity & Theme Toggle */}
        <div className="flex items-center gap-2.5 self-end md:self-auto shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={preferences.theme === 'dark' ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด'}
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
            title={preferences.theme === 'dark' ? 'เปลี่ยนเป็นธีมสว่าง' : 'เปลี่ยนเป็นธีมมืด'}
          >
            {preferences.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          <button
            type="button"
            onClick={() => openAddActivityModal()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:scale-[0.98] shadow-sm hover:shadow transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="whitespace-nowrap">เพิ่มกิจกรรม</span>
          </button>
        </div>
      </div>
    </header>
  );
};
