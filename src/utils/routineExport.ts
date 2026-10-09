import { PSClassSession } from '../data/dcuPoliticalScienceData';

const DAY_NAMES_BN: Record<number, string> = {
  0: 'রবিবার',
  1: 'সোমবার',
  2: 'মঙ্গলবার',
  3: 'বুধবার',
  4: 'বৃহস্পতিবার',
  5: 'শুক্রবার',
  6: 'শনিবার',
};

/**
 * Downloads the Routine as a high-resolution, crisp LIGHT MODE PNG Image
 */
export function downloadRoutineImage(routine: PSClassSession[]): void {
  const canvas = document.createElement('canvas');
  const width = 1200;
  const height = 1380;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Crisp White / Off-white Light Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Elegant subtle light slate outer border
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 12;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  // Top header banner background (Soft Amber / Slate)
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(26, 26, width - 52, 175);
  ctx.strokeStyle = '#f1f5f9';
  ctx.lineWidth = 2;
  ctx.strokeRect(26, 26, width - 52, 175);

  // Header Title
  ctx.textAlign = 'center';
  ctx.fillStyle = '#b45309'; // Rich Amber
  ctx.font = 'bold 36px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
  ctx.fillText('ঢাকা সেন্ট্রাল ইউনিভার্সিটি', width / 2, 80);

  ctx.fillStyle = '#0f172a'; // Deep Navy / Charcoal
  ctx.font = 'bold 28px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
  ctx.fillText('রাষ্ট্রবিজ্ঞান বিভাগ • ১ম বর্ষ ১ম সেমিস্টার', width / 2, 125);

  ctx.fillStyle = '#64748b'; // Slate gray
  ctx.font = '600 20px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
  ctx.fillText('ক্লাস রুটিন (২০২৬ শিক্ষাবর্ষ)', width / 2, 165);

  // Accent line
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 200, 185);
  ctx.lineTo(width / 2 + 200, 185);
  ctx.stroke();

  // Draw day schedule sections
  const days = [0, 1, 2, 4];
  let startY = 230;

  days.forEach((dayIndex) => {
    const daySessions = routine
      .filter((s) => s.dayIndex === dayIndex)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    // Day Header Card (Light slate with amber accent)
    ctx.textAlign = 'left';
    ctx.fillStyle = '#f1f5f9';
    ctx.beginPath();
    ctx.roundRect(60, startY, width - 120, 48, 8);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Day title text
    ctx.fillStyle = '#b45309';
    ctx.font = 'bold 23px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
    ctx.fillText(`🗓️ ${DAY_NAMES_BN[dayIndex]}`, 80, startY + 33);

    // Class count badge
    ctx.textAlign = 'right';
    ctx.fillStyle = '#475569';
    ctx.font = '600 17px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
    ctx.fillText(`${daySessions.length}টি ক্লাস`, width - 85, startY + 32);

    startY += 58;

    // Sessions in this day (Clean white cards with light borders)
    daySessions.forEach((session, idx) => {
      ctx.textAlign = 'left';
      ctx.fillStyle = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
      ctx.beginPath();
      ctx.roundRect(60, startY, width - 120, 76, 8);
      ctx.fill();
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Time pill
      ctx.fillStyle = '#b45309';
      ctx.font = 'bold 20px "Hind Siliguri", monospace';
      ctx.fillText(`⏰ ${session.timeFormatted}`, 80, startY + 32);

      // Room
      ctx.fillStyle = '#0284c7';
      ctx.font = 'bold 17px "Hind Siliguri", monospace';
      ctx.fillText(`📍 রুম: ${session.room}`, 80, startY + 58);

      // Course Title & Code
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 20px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
      ctx.fillText(session.courseTitleBn, 320, startY + 32);

      // Teacher info
      ctx.fillStyle = '#64748b';
      ctx.font = '500 17px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
      ctx.fillText(`শিক্ষক: ${session.teacherName} • কোড: ${session.courseCode}`, 320, startY + 58);

      startY += 84;
    });

    startY += 18;
  });

  // Footer branding (Clean light footer)
  ctx.textAlign = 'center';
  ctx.fillStyle = '#94a3b8';
  ctx.font = '16px "Hind Siliguri", sans-serif';
  ctx.fillText('লাইভ রুটিন ও নোটিশ দেখুন: mahims.com/ps • প্রস্তুতকারী: মাহিম ইবনে খুদি', width / 2, height - 45);

  // Trigger download
  const link = document.createElement('a');
  link.download = 'DCU_Political_Science_1st_Sem_Routine.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/**
 * Generates and triggers clean printable Routine PDF (Crisp Light Layout)
 */
