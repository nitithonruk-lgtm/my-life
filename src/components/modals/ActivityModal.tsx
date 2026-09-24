import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { useSchedule } from '../../context/ScheduleContext';
import { Priority, RepeatType } from '../../types';
import { CATEGORIES, COLOR_PALETTE } from '../../utils/constants';
import { isEndTimeValid, calculateDuration } from '../../utils/dateUtils';

export const ActivityModal: React.FC = () => {
  const {
    isActivityModalOpen,
    closeActivityModal,
    activityToEdit,
    activityPresetDate,
    activityPresetTime,
    addActivity,
    updateActivity,
  } = useSchedule();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('งาน');
  const [customCategory, setCustomCategory] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [color, setColor] = useState(COLOR_PALETTE[0].value);
  const [recurring, setRecurring] = useState(false);
  const [repeatType, setRepeatType] = useState<RepeatType>('daily');

  // Form errors
  const [errors, setErrors] = useState<{
    title?: string;
    date?: string;
    time?: string;
  }>({});

  // Reset or initialize form
  useEffect(() => {
    if (isActivityModalOpen) {
      if (activityToEdit) {
        setTitle(activityToEdit.title);
        setDate(activityToEdit.date);
        setStartTime(activityToEdit.startTime);
        setEndTime(activityToEdit.endTime);
        setDescription(activityToEdit.description || '');
        setPriority(activityToEdit.priority || 'medium');
        setColor(activityToEdit.color || COLOR_PALETTE[0].value);
        setRecurring(Boolean(activityToEdit.recurring));
        setRepeatType(activityToEdit.repeatType || 'daily');

        const existingCat = CATEGORIES.find((c) => c.name === activityToEdit.category);
        if (existingCat) {
          setCategory(activityToEdit.category);
          setCustomCategory('');
        } else {
          setCategory('other');
          setCustomCategory(activityToEdit.category);
        }
      } else {
        setTitle('');
        setDate(activityPresetDate || new Date().toISOString().slice(0, 10));
        const start = activityPresetTime || '09:00';
        setStartTime(start);
        // Default end time +1 hour
        const [h, m] = start.split(':').map(Number);
        const endH = String(Math.min(23, (h || 9) + 1)).padStart(2, '0');
        setEndTime(`${endH}:${String(m || 0).padStart(2, '0')}`);
        setDescription('');
        setCategory('งาน');
        setCustomCategory('');
        setPriority('medium');
        setColor(COLOR_PALETTE[0].value);
        setRecurring(false);
        setRepeatType('daily');
      }
      setErrors({});
    }
  }, [isActivityModalOpen, activityToEdit, activityPresetDate, activityPresetTime]);

  if (!isActivityModalOpen) return null;

  const durationStr = startTime && endTime && isEndTimeValid(startTime, endTime)
    ? calculateDuration(startTime, endTime)
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};

    if (!title.trim()) {
      newErrors.title = 'กรุณากรอกชื่อกิจกรรม';
    }

    if (!date) {
      newErrors.date = 'กรุณาเลือกวันที่';
    }

    if (!startTime || !endTime) {
      newErrors.time = 'กรุณาระบุทั้งเวลาเริ่มต้นและเวลาสิ้นสุด';
    } else if (!isEndTimeValid(startTime, endTime)) {
      newErrors.time = 'เวลาสิ้นสุดต้องมากกว่าเวลาเริ่มต้น';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const finalCategory = category === 'other' ? (customCategory.trim() || 'ทั่วไป') : category;

    if (activityToEdit) {
      updateActivity(activityToEdit.id, {
        title: title.trim(),
        date,
        startTime,
        endTime,
        description: description.trim(),
        category: finalCategory,
        priority,
        color,
        recurring,
        repeatType: recurring ? repeatType : undefined,
      });
    } else {
      addActivity({
        title: title.trim(),
        date,
        startTime,
        endTime,
        description: description.trim(),
        category: finalCategory,
        priority,
        color,
        completed: false,
        recurring,
        repeatType: recurring ? repeatType : undefined,
      });
    }

    closeActivityModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden my-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div
              className="w-3.5 h-3.5 rounded-full"
              style={{ backgroundColor: color }}
            />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {activityToEdit ? 'แก้ไขกิจกรรม' : 'เพิ่มกิจกรรมใหม่'}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeActivityModal}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors cursor-pointer"
            aria-label="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* General Error Banner */}
          {errors.time && (
            <div className="flex items-center gap-2 p-3 text-xs text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.time}</span>
            </div>
          )}

          {/* Activity Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              ชื่อกิจกรรม <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="เช่น ออกกำลังกาย, ประชุมทีม, ทำงานโปรเจกต์"
              className={`w-full px-3.5 py-2 text-sm rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                errors.title
                  ? 'border-rose-300 focus:ring-rose-500 dark:border-rose-700'
                  : 'border-slate-300 focus:ring-indigo-500 dark:border-slate-700'
              }`}
            />
            {errors.title && (
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              วันที่ <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }));
                }}
                className={`w-full px-3.5 py-2 text-sm rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                  errors.date
                    ? 'border-rose-300 focus:ring-rose-500 dark:border-rose-700'
                    : 'border-slate-300 focus:ring-indigo-500 dark:border-slate-700'
                }`}
              />
            </div>
            {errors.date && (
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.date}</p>
            )}
          </div>

          {/* Time: Start & End */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                เวลาเริ่ม <span className="text-rose-500">*</span>
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  if (errors.time) setErrors((prev) => ({ ...prev, time: undefined }));
                }}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                เวลาสิ้นสุด <span className="text-rose-500">*</span>
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => {
                  setEndTime(e.target.value);
                  if (errors.time) setErrors((prev) => ({ ...prev, time: undefined }));
                }}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>

          {durationStr && (
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>ระยะเวลารวม: {durationStr}</span>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              รายละเอียด
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="บันทึกรายละเอียดเพิ่มเติม เช่น สถานที่ ลิงก์ประชุม หรือเป้าหมายย่อย"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                หมวดหมู่
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
                <option value="other">หมวดหมู่อื่นๆ...</option>
              </select>
              {category === 'other' && (
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="ระบุชื่อหมวดหมู่"
                  className="mt-2 w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                ระดับความสำคัญ (Priority)
              </label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                {(['low', 'medium', 'high'] as Priority[]).map((p) => {
                  const label = p === 'low' ? 'ต่ำ' : p === 'medium' ? 'ปานกลาง' : 'สูง';
                  const isSelected = priority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                        isSelected
                          ? p === 'high'
                            ? 'bg-rose-500 text-white shadow-xs'
                            : p === 'medium'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Color Palette Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              สีของกิจกรรม
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  title={c.name}
                  className={`w-7 h-7 rounded-full transition-transform cursor-pointer flex items-center justify-center ${
                    color === c.value
                      ? 'scale-110 ring-2 ring-offset-2 ring-slate-900 dark:ring-white dark:ring-offset-slate-900'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.value }}
                >
                  {color === c.value && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Recurring Options */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={recurring}
                onChange={(e) => setRecurring(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 border-slate-300 dark:border-slate-700 focus:ring-indigo-500"
              />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                ทำซ้ำเป็นประจำ (Recurring)
              </span>
            </label>

            {recurring && (
              <div className="flex items-center gap-2 pl-6">
                <span className="text-xs text-slate-500 dark:text-slate-400">รอบการทำซ้ำ:</span>
                <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5">
                  {(
                    [
                      { id: 'daily', label: 'ทุกวัน' },
                      { id: 'weekly', label: 'ทุกสัปดาห์' },
                      { id: 'monthly', label: 'ทุกเดือน' },
                    ] as { id: RepeatType; label: string }[]
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRepeatType(item.id)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                        repeatType === item.id
                          ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-700 dark:text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={closeActivityModal}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:scale-[0.98] shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
            >
              {activityToEdit ? 'บันทึกการแก้ไข' : 'เพิ่มกิจกรรม'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
