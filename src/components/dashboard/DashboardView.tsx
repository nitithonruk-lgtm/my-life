import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { useSchedule } from '../../context/ScheduleContext';
import { SummaryCards } from './SummaryCards';
import { TimelineView } from '../timeline/TimelineView';
import {
  formatThaiDateFull,
  getTodayDateString,
  addDays,
} from '../../utils/dateUtils';

export const DashboardView: React.FC = () => {
  const {
    activities,
    selectedDate,
    setSelectedDate,
    preferences,
    openAddActivityModal,
  } = useSchedule();

  const todayStr = getTodayDateString();
  const isTodayDate = selectedDate === todayStr;

  // Filter activities for the selected date
  const dayActivities = activities.filter((a) => a.date === selectedDate);

  const handlePrevDay = () => setSelectedDate(addDays(selectedDate, -1));
  const handleNextDay = () => setSelectedDate(addDays(selectedDate, 1));
  const handleJumpToday = () => setSelectedDate(todayStr);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Date Navigation Strip */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 sm:px-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevDay}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="วันก่อนหน้า"
            aria-label="วันก่อนหน้า"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleNextDay}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="วันถัดไป"
            aria-label="วันถัดไป"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 ml-1">
            <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {formatThaiDateFull(selectedDate, preferences.buddhistYear)}
            </span>
            {isTodayDate ? (
              <span className="text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-medium">
                วันนี้
              </span>
            ) : (
              <button
                type="button"
                onClick={handleJumpToday}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
              >
                (กลับมาวันนี้)
              </button>
            )}
          </div>
        </div>

        {/* Date picker input & Quick Add button */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              if (e.target.value) setSelectedDate(e.target.value);
            }}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          />
          <button
            type="button"
            onClick={() => openAddActivityModal(selectedDate)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>เพิ่มกิจกรรมวันนี้</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics Cards */}
      <section aria-label="สรุปภาพรวมประจำวัน">
        <SummaryCards activities={dayActivities} selectedDate={selectedDate} />
      </section>

      {/* Timeline Section */}
      <section aria-label="ตารางเวลากิจกรรม">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>ตารางเวลากิจกรรม</span>
            <span className="text-xs font-normal text-slate-400 dark:text-slate-500">
              (คลิกกิจกรรมเพื่อดูรายละเอียด / เลื่อนเวลา)
            </span>
          </h2>
        </div>
        <TimelineView activities={dayActivities} selectedDate={selectedDate} />
      </section>
    </div>
  );
};
