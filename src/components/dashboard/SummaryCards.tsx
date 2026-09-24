import React from 'react';
import { Calendar, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { Activity } from '../../types';
import { timeToMinutes, getCurrentTimeHHMM, isToday } from '../../utils/dateUtils';

interface SummaryCardsProps {
  activities: Activity[];
  selectedDate: string;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ activities, selectedDate }) => {
  const total = activities.length;
  const completed = activities.filter((a) => a.completed).length;

  const currentMinutes = isToday(selectedDate) ? timeToMinutes(getCurrentTimeHHMM()) : 0;

  // Upcoming: activities not yet completed AND (if today, start time is >= current time or incomplete)
  const upcoming = activities.filter((a) => {
    if (a.completed) return false;
    if (!isToday(selectedDate)) return true;
    return timeToMinutes(a.startTime) >= currentMinutes || !a.completed;
  }).length;

  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Total Activities */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 transition-shadow hover:shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            กิจกรรมทั้งหมด
          </span>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums font-mono">
            {total}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">รายการ</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
          กำหนดการของวันที่เลือก
        </div>
      </div>

      {/* 2. Completed Activities */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 transition-shadow hover:shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            เสร็จสิ้นแล้ว
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums font-mono">
            {completed}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">รายการ</span>
        </div>
        <div className="mt-2 text-[11px] text-emerald-600/80 dark:text-emerald-400/80 font-medium">
          {total > 0 && completed === total
            ? 'ยอดเยี่ยม! ครบทุกกิจกรรม'
            : total > 0
            ? `เหลืออีก ${total - completed} รายการ`
            : 'ยังไม่มีกิจกรรม'}
        </div>
      </div>

      {/* 3. Upcoming Activities */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 transition-shadow hover:shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            กำลังจะมาถึง / รอทำ
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-amber-600 dark:text-amber-400 tabular-nums font-mono">
            {upcoming}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">รายการ</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
          กิจกรรมที่ยังไม่ได้ทำ
        </div>
      </div>

      {/* 4. Daily Progress Percentage */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 transition-shadow hover:shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            ความคืบหน้าของวัน
          </span>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400 tabular-nums font-mono">
            {progressPercent}%
          </span>
        </div>
        {/* Sleek Progress Bar */}
        <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
