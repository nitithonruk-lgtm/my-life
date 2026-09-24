import React, { useState, useRef } from 'react';
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Laptop,
  User,
  Calendar,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { useSchedule } from '../../context/ScheduleContext';
import { exportAppData } from '../../utils/storage';
import { ConfirmDialog } from '../modals/ConfirmDialog';

export const SettingsView: React.FC = () => {
  const {
    preferences,
    updatePreferences,
    resetToSampleData,
    clearAllData,
    importData,
    activities,
    tasks,
  } = useSchedule();

  const [userNameInput, setUserNameInput] = useState(preferences.userName);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferences({ userName: userNameInput.trim() });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const success = importData(json);
        if (success) {
          setImportStatus('นำเข้าข้อมูลสำเร็จเรียบร้อย!');
        } else {
          setImportStatus('รูปแบบไฟล์ไม่ถูกต้อง');
        }
      } catch (err) {
        setImportStatus('ไม่สามารถอ่านไฟล์ JSON ได้');
      }
      setTimeout(() => setImportStatus(null), 3000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>การตั้งค่า (Settings)</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          ปรับแต่งรูปแบบการแสดงผล บัญชีผู้ใช้ และการสำรองข้อมูล
        </p>
      </div>

      {/* 1. Theme Setting */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            ธีมการแสดงผล (Appearance)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            เลือกธีมที่สบายตาที่สุดสำหรับการใช้งานของคุณ
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-md pt-1">
          {[
            { id: 'light', label: 'โหมดสว่าง', icon: Sun },
            { id: 'dark', label: 'โหมดมืด', icon: Moon },
            { id: 'system', label: 'ตามระบบ', icon: Laptop },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = preferences.theme === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => updatePreferences({ theme: item.id as any })}
                className={`p-3 rounded-xl border text-center flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold ring-1 ring-indigo-600'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. User Profile / Greeting Name */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            ชื่อผู้ใช้งาน (Display Name)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            ชื่อที่จะปรากฏในคำทักทายตอนเช้าและตอนบ่ายบนแถบด้านบน
          </p>
        </div>

        <form onSubmit={handleSaveName} className="flex items-center gap-2 max-w-md">
          <div className="relative flex-1">
            <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={userNameInput}
              onChange={(e) => setUserNameInput(e.target.value)}
              placeholder="กรอกชื่อของคุณ"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer shrink-0"
          >
            บันทึกชื่อ
          </button>
        </form>
        {saveSuccess && (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>บันทึกชื่อเรียบร้อยแล้ว</span>
          </p>
        )}
      </div>

      {/* 3. Thai Date Preferences */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            การแสดงปี พุทธศักราช (พ.ศ.)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            เลือกรูปแบบการแสดงผลปีเป็น พ.ศ. (เช่น 2569) หรือ ค.ศ. (เช่น 2026)
          </p>
        </div>

        <label className="flex items-center gap-3 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={preferences.buddhistYear}
            onChange={(e) => updatePreferences({ buddhistYear: e.target.checked })}
            className="w-4 h-4 rounded text-indigo-600 border-slate-300 dark:border-slate-700 focus:ring-indigo-500"
          />
          <span className="text-sm text-slate-700 dark:text-slate-300">
            แสดงปีเป็น พุทธศักราช (พ.ศ.)
          </span>
        </label>
      </div>

      {/* 4. Data Management: Export / Import / Reset / Clear */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            จัดการข้อมูลและการสำรอง (Data Management)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            ข้อมูลทั้งหมดถูกบันทึกไว้ใน LocalStorage ของเบราว์เซอร์คุณอย่างปลอดภัย
          </p>
        </div>

        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            ปัจจุบันมีกิจกรรม <strong>{activities.length}</strong> รายการ และงานที่ต้องทำ <strong>{tasks.length}</strong> รายการ
          </span>
        </div>

        {importStatus && (
          <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs flex items-center gap-2">
            <Info className="w-4 h-4" />
            <span>{importStatus}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Export JSON */}
          <button
            type="button"
            onClick={exportAppData}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-indigo-500" />
            <span>สำรองข้อมูล (Export JSON)</span>
          </button>

          {/* Import JSON */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4 text-indigo-500" />
              <span>นำเข้าข้อมูล (Import JSON)</span>
            </button>
          </div>

          {/* Reset to Sample Data */}
          <button
            type="button"
            onClick={() => setConfirmResetOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-amber-200 dark:border-amber-900 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-amber-700 dark:text-amber-400 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>รีเซ็ตเป็นข้อมูลตัวอย่าง</span>
          </button>

          {/* Clear All Data */}
          <button
            type="button"
            onClick={() => setConfirmClearOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-rose-200 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>ล้างข้อมูลทั้งหมด</span>
          </button>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={confirmResetOpen}
        title="ยืนยันการรีเซ็ตข้อมูล"
        message="การดำเนินการนี้จะโหลดข้อมูลตัวอย่างเริ่มต้นกลับมาแทนที่รายการเดิม คุณต้องการดำเนินการต่อหรือไม่?"
        confirmLabel="ยืนยันรีเซ็ต"
        cancelLabel="ยกเลิก"
        isDestructive={false}
        onConfirm={() => {
          resetToSampleData();
          setConfirmResetOpen(false);
        }}
        onCancel={() => setConfirmResetOpen(false)}
      />

      <ConfirmDialog
        isOpen={confirmClearOpen}
        title="ยืนยันการล้างข้อมูลทั้งหมด"
        message="กิจกรรมและงานทั้งหมดในระบบจะถูกลบทันที การกระทำนี้ไม่สามารถย้อนกลับได้ คุณแน่ใจหรือไม่?"
        confirmLabel="ล้างข้อมูลทั้งหมด"
        cancelLabel="ยกเลิก"
        isDestructive={true}
        onConfirm={() => {
          clearAllData();
          setConfirmClearOpen(false);
        }}
        onCancel={() => setConfirmClearOpen(false)}
      />
    </div>
  );
};
