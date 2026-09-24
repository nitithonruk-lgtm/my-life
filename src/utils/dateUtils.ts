export const THAI_DAYS = [
  'วันอาทิตย์',
  'วันจันทร์',
  'วันอังคาร',
  'วันพุธ',
  'วันพฤหัสบดี',
  'วันศุกร์',
  'วันเสาร์',
];

export const THAI_DAYS_SHORT = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

export const THAI_MONTHS = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
];

export const THAI_MONTHS_SHORT = [
  'ม.ค.',
  'ก.พ.',
  'มี.ค.',
  'เม.ย.',
  'พ.ค.',
  'มิ.ย.',
  'ก.ค.',
  'ส.ค.',
  'ก.ย.',
  'ต.ค.',
  'พ.ย.',
  'ธ.ค.',
];

/**
 * Returns today's ISO date string 'YYYY-MM-DD'
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format date string (YYYY-MM-DD) to full Thai format:
 * e.g. "วันพฤหัสบดีที่ 24 กันยายน 2026" or "2569"
 */
export function formatThaiDateFull(dateStr: string, useBuddhistYear = false): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  if (isNaN(date.getTime())) return dateStr;

  const dayOfWeek = THAI_DAYS[date.getDay()];
  const dayOfMonth = date.getDate();
  const monthName = THAI_MONTHS[date.getMonth()];
  const year = useBuddhistYear ? y + 543 : y;

  return `${dayOfWeek}ที่ ${dayOfMonth} ${monthName} ${year}`;
}

/**
 * Format date to short readable Thai: "24 ก.ย. 2026"
 */
export function formatThaiDateShort(dateStr: string, useBuddhistYear = false): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  if (isNaN(date.getTime())) return dateStr;

  const dayOfMonth = date.getDate();
  const monthName = THAI_MONTHS_SHORT[date.getMonth()];
  const year = useBuddhistYear ? y + 543 : y;

  return `${dayOfMonth} ${monthName} ${year}`;
}

/**
 * Get greeting based on current local hour
 */
export function getThaiGreeting(hour?: number): string {
  const currentHour = hour !== undefined ? hour : new Date().getHours();
  if (currentHour >= 5 && currentHour < 12) {
    return 'สวัสดีตอนเช้า ☀️';
  } else if (currentHour >= 12 && currentHour < 17) {
    return 'สวัสดีตอนบ่าย 👋';
  } else if (currentHour >= 17 && currentHour < 21) {
    return 'สวัสดีตอนเย็น 🌆';
  } else {
    return 'สวัสดีรอบดึก 🌙';
  }
}

/**
 * Convert "HH:mm" to total minutes from 00:00
 */
export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

/**
 * Convert minutes from 00:00 to "HH:mm"
 */
export function minutesToTime(minutes: number): string {
  const bounded = Math.max(0, Math.min(1439, Math.floor(minutes)));
  const h = String(Math.floor(bounded / 60)).padStart(2, '0');
  const m = String(bounded % 60).padStart(2, '0');
  return `${h}:${m}`;
}

/**
 * Calculate duration between two time strings in Thai format
 * e.g. "1 ชม. 30 นาที" or "45 นาที"
 */
export function calculateDuration(startTime: string, endTime: string): string {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  const diff = end - start;
  if (diff <= 0) return '0 นาที';

  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours} ชม. ${minutes} นาที`;
  } else if (hours > 0) {
    return `${hours} ชม.`;
  } else {
    return `${minutes} นาที`;
  }
}

/**
 * Calculate duration in hours (decimal number)
 */
export function calculateDurationHours(startTime: string, endTime: string): number {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  const diff = Math.max(0, end - start);
  return Number((diff / 60).toFixed(1));
}

/**
 * Validate that endTime is greater than startTime
 */
export function isEndTimeValid(startTime: string, endTime: string): boolean {
  return timeToMinutes(endTime) > timeToMinutes(startTime);
}

/**
 * Check if a date string is today
 */
export function isToday(dateStr: string): boolean {
  return dateStr === getTodayDateString();
}

/**
 * Get current time in "HH:mm" format
 */
export function getCurrentTimeHHMM(): string {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

/**
 * Add days to an ISO date string
 */
export function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  const newYear = date.getFullYear();
  const newMonth = String(date.getMonth() + 1).padStart(2, '0');
  const newDay = String(date.getDate()).padStart(2, '0');
  return `${newYear}-${newMonth}-${newDay}`;
}

/**
 * Get start of week (Monday) for a given date
 */
export function getStartOfWeek(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const day = date.getDay();
  // If Sunday (0), day shift is -6; otherwise 1 - day
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  const newYear = date.getFullYear();
  const newMonth = String(date.getMonth() + 1).padStart(2, '0');
  const newDay = String(date.getDate()).padStart(2, '0');
  return `${newYear}-${newMonth}-${newDay}`;
}

/**
 * Get array of 7 dates for the week starting from Monday
 */
export function getWeekDates(startDateStr: string): string[] {
  const startOfWeek = getStartOfWeek(startDateStr);
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    dates.push(addDays(startOfWeek, i));
  }
  return dates;
}
