import { CategoryInfo, Activity, Task, UserPreferences } from '../types';
import { getTodayDateString, addDays } from './dateUtils';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'work',
    name: 'งาน',
    color: '#6366F1', // Primary Indigo
    bgLight: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    bgDark: 'dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-300',
    textLight: 'text-indigo-600',
    textDark: 'dark:text-indigo-400',
    iconName: 'Briefcase',
  },
  {
    id: 'health',
    name: 'สุขภาพ',
    color: '#22C55E', // Success Green
    bgLight: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    bgDark: 'dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300',
    textLight: 'text-emerald-600',
    textDark: 'dark:text-emerald-400',
    iconName: 'Activity',
  },
  {
    id: 'personal',
    name: 'ส่วนตัว',
    color: '#EC4899', // Pink / Rose
    bgLight: 'bg-pink-50 border-pink-200 text-pink-700',
    bgDark: 'dark:bg-pink-950/40 dark:border-pink-800 dark:text-pink-300',
    textLight: 'text-pink-600',
    textDark: 'dark:text-pink-400',
    iconName: 'User',
  },
  {
    id: 'learning',
    name: 'การเรียนรู้',
    color: '#F59E0B', // Warning Amber
    bgLight: 'bg-amber-50 border-amber-200 text-amber-700',
    bgDark: 'dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300',
    textLight: 'text-amber-600',
    textDark: 'dark:text-amber-400',
    iconName: 'BookOpen',
  },
  {
    id: 'finance',
    name: 'การเงิน',
    color: '#0EA5E9', // Sky blue
    bgLight: 'bg-sky-50 border-sky-200 text-sky-700',
    bgDark: 'dark:bg-sky-950/40 dark:border-sky-800 dark:text-sky-300',
    textLight: 'text-sky-600',
    textDark: 'dark:text-sky-400',
    iconName: 'DollarSign',
  },
  {
    id: 'general',
    name: 'ทั่วไป',
    color: '#8B5CF6', // Purple
    bgLight: 'bg-purple-50 border-purple-200 text-purple-700',
    bgDark: 'dark:bg-purple-950/40 dark:border-purple-800 dark:text-purple-300',
    textLight: 'text-purple-600',
    textDark: 'dark:text-purple-400',
    iconName: 'Compass',
  },
];

export const COLOR_PALETTE = [
  { name: 'Indigo (หลัก)', value: '#6366F1' },
  { name: 'เขียวสด (สุขภาพ)', value: '#22C55E' },
  { name: 'ฟ้าคราม', value: '#3B82F6' },
  { name: 'ส้มอำพัน (การเรียนรู้)', value: '#F59E0B' },
  { name: 'ชมพูกุหลาบ (ส่วนตัว)', value: '#EC4899' },
  { name: 'ม่วงเข้ม', value: '#8B5CF6' },
  { name: 'แดงเข้ม (ด่วน)', value: '#EF4444' },
  { name: 'ฟ้าทะเล', value: '#06B6D4' },
];

export const DEFAULT_PREFERENCES: UserPreferences = {
  userName: 'ณิธิกร',
  theme: 'light',
  buddhistYear: false,
  soundEnabled: true,
};

/**
 * Generate rich initial sample data relative to today so the app feels alive immediately
 */
