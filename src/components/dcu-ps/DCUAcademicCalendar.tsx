import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Check,
  Lock,
  X
} from 'lucide-react';
import { CalendarConfig, CalendarHolidayItem, DayResolvedInfo } from '../../types/dcuCalendar';
import { resolveDayStatus } from '../../utils/dcuCalendarService';
import { exportCalendarAsJPG } from '../../utils/calendarExport';

interface DCUAcademicCalendarProps {
  config: CalendarConfig;
  holidays: CalendarHolidayItem[];
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const MONTH_NAMES_BN = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

const WEEKDAY_NAMES_BN = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহস্পতি', 'শুক্র', 'শনি'];
const WEEKDAY_NAMES_FULL_BN = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];

export const DCUAcademicCalendar: React.FC<DCUAcademicCalendarProps> = ({
  config,
  holidays
}) => {
  const now = new Date();
  const currentActualYear = now.getFullYear();
  const currentActualMonth = now.getMonth();

  // Active viewing month & year
  const [viewYear, setViewYear] = useState(currentActualYear);
  const [viewMonth, setViewMonth] = useState(currentActualMonth);

  // Selected date details
  const [selectedDayInfo, setSelectedDayInfo] = useState<DayResolvedInfo | null>(null);

  // Download & Share states
  const [isExporting, setIsExporting] = useState(false);
  const [isCopiedLink, setIsCopiedLink] = useState(false);

  // Check if Next Month is locked
  const isViewingCurrentMonth = viewYear === currentActualYear && viewMonth === currentActualMonth;
  const isNextDisabled =
    !config.allowFutureMonths &&
    (viewYear > currentActualYear || (viewYear === currentActualYear && viewMonth >= currentActualMonth));

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
    setSelectedDayInfo(null);
  };

  const handleNextMonth = () => {
    if (isNextDisabled) return;
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
    setSelectedDayInfo(null);
  };

  // Calendar matrix calculations
  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const lastDay = new Date(viewYear, viewMonth + 1, 0);

    const firstDayIndex = firstDay.getDay(); // 0=Sun ... 6=Sat
    const totalDays = lastDay.getDate();

    const days: DayResolvedInfo[] = [];
    for (let day = 1; day <= totalDays; day++) {
      const d = new Date(viewYear, viewMonth, day);
      days.push(resolveDayStatus(d, holidays, config));
    }

    return {
      firstDayIndex,
      totalDays,
      days
    };
  }, [viewYear, viewMonth, holidays, config]);

  // Counts
  const totalClassDays = useMemo(() => {
    return calendarDays.days.filter(d => d.status === 'open').length;
  }, [calendarDays]);

  const totalHolidayDays = useMemo(() => {
    return calendarDays.days.filter(d => d.status === 'holiday').length;
  }, [calendarDays]);

  // Handle Download JPG
  const handleDownloadJPG = async () => {
    try {
      setIsExporting(true);
      await exportCalendarAsJPG(viewYear, viewMonth, holidays, config);
    } catch (err) {
      console.warn('JPG export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Handle Share Link
  const handleShareLink = () => {
    const shareUrl = `${window.location.origin}/ps/calendar`;
    if (navigator.share) {
      navigator.share({
        title: `একাডেমিক ক্যালেন্ডার (${MONTH_NAMES_BN[viewMonth]} ${viewYear}) — রাষ্ট্রবিজ্ঞান বিভাগ`,
        text: `🗓️ ${MONTH_NAMES_BN[viewMonth]} ${viewYear} মাসের ক্লাস ও ছুটির দিন:\n${shareUrl}`,
        url: shareUrl
      }).catch(() => {
        copyFallback(shareUrl);
      });
    } else {
      copyFallback(shareUrl);
    }
  };

  const copyFallback = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setIsCopiedLink(true);
      setTimeout(() => setIsCopiedLink(false), 2000);
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-[#111622] rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs overflow-hidden transition-colors">
      
      {/* ========================================================================= */}
      {/* 1. CLEAN MINIMAL HEADER                                                   */}
      {/* ========================================================================= */}
      <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2 flex-wrap">
        
        {/* Left: Month Navigation & Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
              title="পূর্ববর্তী মাস"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleNextMonth}
              disabled={isNextDisabled}
              className={`p-1.5 rounded-lg transition ${
                isNextDisabled
                  ? 'text-zinc-300 dark:text-zinc-700 cursor-not-allowed opacity-50'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer'
              }`}
              title={isNextDisabled ? 'ভবিষ্যত মাস লক করা' : 'পরবর্তী মাস'}
            >
              {isNextDisabled ? <Lock className="w-3.5 h-3.5" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white tracking-tight">
              {MONTH_NAMES_BN[viewMonth]} {viewYear}
            </h3>

            {isViewingCurrentMonth && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 font-semibold border border-amber-500/20">
                চলতি মাস
              </span>
            )}
          </div>
        </div>

        {/* Right: Actions (Clean Download & Share buttons) */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleDownloadJPG}
            disabled={isExporting}
            className="px-2.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
            title="ক্যালেন্ডারের ছবি (JPG) ডাউনলোড"
          >
            <Download className="w-3.5 h-3.5 text-amber-500" />
            <span>{isExporting ? 'তৈরি...' : 'JPG ডাউনলোড'}</span>
          </button>

          <button
            type="button"
            onClick={handleShareLink}
            className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition cursor-pointer"
            title="লিংক কপি করুন"
          >
            {isCopiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. SUBTLE STATS LINE                                                      */}
      {/* ========================================================================= */}
      <div className="px-4 py-1.5 sm:px-5 bg-zinc-50/60 dark:bg-zinc-900/40 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-3">
          <span>ক্লাস: <strong className="text-zinc-800 dark:text-zinc-200 font-semibold">{totalClassDays} দিন</strong></span>
          <span>•</span>
          <span>ছুটি: <strong className="text-rose-600 dark:text-rose-400 font-semibold">{totalHolidayDays} দিন</strong></span>
        </div>

        <span className="text-[10px] text-zinc-400">
          সাপ্তাহিক ছুটি: বুধ, শুক্র ও শনি
        </span>
      </div>

      {/* ========================================================================= */}
      {/* 3. MINIMAL WEEKDAY LABELS                                                 */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-7 border-b border-zinc-100 dark:border-zinc-800 text-center text-[11px] sm:text-xs font-semibold py-2">
        {WEEKDAY_NAMES_BN.map((name, idx) => {
          const isDefaultOff = config.defaultOffDays.includes(idx);
          return (
            <div
              key={name}
              className={isDefaultOff ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-zinc-500 dark:text-zinc-400'}
            >
              {name}
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 4. CLEAN & SPACIOUS CALENDAR GRID (NO CLUTTER, 1-31 FIT SCREEN)            */}
      {/* ========================================================================= */}
      <div className="p-2 sm:p-3">
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          
          {/* Empty leading days */}
          {Array.from({ length: calendarDays.firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-10 sm:h-12 md:h-14 rounded-lg select-none" />
          ))}

          {/* Days of month */}
          {calendarDays.days.map((day) => {
            const isOff = day.status === 'holiday';
            const isExam = day.status === 'exam';
            const isToday = day.isToday;
            const hasCustomTitle = day.reason && day.reason !== 'ছুটি' && !day.reason.includes('সাপ্তাহিক');

            return (
              <button
                key={day.dateStr}
                type="button"
                onClick={() => setSelectedDayInfo(day)}
                className={`relative h-10 sm:h-12 md:h-14 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer select-none group ${
                  isToday
                    ? 'bg-amber-500 text-black font-extrabold shadow-sm'
                    : isOff
                    ? 'bg-rose-50/70 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100/70 dark:hover:bg-rose-950/40'
                    : isExam
                    ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 hover:bg-amber-100'
                    : 'text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                }`}
              >
                {/* Date Number */}
                <span className={`text-xs sm:text-sm ${isToday ? 'font-black' : isOff ? 'font-bold' : 'font-medium'}`}>
                  {day.dayNumber}
                </span>

                {/* Minimal Status Dot / Label */}
                {!isToday && (
                  <div className="mt-0.5 flex items-center justify-center">
                    {isOff ? (
                      <span className="flex items-center gap-0.5">
                        <span className="w-1 h-1 rounded-full bg-rose-500 inline-block" />
                        <span className="text-[9px] font-semibold opacity-90 hidden sm:inline">
                          {hasCustomTitle ? day.reason.slice(0, 8) : 'ছুটি'}
                        </span>
                      </span>
                    ) : isExam ? (
                      <span className="w-1 h-1 rounded-full bg-amber-500 inline-block" />
                    ) : (
                      <span className="w-1 h-1 rounded-full bg-emerald-500/60 inline-block opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. MINIMAL DETAIL FOOTER (WHEN A DATE IS CLICKED)                         */}
      {/* ========================================================================= */}
      {selectedDayInfo && (
        <div className="px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3 text-xs animate-in fade-in duration-100">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              selectedDayInfo.status === 'holiday' ? 'bg-rose-500' : 'bg-emerald-500'
            }`} />
            <span className="font-semibold text-zinc-900 dark:text-white">
              {selectedDayInfo.dayNumber} {MONTH_NAMES_BN[viewMonth]} ({WEEKDAY_NAMES_FULL_BN[selectedDayInfo.dayIndex]}):
            </span>
            <span className={selectedDayInfo.status === 'holiday' ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-emerald-600 dark:text-emerald-400 font-semibold'}>
              {selectedDayInfo.status === 'holiday' ? 'ছুটি' : 'ক্লাস চালু'}
            </span>
            {selectedDayInfo.reason && selectedDayInfo.reason !== 'ছুটি' && (
              <span className="text-zinc-500 dark:text-zinc-400">
                ({selectedDayInfo.reason})
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setSelectedDayInfo(null)}
            className="text-zinc-400 hover:text-zinc-700 dark:hover:text-white p-1 cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
};
