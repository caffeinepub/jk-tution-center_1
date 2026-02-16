import type { AttendanceDay, AttendanceEntry, Time } from '../backend';
import { AttendanceStatus } from '../backend';

/**
 * Get the number of days in a given month
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * Navigate to previous month
 */
export function getPreviousMonth(year: number, month: number): { year: number; month: number } {
  if (month === 1) {
    return { year: year - 1, month: 12 };
  }
  return { year, month: month - 1 };
}

/**
 * Navigate to next month
 */
export function getNextMonth(year: number, month: number): { year: number; month: number } {
  if (month === 12) {
    return { year: year + 1, month: 1 };
  }
  return { year, month: month + 1 };
}

/**
 * Format month and year for display
 */
export function formatMonthYear(year: number, month: number): string {
  const date = new Date(year, month - 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

/**
 * Convert a calendar day to backend Time format (nanoseconds since epoch)
 * Sets time to noon UTC to avoid timezone issues
 */
export function dayToTime(year: number, month: number, day: number): Time {
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return BigInt(date.getTime()) * BigInt(1_000_000); // Convert ms to nanoseconds
}

/**
 * Convert backend Time to calendar day
 */
export function timeToDay(time: Time): { year: number; month: number; day: number } {
  const ms = Number(time / BigInt(1_000_000));
  const date = new Date(ms);
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  };
}

/**
 * Create a lookup map from attendance entries by date string (YYYY-MM-DD)
 */
export function createAttendanceLookup(entries: AttendanceEntry[]): Map<string, AttendanceEntry> {
  const lookup = new Map<string, AttendanceEntry>();
  
  entries.forEach(entry => {
    const { year, month, day } = timeToDay(entry.date);
    const key = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    lookup.set(key, entry);
  });
  
  return lookup;
}

/**
 * Get attendance status for a specific day from lookup
 */
export function getAttendanceForDay(
  lookup: Map<string, AttendanceEntry>,
  year: number,
  month: number,
  day: number
): 'present' | 'absent' | 'unmarked' {
  const key = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const entry = lookup.get(key);
  
  if (!entry) return 'unmarked';
  return entry.status === AttendanceStatus.present ? 'present' : 'absent';
}