export function getInitialActivities(): Activity[] {
  const today = getTodayDateString();
  const yesterday = addDays(today, -1);
  const tomorrow = addDays(today, 1);
  const inTwoDays = addDays(today, 2);

  return [
    // Today's activities
    {
      id: 'act-1',
      title: 'ออกกำลังกาย',
      description: 'วิ่งจ๊อกกิ้งรอบสวนและยืดกล้ามเนื้อ 30 นาที',
      date: today,
      startTime: '08:00',
      endTime: '09:00',
      category: 'สุขภาพ',
      priority: 'medium',
      color: '#22C55E',
      completed: true,
      recurring: true,
      repeatType: 'daily',
      createdAt: '2026-09-20T08:00:00.000Z',
    },
    {
      id: 'act-2',
      title: 'ทำงานโปรเจกต์',
      description: 'พัฒนา Frontend ส่วนประกอบ Dashboard และออกแบบ API Spec ร่วมกับทีม',
      date: today,
      startTime: '09:30',
      endTime: '12:00',
      category: 'งาน',
      priority: 'high',
      color: '#6366F1',
      completed: true,
      recurring: false,
      createdAt: '2026-09-21T09:00:00.000Z',
    },
    {
      id: 'act-3',
      title: 'พักกลางวัน',
      description: 'รับประทานอาหารกลางวันและพักผ่อนฟังเพลง',
      date: today,
      startTime: '12:00',
      endTime: '13:00',
      category: 'ส่วนตัว',
      priority: 'low',
      color: '#EC4899',
      completed: true,
      recurring: true,
      repeatType: 'daily',
      createdAt: '2026-09-20T12:00:00.000Z',
    },
    {
      id: 'act-4',
      title: 'ประชุมทีม',
      description: 'ประชุมความคืบหน้ารอบสัปดาห์ (Weekly Standup) และวางแผน Sprint ถัดไป',
      date: today,
      startTime: '14:00',
      endTime: '15:00',
      category: 'งาน',
      priority: 'high',
      color: '#6366F1',
      completed: false,
      recurring: true,
      repeatType: 'weekly',
      createdAt: '2026-09-22T10:00:00.000Z',
    },
    {
      id: 'act-5',
      title: 'ทบทวนโค้ดและส่งรายงานความคืบหน้า',
      description: 'Code Review ดึง Pull Requests ของเพื่อนในทีม และสรุป Daily Checklist',
      date: today,
      startTime: '16:00',
      endTime: '17:30',
      category: 'งาน',
      priority: 'medium',
      color: '#3B82F6',
      completed: false,
      recurring: false,
      createdAt: '2026-09-23T11:00:00.000Z',
    },
    {
      id: 'act-6',
      title: 'อ่านหนังสือ',
      description: 'อ่านหนังสือด้านการออกแบบระบบและจิตวิทยาการทำงาน บทที่ 4-5',
      date: today,
      startTime: '18:00',
      endTime: '19:00',
      category: 'การเรียนรู้',
      priority: 'medium',
      color: '#F59E0B',
      completed: false,
      recurring: true,
      repeatType: 'daily',
      createdAt: '2026-09-21T18:00:00.000Z',
    },
    {
      id: 'act-7',
      title: 'วางแผนเป้าหมายสัปดาห์หน้า',
      description: 'จดบันทึกสิ่งที่ทำสำเร็จในสัปดาห์นี้และตั้งเป้าหมายสัปดาห์ถัดไป',
      date: today,
      startTime: '20:30',
      endTime: '21:15',
      category: 'ส่วนตัว',
      priority: 'low',
      color: '#8B5CF6',
      completed: false,
      recurring: false,
      createdAt: '2026-09-23T20:00:00.000Z',
    },
    // Yesterday's activities for realistic statistics
    {
      id: 'act-8',
      title: 'วิ่งออกกำลังกายตอนเช้า',
      description: 'วิ่ง 5 กิโลเมตร',
      date: yesterday,
      startTime: '07:30',
      endTime: '08:30',
      category: 'สุขภาพ',
      priority: 'medium',
      color: '#22C55E',
      completed: true,
      recurring: true,
      repeatType: 'daily',
    },
    {
      id: 'act-9',
      title: 'ตรวจสอบบัญชีและงบประมาณประจำเดือน',
      description: 'สรุปรายรับ-รายจ่าย',
      date: yesterday,
      startTime: '19:30',
      endTime: '20:30',
      category: 'การเงิน',
      priority: 'high',
      color: '#0EA5E9',
      completed: true,
      recurring: true,
      repeatType: 'monthly',
    },
    // Tomorrow's activities
    {
      id: 'act-10',
      title: 'เวิร์กช็อปออนไลน์ Clean Architecture',
      description: 'เรียนสดออนไลน์ผ่าน Zoom',
      date: tomorrow,
      startTime: '10:00',
      endTime: '12:00',
      category: 'การเรียนรู้',
      priority: 'high',
      color: '#F59E0B',
      completed: false,
      recurring: false,
    },
    {
      id: 'act-11',
      title: 'นัดทานข้าวกับครอบครัว',
      description: 'ร้านอาหารริมน้ำ ฉลองวันเกิด',
      date: inTwoDays,
      startTime: '18:00',
      endTime: '20:00',
      category: 'ส่วนตัว',
      priority: 'medium',
      color: '#EC4899',
      completed: false,
      recurring: false,
    },
  ];
}

export function getInitialTasks(): Task[] {
  const today = getTodayDateString();
  const tomorrow = addDays(today, 1);
  const nextWeek = addDays(today, 5);

  return [
    {
      id: 'task-1',
      title: 'เตรียมสไลด์นำเสนอแผนงานประจำไตรมาส',
      description: 'รวบรวมตัวเลขผลงาน Q3 และกลยุทธ์การขยายผู้ใช้งานใน Q4',
      dueDate: tomorrow,
      priority: 'high',
      completed: false,
      category: 'งาน',
      createdAt: '2026-09-22T08:00:00.000Z',
    },
    {
      id: 'task-2',
      title: 'ส่งเอกสารใบเสร็จเบิกค่าเดินทาง',
      description: 'แนบใบเสร็จค่าแท็กซี่และค่ารถไฟฟ้าของสัปดาห์ที่แล้วเข้าระบบ HR',
      dueDate: tomorrow,
      priority: 'medium',
      completed: false,
      category: 'การเงิน',
      createdAt: '2026-09-23T09:00:00.000Z',
    },
    {
      id: 'task-3',
      title: 'ต่ออายุสมาชิกฟิตเนสประจำปี',
      description: 'ชำระค่าสมาชิกรับโปรโมชันลด 15%',
      dueDate: today,
      priority: 'low',
      completed: true,
      category: 'สุขภาพ',
      createdAt: '2026-09-20T10:00:00.000Z',
    },
    {
      id: 'task-4',
      title: 'อัปเดตเรซูเมและพอร์ตฟอลิโอผลงาน',
      description: 'เพิ่มโปรเจกต์ DailyFlow และเทคโนโลยี React 19 ลงบนหน้า GitHub',
      dueDate: nextWeek,
      priority: 'medium',
      completed: false,
      category: 'การเรียนรู้',
      createdAt: '2026-09-21T14:00:00.000Z',
    },
    {
      id: 'task-5',
      title: 'จัดระเบียบไฟล์เอกสารในคอมพิวเตอร์และสำรองข้อมูล',
      description: 'แบ็กอัปงานใส่ External Drive และคลาวด์',
      dueDate: addDays(today, 3),
      priority: 'low',
      completed: false,
      category: 'ส่วนตัว',
      createdAt: '2026-09-22T11:00:00.000Z',
    },
  ];
}
