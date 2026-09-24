import React, { useState, useEffect } from 'react';
import { X, Calendar, AlertCircle } from 'lucide-react';
import { useSchedule } from '../../context/ScheduleContext';
import { Priority } from '../../types';
import { CATEGORIES } from '../../utils/constants';

export const TaskModal: React.FC = () => {
  const {
    isTaskModalOpen,
    closeTaskModal,
    taskToEdit,
    addTask,
    updateTask,
    selectedDate,
  } = useSchedule();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState('งาน');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isTaskModalOpen) {
      if (taskToEdit) {
        setTitle(taskToEdit.title);
        setDescription(taskToEdit.description || '');
        setDueDate(taskToEdit.dueDate || '');
        setPriority(taskToEdit.priority || 'medium');
        setCategory(taskToEdit.category || 'งาน');
      } else {
        setTitle('');
        setDescription('');
        setDueDate(selectedDate || '');
        setPriority('medium');
        setCategory('งาน');
      }
      setError(null);
    }
  }, [isTaskModalOpen, taskToEdit, selectedDate]);

  if (!isTaskModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('กรุณากรอกชื่องาน');
      return;
    }

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate || undefined,
        priority,
        category,
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate || undefined,
        priority,
        category,
        completed: false,
      });
    }

    closeTaskModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden my-auto"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {taskToEdit ? 'แก้ไขงานที่ต้องทำ' : 'เพิ่มงานใหม่'}
          </h2>
          <button
            type="button"
            onClick={closeTaskModal}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors cursor-pointer"
            aria-label="ปิด"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              ชื่องาน <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              placeholder="เช่น เตรียมเอกสารส่งบัญชี, โทรคุยกับลูกค้า"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              กำหนดส่ง (Due Date)
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
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
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                ความสำคัญ (Priority)
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="low">ต่ำ (Low)</option>
                <option value="medium">ปานกลาง (Medium)</option>
                <option value="high">สูง (High)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              รายละเอียดเพิ่มเติม
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="บันทึกรายละเอียด รายการย่อย หรือหมายเหตุ"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={closeTaskModal}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:scale-[0.98] shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
            >
              {taskToEdit ? 'บันทึกการแก้ไข' : 'เพิ่มงาน'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
