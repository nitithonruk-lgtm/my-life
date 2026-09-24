import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock,
  PieChart,
  Calendar,
  Layers,
  Award,
} from 'lucide-react';
import { useSchedule } from '../../context/ScheduleContext';
import {
  calculateDurationHours,
  getWeekDates,
  getTodayDateString,
  THAI_DAYS_SHORT,
  formatThaiDateShort,
} from '../../utils/dateUtils';
import { CATEGORIES } from '../../utils/constants';

export const StatisticsView: React.FC = () => {
  const { activities, preferences, selectedDate } = useSchedule();
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  // General KPIs
  const totalActivities = activities.length;
  const completedActivities = activities.filter((a) => a.completed).length;
  const overallCompletionRate =
    totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;

  const totalPlannedHours = useMemo(() => {
    const sum = activities.reduce((acc, a) => {
      return acc + calculateDurationHours(a.startTime, a.endTime);
    }, 0);
    return Number(sum.toFixed(1));
  }, [activities]);

  // Category breakdown
  const categoryStats = useMemo(() => {
    const map = new Map<string, { count: number; hours: number; color: string }>();

    CATEGORIES.forEach((c) => {
      map.set(c.name, { count: 0, hours: 0, color: c.color });
    });

    activities.forEach((act) => {
      const cat = act.category || 'ทั่วไป';
      const existing = map.get(cat) || { count: 0, hours: 0, color: act.color || '#6366F1' };
      const hours = calculateDurationHours(act.startTime, act.endTime);
      map.set(cat, {
        count: existing.count + 1,
        hours: Number((existing.hours + hours).toFixed(1)),
        color: existing.color || act.color || '#6366F1',
      });
    });

    const list = Array.from(map.entries())
      .map(([name, data]) => ({
        name,
        count: data.count,
        hours: data.hours,
        color: data.color,
        percent: totalPlannedHours > 0 ? Math.round((data.hours / totalPlannedHours) * 100) : 0,
      }))
      .filter((item) => item.count > 0)
      .sort((a, b) => b.hours - a.hours);

    return list;
  }, [activities, totalPlannedHours]);

  // Weekly breakdown for current week
  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate]);

  const weeklyData = useMemo(() => {
    return weekDates.map((dateStr, index) => {
      const [y, m, d] = dateStr.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      const dayName = THAI_DAYS_SHORT[dateObj.getDay()];

      const actsOnDay = activities.filter((a) => a.date === dateStr);
      const completedOnDay = actsOnDay.filter((a) => a.completed).length;
      const hoursOnDay = actsOnDay.reduce((acc, a) => {
        return acc + calculateDurationHours(a.startTime, a.endTime);
      }, 0);

      return {
        dateStr,
        dayName,
        dayNumber: d,
        totalActs: actsOnDay.length,
        completedActs: completedOnDay,
        hours: Number(hoursOnDay.toFixed(1)),
        isToday: dateStr === getTodayDateString(),
      };
    });
  }, [weekDates, activities]);

  // Max hours in week for scaling graph
  const maxWeeklyHours = Math.max(4, ...weeklyData.map((w) => w.hours));

  // Most focused category
  const topCategory = categoryStats.length > 0 ? categoryStats[0] : null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title Header */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>สถิติและภาพรวมผลผลิต (Productivity Insights)</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          วิเคราะห์เวลาที่ใช้ ความคืบหน้าของกิจกรรม และการกระจายตัวของงานในแต่ละหมวดหมู่
        </p>
      </div>

      {/* KPI 4 Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Activities */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            กิจกรรมทั้งหมด
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
              {totalActivities}
            </span>
            <span className="text-xs text-slate-400">รายการ</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">ในระบบทั้งหมด</p>
        </div>

        {/* Completed Activities */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            ทำเสร็จแล้ว
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
              {completedActivities}
            </span>
            <span className="text-xs text-slate-400">รายการ</span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-600/80 dark:text-emerald-400/80 font-medium">
            สำเร็จลุล่วง
          </p>
        </div>

        {/* Completion Rate */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            อัตราความสำเร็จ
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400 font-mono tabular-nums">
              {overallCompletionRate}%
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-indigo-600 dark:bg-indigo-500 h-1.5 rounded-full"
              style={{ width: `${overallCompletionRate}%` }}
            />
          </div>
        </div>

        {/* Total Planned Hours */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            เวลารวมที่วางแผน
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-amber-600 dark:text-amber-400 font-mono tabular-nums">
              {totalPlannedHours}
            </span>
            <span className="text-xs text-slate-400">ชั่วโมง</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">จากการรวมช่วงเวลากิจกรรม</p>
        </div>
      </div>

      {/* Main Charts Grid: Weekly Bar Chart + Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Weekly Activity Bar Chart (3 Cols on desktop) */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                กิจกรรมรายสัปดาห์ (Weekly Activity)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ชั่วโมงและจำนวนกิจกรรมของสัปดาห์ปัจจุบัน
              </p>
            </div>
            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded">
              สัปดาห์นี้
            </span>
          </div>

          {/* Bar Chart Container */}
          <div className="h-64 flex items-end justify-between gap-2 pt-8 pb-4 border-b border-slate-100 dark:border-slate-800 relative">
            {weeklyData.map((day, idx) => {
              const heightPercent = Math.max(8, Math.round((day.hours / maxWeeklyHours) * 100));
              const isHovered = activeTooltip === idx;

              return (
                <div
                  key={day.dateStr}
                  className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer"
                  onMouseEnter={() => setActiveTooltip(idx)}
                  onMouseLeave={() => setActiveTooltip(null)}
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-12 z-30 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[11px] px-2.5 py-1 rounded-lg shadow-lg pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
                      <div className="font-semibold">
                        {day.dayName} ({day.dayNumber})
                      </div>
                      <div className="tabular-nums">
                        {day.hours} ชม. · {day.completedActs}/{day.totalActs} รายการ
                      </div>
                    </div>
                  )}

                  {/* Top value */}
                  <span className="text-[10px] font-mono tabular-nums text-slate-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {day.hours}h
                  </span>

                  {/* The Bar */}
                  <div className="w-full max-w-[40px] bg-slate-100 dark:bg-slate-800 rounded-t-lg flex flex-col justify-end overflow-hidden h-full">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-300 ${
                        day.isToday
                          ? 'bg-indigo-600 dark:bg-indigo-500'
                          : 'bg-indigo-400/80 hover:bg-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-600'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>

                  {/* Day Label */}
                  <div className="mt-2 text-center">
                    <span
                      className={`text-xs font-semibold block ${
                        day.isToday
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {day.dayName}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {day.dayNumber}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
            <span>* วางเมาส์เหนือแท่งกราฟเพื่อดูสถิติเจาะจง</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              <span>วันนี้</span>
            </span>
          </div>
        </div>

        {/* Time by Category Breakdown (2 Cols on desktop) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              เวลาที่ใช้ตามหมวดหมู่
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              สัดส่วนชั่วโมงในแต่ละด้านของชีวิต
            </p>

            {categoryStats.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-400">
                ยังไม่มีข้อมูลหมวดหมู่
              </div>
            ) : (
              <div className="space-y-3.5">
                {categoryStats.map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.name}</span>
                        <span className="text-[11px] font-normal text-slate-400">
                          ({item.count} รายการ)
                        </span>
                      </span>
                      <span className="font-mono tabular-nums text-slate-600 dark:text-slate-400 font-medium">
                        {item.hours} ชม. ({item.percent}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${item.percent}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top category highlight box */}
          {topCategory && (
            <div className="mt-5 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 flex items-center gap-3">
              <Award className="w-5 h-5 text-amber-500 shrink-0" />
              <div className="text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  หมวดหมู่ที่คุณทุ่มเทเวลามากที่สุด
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  {topCategory.name} ใช้เวลาไปทั้งสิ้น {topCategory.hours} ชั่วโมง
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
