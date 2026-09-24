import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  CheckCircle2,
  Circle,
  Calendar,
  AlertCircle,
  Tag,
  Edit2,
  Trash2,
  Filter,
  CheckSquare,
} from 'lucide-react';
import { useSchedule } from '../../context/ScheduleContext';
import { Task, Priority } from '../../types';
import { formatThaiDateShort, getTodayDateString } from '../../utils/dateUtils';
import { ConfirmDialog } from '../modals/ConfirmDialog';

export const TasksView: React.FC = () => {
  const {
    tasks,
    toggleTaskComplete,
    deleteTask,
    openAddTaskModal,
    openEditTaskModal,
    preferences,
  } = useSchedule();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | Priority>('all');
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const todayStr = getTodayDateString();

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Status filter
      if (statusFilter === 'pending' && task.completed) return false;
      if (statusFilter === 'completed' && !task.completed) return false;

      // Priority filter
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(q);
        const matchDesc = task.description && task.description.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc) return false;
      }

      return true;
    });
  }, [tasks, statusFilter, priorityFilter, searchQuery]);

  // Counts
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = totalCount - completedCount;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header & Metrics Banner */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>งานที่ต้องทำ (Tasks)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            จัดการสิ่งที่ต้องทำโดยไม่ต้องผูกกับช่วงเวลาตายตัว
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
            <span className="tabular-nums">
              ค้างอยู่ <strong className="text-amber-600 dark:text-amber-400">{pendingCount}</strong>
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="tabular-nums">
              เสร็จแล้ว <strong className="text-emerald-600 dark:text-emerald-400">{completedCount}</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={openAddTaskModal}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มงานใหม่</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหางานตามชื่อหรือรายละเอียด..."
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Tabs */}
          <div className="inline-flex p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800">
            {(
              [
                { id: 'all', label: 'ทั้งหมด' },
                { id: 'pending', label: 'ยังไม่เสร็จ' },
                { id: 'completed', label: 'เสร็จแล้ว' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setStatusFilter(item.id)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  statusFilter === item.id
                    ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-700 dark:text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Priority Select */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as 'all' | Priority)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="all">ทุกระดับความสำคัญ</option>
            <option value="high">ความสำคัญสูง</option>
            <option value="medium">ความสำคัญปานกลาง</option>
            <option value="low">ความสำคัญต่ำ</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
            <CheckSquare className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            {tasks.length === 0 ? 'ยังไม่มีงานที่ต้องทำ' : 'ไม่พบงานที่ตรงตามตัวกรอง'}
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {tasks.length === 0
              ? 'บันทึกงานที่ต้องทำ เพื่อไม่ให้พลาดสิ่งสำคัญในชีวิตประจำวัน'
              : 'ลองเปลี่ยนคำค้นหาหรือตัวกรองเพื่อค้นหางานของคุณ'}
          </p>
          {tasks.length === 0 ? (
            <button
              type="button"
              onClick={openAddTaskModal}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มงานแรก</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setStatusFilter('all');
                setPriorityFilter('all');
                setSearchQuery('');
              }}
              className="mt-3 text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline cursor-pointer"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredTasks.map((task) => {
            const isOverdue =
              Boolean(task.dueDate) && !task.completed && task.dueDate! < todayStr;

            const priorityLabel =
              task.priority === 'high' ? 'สูง' : task.priority === 'medium' ? 'ปานกลาง' : 'ต่ำ';

            const priorityBadge =
              task.priority === 'high'
                ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900'
                : task.priority === 'medium'
                ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900'
                : 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900';

            return (
              <div
                key={task.id}
                className={`group flex items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl border transition-all ${
                  task.completed
                    ? 'bg-slate-50/70 border-slate-200/60 dark:bg-slate-900/40 dark:border-slate-800/60 opacity-75'
                    : 'bg-white border-slate-200 hover:border-indigo-300 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700 shadow-xs hover:shadow'
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Checkbox */}
                  <button
                    type="button"
                    onClick={() => toggleTaskComplete(task.id)}
                    className="mt-0.5 p-1 rounded text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer shrink-0"
                    title={task.completed ? 'ทำเครื่องหมายว่ายังไม่เสร็จ' : 'ทำเครื่องหมายว่าเสร็จแล้ว'}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 hover:text-slate-500 dark:text-slate-600" />
                    )}
                  </button>

                  {/* Task Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${priorityBadge}`}>
                        {priorityLabel}
                      </span>

                      {task.category && (
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          {task.category}
                        </span>
                      )}

                      {task.dueDate && (
                        <>
                          <span className="text-slate-300 dark:text-slate-700">·</span>
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-mono tabular-nums font-medium ${
                              isOverdue
                                ? 'text-rose-600 dark:text-rose-400 font-bold'
                                : 'text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            <Calendar className="w-3 h-3" />
                            <span>ครบกำหนด {formatThaiDateShort(task.dueDate, preferences.buddhistYear)}</span>
                            {isOverdue && <span>(เลยกำหนด)</span>}
                          </span>
                        </>
                      )}
                    </div>

                    <h4
                      className={`text-sm font-semibold ${
                        task.completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {task.title}
                    </h4>

                    {task.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEditTaskModal(task)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="แก้ไขงาน"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setTaskToDelete(task)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="ลบงาน"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Task Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(taskToDelete)}
        title="ยืนยันการลบงาน"
        message={`คุณต้องการลบงาน "${taskToDelete?.title}" ใช่หรือไม่?`}
        confirmLabel="ลบงาน"
        cancelLabel="ยกเลิก"
        isDestructive={true}
        onConfirm={() => {
          if (taskToDelete) {
            deleteTask(taskToDelete.id);
            setTaskToDelete(null);
          }
        }}
        onCancel={() => setTaskToDelete(null)}
      />
    </div>
  );
};
