import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  Circle,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  ChevronDown,
  Repeat,
  ArrowUpDown,
  LayoutList,
  Columns,
} from 'lucide-react';
import { Activity, Priority } from '../../types';
import { useSchedule } from '../../context/ScheduleContext';
import {
  timeToMinutes,
  minutesToTime,
  calculateDuration,
  isToday,
  getCurrentTimeHHMM,
} from '../../utils/dateUtils';
import { CATEGORIES } from '../../utils/constants';
import { ConfirmDialog } from '../modals/ConfirmDialog';

interface TimelineViewProps {
  activities: Activity[];
  selectedDate: string;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ activities, selectedDate }) => {
  const {
    openAddActivityModal,
    openEditActivityModal,
    openActivityDetail,
    toggleActivityComplete,
    deleteActivity,
    updateActivity,
    shiftActivityTime,
  } = useSchedule();

  const [viewStyle, setViewStyle] = useState<'timeline' | 'agenda'>('timeline');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(null);

  const timelineContainerRef = useRef<HTMLDivElement>(null);

  // Filter activities
  const filteredActivities = useMemo(() => {
    return activities
      .filter((act) => {
        const matchesCategory =
          selectedCategory === 'all' || act.category === selectedCategory;
        const matchesSearch =
          !searchQuery.trim() ||
          act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (act.description && act.description.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
  }, [activities, selectedCategory, searchQuery]);

  // Scroll to current time or first activity on mount
  useEffect(() => {
    if (viewStyle === 'timeline' && timelineContainerRef.current) {
      if (isToday(selectedDate)) {
        const nowMin = timeToMinutes(getCurrentTimeHHMM());
        // Scroll so current hour is near the top
        const scrollPos = Math.max(0, (nowMin / 60) * 64 - 100);
        timelineContainerRef.current.scrollTop = scrollPos;
      } else if (filteredActivities.length > 0) {
        const firstMin = timeToMinutes(filteredActivities[0].startTime);
        const scrollPos = Math.max(0, (firstMin / 60) * 64 - 80);
        timelineContainerRef.current.scrollTop = scrollPos;
      }
    }
  }, [selectedDate, viewStyle, filteredActivities]);

  const currentMinutes = isToday(selectedDate) ? timeToMinutes(getCurrentTimeHHMM()) : -1;

  // 24 hours array (0..23)
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="space-y-4">
      {/* Control Bar: Search, Category Filter, View Mode Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหากิจกรรม..."
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">ทุกหมวดหมู่</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 self-end sm:self-auto p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button
            type="button"
            onClick={() => setViewStyle('timeline')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              viewStyle === 'timeline'
                ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-700 dark:text-white font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>ไทม์ไลน์ 24 ชม.</span>
          </button>
          <button
            type="button"
            onClick={() => setViewStyle('agenda')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              viewStyle === 'agenda'
                ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-700 dark:text-white font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LayoutList className="w-3.5 h-3.5" />
            <span>ตามลำดับเวลา</span>
          </button>
        </div>
      </div>

      {/* Main Content: Timeline vs Agenda */}
      {filteredActivities.length === 0 && activities.length === 0 ? (
        // Empty State: No activities for today
        <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            ยังไม่มีกิจกรรมในวันนี้
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            เริ่มต้นวันอย่างมีเป้าหมาย ด้วยการวางแผนกิจกรรมและช่วงเวลาที่คุณต้องการทำให้สำเร็จ
          </p>
          <button
            type="button"
            onClick={() => openAddActivityModal(selectedDate, '09:00')}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มกิจกรรมแรกของวัน</span>
          </button>
        </div>
      ) : filteredActivities.length === 0 ? (
        // Search or Filter Empty State
        <div className="text-center py-12 px-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            ไม่พบกิจกรรมที่ตรงกับคำค้นหาหรือหมวดหมู่ที่เลือก
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="mt-3 text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline cursor-pointer"
          >
            ล้างตัวกรองทั้งหมด
          </button>
        </div>
      ) : viewStyle === 'timeline' ? (
        /* 24-Hour Timeline Grid */
        <div
          ref={timelineContainerRef}
          className="relative bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-y-auto max-h-[640px] shadow-xs"
        >
          {/* Timeline hours */}
          <div className="relative min-w-[320px] py-4">
            {/* Current Time Indicator Line if viewing today */}
            {currentMinutes >= 0 && (
              <div
                className="absolute left-16 right-0 z-20 flex items-center pointer-events-none"
                style={{ top: `${(currentMinutes / 60) * 64 + 16}px` }}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 -ml-1.5 shadow-sm" />
                <div className="flex-1 h-[2px] bg-rose-500 shadow-xs" />
                <span className="text-[10px] font-mono font-bold bg-rose-500 text-white px-1.5 py-0.5 rounded-l ml-auto shadow-xs">
                  {getCurrentTimeHHMM()}
                </span>
              </div>
            )}

            {hours.map((hour) => {
              const hourStr = `${String(hour).padStart(2, '0')}:00`;
              const hourStartMin = hour * 60;
              const hourEndMin = (hour + 1) * 60;

              // Find activities that start in this hour
              const actsInHour = filteredActivities.filter((act) => {
                const startMin = timeToMinutes(act.startTime);
                return startMin >= hourStartMin && startMin < hourEndMin;
              });

              return (
                <div
                  key={hour}
                  className="group relative flex min-h-[64px] border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  {/* Left Hour Label */}
                  <div className="w-16 px-3 py-1 flex items-start justify-end shrink-0 border-r border-slate-100 dark:border-slate-800 select-none">
                    <span className="text-xs font-mono tabular-nums text-slate-400 dark:text-slate-500 font-medium">
                      {hourStr}
                    </span>
                  </div>

                  {/* Right slot */}
                  <div className="flex-1 p-1.5 relative">
                    {/* Quick Add Slot button on hover if slot is free */}
                    {actsInHour.length === 0 && (
                      <button
                        type="button"
                        onClick={() => openAddActivityModal(selectedDate, hourStr)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity absolute inset-1 rounded border border-dashed border-indigo-200 dark:border-indigo-800/60 text-indigo-500 text-xs flex items-center justify-center gap-1 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>+ เพิ่มกิจกรรมเวลา {hourStr}</span>
                      </button>
                    )}

                    {/* Render Activities that begin in this hour */}
                    <div className="space-y-1.5">
                      {actsInHour.map((act) => (
                        <TimelineActivityCard
                          key={act.id}
                          activity={act}
                          onToggleComplete={() => toggleActivityComplete(act.id)}
                          onCardClick={() => openActivityDetail(act)}
                          onEdit={() => openEditActivityModal(act)}
                          onDelete={() => setActivityToDelete(act)}
                          onShift={(minutes) => shiftActivityTime(act.id, minutes)}
                          onChangePriority={(newPriority) =>
                            updateActivity(act.id, { priority: newPriority })
                          }
                          onChangeCategory={(newCategory) =>
                            updateActivity(act.id, { category: newCategory })
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Agenda Sequential List View */
        <div className="space-y-2.5">
          {filteredActivities.map((act) => (
            <TimelineActivityCard
              key={act.id}
              activity={act}
              isAgendaView={true}
              onToggleComplete={() => toggleActivityComplete(act.id)}
              onCardClick={() => openActivityDetail(act)}
              onEdit={() => openEditActivityModal(act)}
              onDelete={() => setActivityToDelete(act)}
              onShift={(minutes) => shiftActivityTime(act.id, minutes)}
              onChangePriority={(newPriority) =>
                updateActivity(act.id, { priority: newPriority })
              }
              onChangeCategory={(newCategory) =>
                updateActivity(act.id, { category: newCategory })
              }
            />
          ))}
        </div>
      )}

      {/* Confirmation Dialog before deleting an activity */}
      <ConfirmDialog
        isOpen={Boolean(activityToDelete)}
        title="ยืนยันการลบกิจกรรม"
        message={`คุณต้องการลบกิจกรรม "${activityToDelete?.title}" ออกจากตารางใช่หรือไม่?`}
        confirmLabel="ลบกิจกรรม"
        cancelLabel="ยกเลิก"
        isDestructive={true}
        onConfirm={() => {
          if (activityToDelete) {
            deleteActivity(activityToDelete.id);
            setActivityToDelete(null);
          }
        }}
        onCancel={() => setActivityToDelete(null)}
      />
    </div>
  );
};

interface TimelineActivityCardProps {
  activity: Activity;
  isAgendaView?: boolean;
  onToggleComplete: () => void;
  onCardClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onShift: (minutes: number) => void;
  onChangePriority: (priority: Priority) => void;
  onChangeCategory: (category: string) => void;
}

const TimelineActivityCard: React.FC<TimelineActivityCardProps> = ({
  activity,
  isAgendaView = false,
  onToggleComplete,
  onCardClick,
  onEdit,
  onDelete,
  onShift,
  onChangePriority,
  onChangeCategory,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const duration = calculateDuration(activity.startTime, activity.endTime);

  const priorityLabel =
    activity.priority === 'high' ? 'สูง' : activity.priority === 'medium' ? 'ปานกลาง' : 'ต่ำ';

  const priorityBadge =
    activity.priority === 'high'
      ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400'
      : activity.priority === 'medium'
      ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400'
      : 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400';

  return (
    <div
      className={`group relative flex items-center justify-between gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
        activity.completed
          ? 'bg-slate-50/70 border-slate-200/70 dark:bg-slate-900/40 dark:border-slate-800/60 opacity-80'
          : 'bg-white border-slate-200 hover:border-indigo-300 dark:bg-slate-800/90 dark:border-slate-700/80 dark:hover:border-indigo-500 shadow-xs hover:shadow'
      }`}
      onClick={(e) => {
        // If clicked on buttons/inputs, don't trigger card modal
        if ((e.target as HTMLElement).closest('button, select, input')) return;
        onCardClick();
      }}
    >
      {/* Left accent bar matching activity color */}
      <div
        className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full"
        style={{ backgroundColor: activity.color || '#6366F1' }}
      />

      <div className="flex items-start sm:items-center gap-3 pl-2 flex-1 min-w-0">
        {/* Completed Checkbox button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete();
          }}
          className="mt-0.5 sm:mt-0 p-1 rounded-md text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
          title={activity.completed ? 'ทำเครื่องหมายว่ายังไม่เสร็จ' : 'ทำเครื่องหมายว่าเสร็จแล้ว'}
          aria-label={activity.completed ? 'เสร็จแล้ว' : 'ยังไม่เสร็จ'}
        >
          {activity.completed ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Circle className="w-5 h-5 text-slate-300 hover:text-slate-500 dark:text-slate-600" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            {/* Time */}
            <span className="font-mono text-xs font-semibold tabular-nums text-indigo-600 dark:text-indigo-400">
              {activity.startTime} – {activity.endTime}
            </span>
            <span className="text-[11px] text-slate-400 font-normal">({duration})</span>

            <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">·</span>

            {/* Category */}
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              {activity.category}
            </span>

            <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">·</span>

            {/* Priority */}
            <span className={`text-[11px] px-1.5 py-0.5 rounded font-medium ${priorityBadge}`}>
              {priorityLabel}
            </span>

            {activity.recurring && (
              <span className="inline-flex items-center gap-0.5 text-[11px] text-indigo-500 dark:text-indigo-400 font-medium">
                <Repeat className="w-3 h-3" />
                <span>
                  {activity.repeatType === 'daily'
                    ? 'ทุกวัน'
                    : activity.repeatType === 'weekly'
                    ? 'ทุกสัปดาห์'
                    : 'ทุกเดือน'}
                </span>
              </span>
            )}
          </div>

          <h4
            className={`text-sm font-semibold truncate ${
              activity.completed
                ? 'line-through text-slate-400 dark:text-slate-500'
                : 'text-slate-900 dark:text-white'
            }`}
          >
            {activity.title}
          </h4>

          {activity.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {activity.description}
            </p>
          )}
        </div>
      </div>

      {/* Right Actions: Quick Shift, Edit, Delete */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Quick Shift Time Buttons (Visible on hover on desktop, or inside menu) */}
        <div className="hidden sm:flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onShift(-15);
            }}
            className="px-1.5 py-1 text-[10px] rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="เลื่อนเวลาเร็วขึ้น 15 นาที"
          >
            -15m
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onShift(15);
            }}
            className="px-1.5 py-1 text-[10px] rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="เลื่อนเวลาช้าลง 15 นาที"
          >
            +15m
          </button>
        </div>

        {/* Edit Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="แก้ไขกิจกรรม"
          aria-label="แก้ไข"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>

        {/* Delete Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="ลบกิจกรรม"
          aria-label="ลบ"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
