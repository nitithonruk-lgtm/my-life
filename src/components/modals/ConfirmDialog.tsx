import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'ยืนยัน',
  cancelLabel = 'ยกเลิก',
  isDestructive = true,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transform transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
      >
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                isDestructive
                  ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400'
                  : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3
                id="confirm-dialog-title"
                className="text-base font-semibold text-slate-900 dark:text-white"
              >
                {title}
              </h3>
              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors cursor-pointer shadow-xs ${
                isDestructive
                  ? 'bg-rose-600 hover:bg-rose-700 focus-visible:ring-rose-500'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus-visible:ring-indigo-500'
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
