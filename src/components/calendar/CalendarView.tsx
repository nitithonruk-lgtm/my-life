import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  CheckCircle2,
  Calendar as CalendarIcon,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useSchedule } from '../../context/ScheduleContext';
import { CalendarViewType, Activity } from '../../types';
import {
  THAI_DAYS_SHORT,
  THAI_MONTHS,
  formatThaiDateFull,
  formatThaiDateShort,
  getTodayDateString,
  addDays,
  getWeekDates,
  timeToMinutes,
} from '../../utils/dateUtils';
import { TimelineView } from '../timeline/TimelineView';

export const CalendarView: React.FC = () => {
  const {
    activities,
    selectedDate,
    setSelectedDate,
    openAddActivityModal,
    openActivityDetail,
    setActiveTab,
    preferences,
  } = useSchedule();

  const [viewType, setViewType] = useState<CalendarViewType>('month');

  // Month navigation state
  const [currentYearMonth, setCurrentYearMonth] = useState(() => {
    const [y, m] = selectedDate.split('-').map(Number);
    return { year: y, month: m - 1 }; // month 0-indexed
  });

  const todayStr = getTodayDateString();

  // Calendar Grid generation for Month View
  const calendarDays = useMemo(() => {
    const { year, month } = currentYearMonth;
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Previous month filler days
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const prevDays = [];
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevM = month === 0 ? 12 : month;
      const prevY = month === 0 ? year - 1 : year;
      const dateStr = `${prevY}-${String(prevM).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      prevDays.push({ dateStr, day: d, isCurrentMonth: false });
    }

    // Current month days
    const currentDays = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      currentDays.push({ dateStr, day: d, isCurrentMonth: true });
    }

    // Next month filler days to complete grid (42 cells = 6 weeks)
    const totalCells = prevDays.length + currentDays.length;
    const remainingCells = totalCells <= 35 ? 35 - totalCells : 42 - totalCells;
    const nextDays = [];
    for (let d = 1; d <= remainingCells; d++) {
      const nextM = month === 11 ? 1 : month + 2;
      const nextY = month === 11 ? year + 1 : year;
      const dateStr = `${nextY}-${String(nextM).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      nextDays.push({ dateStr, day: d, isCurrentMonth: false });
    }

    return [...prevDays, ...currentDays, ...nextDays];
  }, [currentYearMonth]);

  // Handle Month changes
  const handlePrevMonth = () => {
    setCurrentYearMonth((prev) => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 };
      return { year: prev.year, month: prev.month - 1 };
    });
  };

  const handleNextMonth = () => {
    setCurrentYearMonth((prev) => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 };
      return { year: prev.year, month: prev.month + 1 };
    });
  };

  const handleJumpToToday = () => {
    const [y, m] = todayStr.split('-').map(Number);
    setCurrentYearMonth({ year: y, month: m - 1 });
    setSelectedDate(todayStr);
  };

  // Activities for selected date
  const selectedDateActivities = useMemo(() => {
    return activities
      .filter((a) => a.date === selectedDate)
      .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
  }, [activities, selectedDate]);

  // Week View Dates
  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate]);

  const displayMonthYearName = useMemo(() => {
    const monthName = THAI_MONTHS[currentYearMonth.month];
    const yearDisplay = preferences.buddhistYear
      ? currentYearMonth.year + 543
      : currentYearMonth.year;
    return `${monthName} ${yearDisplay}`;
  }, [currentYearMonth, preferences.buddhistYear]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header Controls: Month Navigation, Today button, View switch */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 sm:px-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2">
          {viewType === 'month' ? (
            <>
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="เดือนก่อนหน้า"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="เดือนถัดไป"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white ml-2">
                {displayMonthYearName}
              </h2>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setSelectedDate(addDays(selectedDate, viewType === 'week' ? -7 : -1))
                }
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setSelectedDate(addDays(selectedDate, viewType === 'week' ? 7 : 1))
                }
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white ml-2">
                {formatThaiDateFull(selectedDate, preferences.buddhistYear)}
              </h2>
            </div>
          )}

          <button
            type="button"
            onClick={handleJumpToToday}
            className="ml-2 text-xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors cursor-pointer"
          >
            วันนี้
          </button>
        </div>

        {/* View Mode Switcher: Month, Week, Day */}
        <div className="flex items-center gap-1 self-end sm:self-auto p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
          {(['month', 'week', 'day'] as CalendarViewType[]).map((v) => {
            const label = v === 'month' ? 'มุมมองเดือน' : v === 'week' ? 'มุมมองสัปดาห์' : 'มุมมองวัน';
            const isActive = viewType === v;
            return (
              <button
                key={v}
                type="button"
                onClick={() => setViewType(v)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-700 dark:text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* MONTH VIEW */}
      {viewType === 'month' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Grid (2 cols on large screen) */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {THAI_DAYS_SHORT.map((dayName, idx) => (
                <div
                  key={dayName}
                  className={`text-xs font-semibold py-1.5 ${
                    idx === 0 || idx === 6
                      ? 'text-rose-500/80 dark:text-rose-400/80'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {dayName}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {calendarDays.map((item, index) => {
                const dayActs = activities.filter((a) => a.date === item.dateStr);
                const isSelected = item.dateStr === selectedDate;
                const isTodayDate = item.dateStr === todayStr;

                return (
                  <button
                    key={`${item.dateStr}-${index}`}
                    type="button"
                    onClick={() => setSelectedDate(item.dateStr)}
                    className={`min-h-[72px] sm:min-h-[84px] p-1.5 rounded-lg border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30 ring-1 ring-indigo-500'
                        : isTodayDate
                        ? 'border-indigo-300 bg-slate-50 dark:border-indigo-800 dark:bg-slate-800/40'
                        : 'border-slate-100 hover:border-slate-300 dark:border-slate-800/60 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                    } ${!item.isCurrentMonth ? 'opacity-40' : ''}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full tabular-nums font-mono ${
                          isTodayDate
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : isSelected
                            ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {item.day}
                      </span>

                      {dayActs.length > 0 && (
                        <span className="text-[10px] tabular-nums font-mono font-semibold px-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {dayActs.length}
                        </span>
                      )}
                    </div>

                    {/* Activity dots/snippets */}
                    <div className="mt-1 space-y-0.5 overflow-hidden w-full">
                      {dayActs.slice(0, 2).map((act) => (
                        <div
                          key={act.id}
                          className="text-[10px] truncate px-1 py-0.5 rounded font-medium flex items-center gap-1 leading-tight"
                          style={{
                            backgroundColor: `${act.color || '#6366F1'}18`,
                            color: act.color || '#6366F1',
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: act.color || '#6366F1' }}
                          />
                          <span className="truncate">{act.title}</span>
                        </div>
                      ))}
                      {dayActs.length > 2 && (
                        <span className="text-[9px] text-slate-400 pl-1 block">
                          +{dayActs.length - 2} อื่นๆ
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Date Activity Sidebar */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              <div>
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 block">
                  รายละเอียดของวันที่เลือก
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  {formatThaiDateFull(selectedDate, preferences.buddhistYear)}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => openAddActivityModal(selectedDate)}
                className="p-1.5 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
                title="เพิ่มกิจกรรมในวันนี้"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {selectedDateActivities.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-10 text-center text-slate-400 dark:text-slate-500">
                <CalendarIcon className="w-8 h-8 stroke-[1.5] mb-2 text-slate-300 dark:text-slate-600" />
                <p className="text-xs">ไม่มีกิจกรรมที่บันทึกไว้ในวันนี้</p>
                <button
                  type="button"
                  onClick={() => openAddActivityModal(selectedDate)}
                  className="mt-3 text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline cursor-pointer"
                >
                  + เพิ่มกิจกรรมสำหรับวันนี้
                </button>
              </div>
            ) : (
              <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[460px] pr-1">
                {selectedDateActivities.map((act) => (
                  <div
                    key={act.id}
                    onClick={() => openActivityDetail(act)}
                    className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors cursor-pointer group relative"
                  >
                    <div
                      className="absolute left-0 top-2 bottom-2 w-1 rounded-r"
                      style={{ backgroundColor: act.color || '#6366F1' }}
                    />
                    <div className="pl-1">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-mono tabular-nums font-semibold text-indigo-600 dark:text-indigo-400">
                          {act.startTime} – {act.endTime}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {act.category}
                        </span>
                      </div>
                      <h4
                        className={`text-xs sm:text-sm font-semibold truncate ${
                          act.completed
                            ? 'line-through text-slate-400'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {act.title}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className="w-full py-2 px-3 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>เปิดดูบนไทม์ไลน์รายวัน</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WEEK VIEW */}
      {viewType === 'week' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs overflow-x-auto">
          <div className="grid grid-cols-7 gap-3 min-w-[700px]">
            {weekDates.map((dateStr) => {
              const [y, m, d] = dateStr.split('-').map(Number);
              const dateObj = new Date(y, m - 1, d);
              const dayOfWeek = THAI_DAYS_SHORT[dateObj.getDay()];
              const isSelected = dateStr === selectedDate;
              const isTodayDate = dateStr === todayStr;

              const actsOnDate = activities
                .filter((a) => a.date === dateStr)
                .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

              return (
                <div
                  key={dateStr}
                  className={`p-3 rounded-xl border flex flex-col min-h-[360px] ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                        {dayOfWeek}
                      </span>
                      <span
                        className={`text-sm font-bold font-mono ${
                          isTodayDate ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {d}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => openAddActivityModal(dateStr)}
                      className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      title="เพิ่มกิจกรรม"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* List of activities */}
                  <div className="mt-2.5 space-y-2 flex-1 overflow-y-auto">
                    {actsOnDate.map((act) => (
                      <div
                        key={act.id}
                        onClick={() => openActivityDetail(act)}
                        className="p-2 rounded-lg text-left transition-all hover:shadow-xs cursor-pointer border border-slate-100 dark:border-slate-800/80"
                        style={{
                          backgroundColor: `${act.color || '#6366F1'}14`,
                          borderLeft: `3px solid ${act.color || '#6366F1'}`,
                        }}
                      >
                        <span className="text-[10px] font-mono tabular-nums font-semibold block text-slate-600 dark:text-slate-300">
                          {act.startTime}
                        </span>
                        <h5 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                          {act.title}
                        </h5>
                      </div>
                    ))}

                    {actsOnDate.length === 0 && (
                      <div className="h-full flex items-center justify-center text-center text-[11px] text-slate-400">
                        ไม่มีกิจกรรม
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DAY VIEW */}
      {viewType === 'day' && (
        <div className="space-y-4">
          <TimelineView activities={selectedDateActivities} selectedDate={selectedDate} />
        </div>
      )}
    </div>
  );
};
