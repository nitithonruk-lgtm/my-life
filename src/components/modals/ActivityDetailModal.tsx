import React, { useState } from 'react';
import {
  X,
  Clock,
  Calendar,
  Tag,
  CheckCircle2,
  Circle,
  Edit2,
  Trash2,
  Repeat,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { useSchedule } from '../../context/ScheduleContext';
import {
  formatThaiDateFull,
  calculateDuration,
  formatThaiDateShort,
} from '../../utils/dateUtils';
import { ConfirmDialog } from './ConfirmDialog';

export const ActivityDetailModal: React.FC = () => {
  const {
    activityDetailItem,
    closeActivityDetail,
    toggleActivityComplete,
    deleteActivity,
    openEditActivityModal,
    preferences,
    shiftActivityTime,
  } = useSchedule();

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  if (!activityDetailItem) return null;

  const {
    id,
    title,
    description,
    date,
    startTime,
    endTime,
    category,
    priority,
    color,
    completed,
    recurring,
    repeatType,
  } = activityDetailItem;

  const duration = calculateDuration(startTime, endTime);
  const thaiDate = formatThaiDateFull(date, preferences.buddhistYear);

  const priorityLabel =
    priority === 'high' ? 'ความสำคัญสูง' : priority === 'medium' ? 'ความสำคัญปานกลาง' : 'ความสำคัญปกติ';

  const priorityColor =
    priority === 'high'
      ? 'text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900'
      : priority === 'medium'
      ? 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900'
      : 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900';

  const repeatLabel =
    repeatType === 'daily' ? 'ทุกวัน' : repeatType === 'weekly' ? 'ทุกสัปดาห์' : 'ทุกเดือน';

  const handleDelete = () => {
    deleteActivity(id);
    setIsConfirmDeleteOpen(false);
    closeActivityDetail();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
        <div
          className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden my-auto"
          role="dialog"
          aria-modal="true"
        >
          {/* Top Banner with color indicator */}
          <div
            className="h-3 w-full"
            style={{ backgroundColor: color || '#6366F1' }}
          />

          <div className="p-6">
            {/* Header: Title, Completed Checkbox, Close Button */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${priorityColor}`}
                  >
                    {priorityLabel}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    <Tag className="w-3 h-3" />
                    {category}
                  </span>
                  {recurring && (
                    <span className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                      <Repeat className="w-3 h-3" />
                      {repeatLabel}
                    </span>
                  )}
                </div>

                <h2
                  className={`text-lg sm:text-xl font-bold text-slate-900 dark:text-white ${
                    completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
                  }`}
                >
                  {title}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeActivityDetail}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors cursor-pointer"
                aria-label="ปิด"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Time & Date Block */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>{thaiDate}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
                <span className="font-mono tabular-nums font-semibold">
                  {startTime} – {endTime}
                </span>
                <span className="text-slate-400 text-xs">({duration})</span>
              </div>
            </div>

            {/* Shift Time buttons for quick rescheduling */}
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
              <span>เลื่อนเวลาเร็ว:</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => shiftActivityTime(id, -15)}
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  -15 นาที
                </button>
                <button
                  type="button"
                  onClick={() => shiftActivityTime(id, -30)}
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  -30 นาที
                </button>
                <button
                  type="button"
                  onClick={() => shiftActivityTime(id, 15)}
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  +15 นาที
                </button>
                <button
                  type="button"
                  onClick={() => shiftActivityTime(id, 30)}
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  +30 นาที
                </button>
              </div>
            </div>

            {/* Description */}
            {description ? (
              <div className="mt-4">
                <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  รายละเอียด
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {description}
                </p>
              </div>
            ) : (
              <p className="mt-4 text-xs italic text-slate-400 dark:text-slate-500">
                ไม่มีรายละเอียดเพิ่มเติมสำหรับกิจกรรมนี้
              </p>
            )}

            {/* Quick Status toggle button */}
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => toggleActivityComplete(id)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                  completed
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {completed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>ทำเสร็จแล้ว (คลิกเพื่อยกเลิก)</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4 text-slate-400" />
                    <span>ทำเครื่องหมายว่าเสร็จแล้ว</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    closeActivityDetail();
                    openEditActivityModal(activityDetailItem);
                  }}
                  className="p-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-400 dark:hover:text-indigo-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="แก้ไขกิจกรรม"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsConfirmDeleteOpen(true)}
                  className="p-2 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="ลบกิจกรรม"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog before delete */}
      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        title="ยืนยันการลบกิจกรรม"
        message={`คุณต้องการลบกิจกรรม "${title}" ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`}
        confirmLabel="ลบกิจกรรม"
        cancelLabel="ยกเลิก"
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmDeleteOpen(false)}
      />
    </>
  );
};
