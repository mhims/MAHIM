export type CalendarDayStatus = 'open' | 'holiday' | 'exam' | 'special';

export interface CalendarHolidayItem {
  id: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD (inclusive for date range)
  status: CalendarDayStatus;
  title: string;
  category?: 'সাপ্তাহিক ছুটি' | 'সরকারি ছুটি' | 'জাতীয় ছুটি' | 'বিশ্ববিদ্যালয় ছুটি' | 'পরীক্ষা' | 'অন্যান্য';
}

export interface CalendarConfig {
  defaultOffDays: number[]; // Day indices [0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat]. Default: [3, 5, 6] (Wed, Fri, Sat)
  allowFutureMonths: boolean; // Whether users can navigate to future unverified months
  academicYear: string;
}

export interface DayResolvedInfo {
  dateStr: string; // YYYY-MM-DD
  dayNumber: number;
  dayIndex: number; // 0-6
  isToday: boolean;
  status: CalendarDayStatus;
  isDefaultWeeklyOff: boolean;
  reason: string;
}
