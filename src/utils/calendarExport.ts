/**
 * Academic Calendar HD JPG Exporter
 * Generates an ultra-clean, minimalist, high-resolution JPG image of the current month's calendar
 * with DCU University Logo and Mahim's Website Logo.
 */

import { CalendarConfig, CalendarHolidayItem, DayResolvedInfo } from '../types/dcuCalendar';
import { resolveDayStatus } from './dcuCalendarService';

const MONTH_NAMES_BN = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

const WEEKDAY_NAMES_BN = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহস্পতি', 'শুক্র', 'শনি'];

function toBanglaDigits(num: number | string): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/\d/g, d => bnDigits[Number(d)]);
}

function loadImageSafe(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export async function exportCalendarAsJPG(
  year: number,
  month: number, // 0-11
  holidays: CalendarHolidayItem[],
  config: CalendarConfig
): Promise<void> {
  const canvas = document.createElement('canvas');
  const width = 1200;
  const height = 1380;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Clean Crisp Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Subtle outer border
  ctx.strokeStyle = '#e4e4e7';
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  // Top Minimalist Accent Line
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(20, 20, width - 40, 6);

  // Load Logos
  const [dcuLogo, mahimLogo] = await Promise.all([
    loadImageSafe('/dcu-logo.png'),
    loadImageSafe('/logo.png')
  ]);

  // Draw DCU Logo (Left)
  if (dcuLogo) {
    ctx.drawImage(dcuLogo, 60, 50, 75, 75);
  }

  // Draw Mahim Site Logo (Right)
  if (mahimLogo) {
    ctx.drawImage(mahimLogo, width - 135, 50, 75, 75);
  }

  // Header Titles (Clean, Elegant Typography)
  ctx.textAlign = 'center';
  
  // University name
  ctx.fillStyle = '#09090b';
  ctx.font = 'bold 32px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
  ctx.fillText('ঢাকা সেন্ট্রাল ইউনিভার্সিটি', width / 2, 75);

  // Department name
  ctx.fillStyle = '#d97706';
  ctx.font = 'bold 22px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
  ctx.fillText('রাষ্ট্রবিজ্ঞান বিভাগ • সেশন ২০২৪-২৫', width / 2, 108);

  // Subtitle
  ctx.fillStyle = '#71717a';
  ctx.font = '500 15px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
  ctx.fillText('একাডেমিক ক্যালেন্ডার ও ছুটির তালিকা • mahims.com/ps', width / 2, 134);

  // Subtle Divider Line
  ctx.strokeStyle = '#f4f4f5';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(60, 155);
  ctx.lineTo(width - 60, 155);
  ctx.stroke();

  // Month Title Banner
  const monthName = MONTH_NAMES_BN[month];
  const yearBn = toBanglaDigits(year);
  
  ctx.fillStyle = '#18181b';
  ctx.font = 'bold 34px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`🗓️ ${monthName} ${yearBn}`, 60, 205);

  // Calculate month matrix & counts
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstDayIndex = firstDay.getDay(); // 0=Sun ... 6=Sat
  const totalDays = lastDay.getDate();

  const days: DayResolvedInfo[] = [];
  for (let d = 1; d <= totalDays; d++) {
    const curDate = new Date(year, month, d);
    days.push(resolveDayStatus(curDate, holidays, config));
  }

  const classCount = days.filter(d => d.status === 'open').length;
  const holidayCount = days.filter(d => d.status === 'holiday').length;

  // Stats text on top right
  ctx.textAlign = 'right';
  ctx.fillStyle = '#52525b';
  ctx.font = '600 16px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
  ctx.fillText(`ক্লাস চালু: ${toBanglaDigits(classCount)} দিন   |   ছুটি: ${toBanglaDigits(holidayCount)} দিন (বুধ, শুক্র ও শনি)`, width - 60, 205);

  // Weekday Columns Header
  const startX = 60;
  const startY = 240;
  const tableWidth = width - 120;
  const colWidth = tableWidth / 7;
  const headerHeight = 44;

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(startX, startY, tableWidth, headerHeight);
  ctx.strokeStyle = '#e2e8f0';
  ctx.strokeRect(startX, startY, tableWidth, headerHeight);

  ctx.font = 'bold 17px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
  ctx.textAlign = 'center';

  WEEKDAY_NAMES_BN.forEach((dayName, idx) => {
    const cellX = startX + idx * colWidth;
    const isDefaultOff = config.defaultOffDays.includes(idx);

    ctx.fillStyle = isDefaultOff ? '#e11d48' : '#334155';
    ctx.fillText(dayName + (isDefaultOff ? ' (ছুটি)' : ''), cellX + colWidth / 2, startY + 28);
  });

  // Calculate Rows
  const totalSlots = firstDayIndex + totalDays;
  const totalRows = Math.ceil(totalSlots / 7);
  const availableTableHeight = 980;
  const rowHeight = availableTableHeight / totalRows;

  // Draw Grid Cells
  let dayNum = 1;

  for (let row = 0; row < totalRows; row++) {
    for (let col = 0; col < 7; col++) {
      const slotIndex = row * 7 + col;
      const cellX = startX + col * colWidth;
      const cellY = startY + headerHeight + row * rowHeight;

      if (slotIndex >= firstDayIndex && dayNum <= totalDays) {
        const info = days[dayNum - 1];
        const isOff = info.status === 'holiday';
        const isExam = info.status === 'exam';

        // Clean cell background
        ctx.fillStyle = isOff ? '#fff1f2' : isExam ? '#fffbeb' : '#ffffff';
        ctx.fillRect(cellX, cellY, colWidth, rowHeight);

        // Thin elegant cell border
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.strokeRect(cellX, cellY, colWidth, rowHeight);

        // Date Number
        ctx.textAlign = 'left';
        ctx.fillStyle = isOff ? '#e11d48' : '#0f172a';
        ctx.font = isOff ? 'bold 24px "Hind Siliguri", "Noto Sans Bengali", sans-serif' : '600 24px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
        ctx.fillText(toBanglaDigits(dayNum), cellX + 16, cellY + 36);

        // Clean subtle status label
        const hasCustomTitle = info.reason && info.reason !== 'ছুটি' && !info.reason.includes('সাপ্তাহিক');
        const labelText = isOff 
          ? (hasCustomTitle ? info.reason : 'ছুটি')
          : isExam 
          ? (info.reason || 'পরীক্ষা')
          : '';

        if (labelText) {
          ctx.textAlign = 'left';
          ctx.fillStyle = isOff ? '#be123c' : '#b45309';
          ctx.font = 'bold 13px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
          
          const maxChars = 14;
          const displayLabel = labelText.length > maxChars ? labelText.slice(0, maxChars) + '...' : labelText;
          ctx.fillText(`• ${displayLabel}`, cellX + 16, cellY + 68);
        }

        dayNum++;
      } else {
        // Outside month slot
        ctx.fillStyle = '#fafafa';
        ctx.fillRect(cellX, cellY, colWidth, rowHeight);
        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 1;
        ctx.strokeRect(cellX, cellY, colWidth, rowHeight);
      }
    }
  }

  // Footer Legend & Source
  const footerY = startY + headerHeight + totalRows * rowHeight + 25;

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(startX, footerY, tableWidth, 50);
  ctx.strokeStyle = '#e2e8f0';
  ctx.strokeRect(startX, footerY, tableWidth, 50);

  ctx.textAlign = 'left';
  ctx.font = '600 14px "Hind Siliguri", "Noto Sans Bengali", sans-serif';

  // Red circle
  ctx.fillStyle = '#e11d48';
  ctx.beginPath();
  ctx.arc(startX + 24, footerY + 25, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#334155';
  ctx.fillText('ছুটি / বন্ধ', startX + 36, footerY + 30);

  // Green circle
  ctx.fillStyle = '#059669';
  ctx.beginPath();
  ctx.arc(startX + 150, footerY + 25, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#334155';
  ctx.fillText('ক্লাস চালু', startX + 162, footerY + 30);

  // Footer Watermark
  ctx.textAlign = 'right';
  ctx.fillStyle = '#64748b';
  ctx.font = '500 13px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
  ctx.fillText('রাষ্ট্রবিজ্ঞান বিভাগ • ঢাকা সেন্ট্রাল ইউনিভার্সিটি | mahims.com/ps', width - startX - 20, footerY + 30);

  // Export as JPG and trigger download
  const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
  const link = document.createElement('a');
  link.download = `DCU-Calendar-${year}-${month + 1}.jpg`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