export function downloadRoutinePDF(routine: PSClassSession[]): void {
  const days = [0, 1, 2, 4];
  
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('পপআপ ব্লকার সক্রিয় থাকায় প্রিন্ট উইন্ডো খোলা যায়নি। অনুগ্রহ করে ব্রাউজারে পপআপ এলাউ করুন।');
    return;
  }

  const routineRows = days.map((dayIndex) => {
    const daySessions = routine
      .filter((s) => s.dayIndex === dayIndex)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    const rows = daySessions.map((s) => `
      <tr>
        <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold; font-family: monospace; color: #b45309;">${s.timeFormatted}</td>
        <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold; color: #0f172a;">${s.courseTitleBn}</td>
        <td style="padding: 10px; border: 1px solid #cbd5e1; color: #475569; font-family: monospace;">${s.courseCode}</td>
        <td style="padding: 10px; border: 1px solid #cbd5e1; color: #334155;">${s.teacherName}</td>
        <td style="padding: 10px; border: 1px solid #cbd5e1; font-family: monospace; font-weight: bold; text-align: center; color: #0284c7;">${s.room}</td>
      </tr>
    `).join('');

    return `
      <div style="margin-bottom: 22px; break-inside: avoid;">
        <h3 style="background: #f1f5f9; color: #b45309; margin: 0; padding: 10px 14px; font-size: 16px; border: 1px solid #cbd5e1; border-bottom: none; border-radius: 6px 6px 0 0; display: flex; justify-content: space-between;">
          <span>🗓️ ${DAY_NAMES_BN[dayIndex]}</span>
          <span style="color: #475569; font-size: 13px; font-weight: normal;">${daySessions.length}টি ক্লাস</span>
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; background: #ffffff;">
          <thead>
            <tr style="background: #f8fafc; color: #334155;">
              <th style="padding: 8px; border: 1px solid #cbd5e1; text-align: left; width: 20%;">সময়</th>
              <th style="padding: 8px; border: 1px solid #cbd5e1; text-align: left; width: 35%;">কোর্স শিরোনাম</th>
              <th style="padding: 8px; border: 1px solid #cbd5e1; text-align: left; width: 15%;">কোর্স কোড</th>
              <th style="padding: 8px; border: 1px solid #cbd5e1; text-align: left; width: 20%;">শিক্ষক</th>
              <th style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; width: 10%;">রুম</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  }).join('');

  const html = `
    <!DOCTYPE html>
    <html lang="bn">
      <head>
        <meta charset="UTF-8">
        <title>ক্লাস রুটিন - রাষ্ট্রবিজ্ঞান বিভাগ - ঢাকা সেন্ট্রাল ইউনিভার্সিটি</title>
        <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Hind Siliguri', sans-serif;
            background: #ffffff;
            color: #0f172a;
            padding: 30px;
            margin: 0;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #f59e0b;
            padding-bottom: 14px;
            margin-bottom: 24px;
          }
          .header h1 {
            color: #b45309;
            font-size: 26px;
            margin: 0 0 6px 0;
          }
          .header h2 {
            font-size: 20px;
            color: #0f172a;
            margin: 0 0 4px 0;
          }
          .header p {
            color: #64748b;
            font-size: 14px;
            margin: 0;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
            padding-top: 14px;
          }
          @media print {
            body { padding: 15px; }
            button { display: none !important; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>ঢাকা সেন্ট্রাল ইউনিভার্সিটি</h1>
          <h2>রাষ্ট্রবিজ্ঞান বিভাগ • ঢাকা কলেজ ক্যাম্পাস</h2>
          <p>১ম বর্ষ ১ম সেমিস্টার ক্লাস রুটিন (২০২৬ শিক্ষাবর্ষ)</p>
        </div>

        ${routineRows}

        <div class="footer">
          লাইভ রুটিন দেখুন: mahims.com/ps • প্রস্তুতকারী: মাহিম ইবনে খুদি
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
