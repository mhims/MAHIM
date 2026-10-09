import { PSClassSession, DCU_LOGOS } from '../data/dcuPoliticalScienceData';

const DAY_NAMES_BN: Record<number, string> = {
  0: 'রবিবার',
  1: 'সোমবার',
  2: 'মঙ্গলবার',
  3: 'বুধবার',
  4: 'বৃহস্পতিবার',
  5: 'শুক্রবার',
  6: 'শনিবার',
};

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image: ' + src));
    img.src = src;
  });
}

/**
 * Downloads the Routine as a high-resolution, crisp LIGHT MODE PNG Image
 * With University Logo on TOP-LEFT and Website Logo + mahims.com on TOP-RIGHT
 */
export async function downloadRoutineImage(routine: PSClassSession[]): Promise<void> {
  const canvas = document.createElement('canvas');
  const width = 1200;
  const height = 1420;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Load logos in parallel (with safe fallbacks)
  let uniImg: HTMLImageElement | null = null;
  let siteImg: HTMLImageElement | null = null;

  try {
    uniImg = await loadImg('/dcu-logo.png').catch(() =>
      loadImg(DCU_LOGOS.university)
    );
  } catch (e) {
    console.warn('Could not load university logo for canvas', e);
  }

  try {
    siteImg = await loadImg('/logo.png');
  } catch (e) {
    console.warn('Could not load site logo for canvas', e);
  }

  // Crisp White Light Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Subtle outer border
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 12;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  // Top header banner background (Soft Slate)
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(26, 26, width - 52, 185);
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.strokeRect(26, 26, width - 52, 185);

  // =========================================================================
  // 1. TOP-LEFT: UNIVERSITY LOGO
  // =========================================================================
  if (uniImg) {
    ctx.save();
    // Rounded white badge
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(50, 42, 92, 92, 16);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Clip image
    ctx.beginPath();
    ctx.roundRect(52, 44, 88, 88, 14);
    ctx.clip();
    ctx.drawImage(uniImg, 52, 44, 88, 88);
    ctx.restore();
  }

  // =========================================================================
  // 2. TOP-RIGHT: WEBSITE LOGO + mahims.com
  // =========================================================================
  if (siteImg) {
    ctx.save();
    // Rounded white badge
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(width - 142, 42, 92, 92, 16);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Clip image
    ctx.beginPath();
    ctx.roundRect(width - 140, 44, 88, 88, 14);
    ctx.clip();
    ctx.drawImage(siteImg, width - 140, 44, 88, 88);
    ctx.restore();

    // Text underneath website logo: mahims.com
    ctx.textAlign = 'center';
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('mahims.com', width - 96, 154);
  }

  // =========================================================================
  // 3. CENTER: TITLE & META DETAILS
  // =========================================================================
  ctx.textAlign = 'center';
  ctx.fillStyle = '#b45309'; // Rich Amber
  ctx.font = 'bold 34px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
  ctx.fillText('ঢাকা সেন্ট্রাল ইউনিভার্সিটি', width / 2, 78);

  ctx.fillStyle = '#0f172a'; // Deep Navy
  ctx.font = 'bold 26px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
  ctx.fillText('রাষ্ট্রবিজ্ঞান বিভাগ • ১ম বর্ষ ১ম সেমিস্টার', width / 2, 122);

  ctx.fillStyle = '#64748b'; // Slate gray
  ctx.font = '600 18px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
  ctx.fillText('ক্লাস রুটিন (২০২৬ শিক্ষাবর্ষ)', width / 2, 158);

  // Accent line
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 180, 180);
  ctx.lineTo(width / 2 + 180, 180);
  ctx.stroke();

  // =========================================================================
  // 4. DAY SCHEDULE CARDS
  // =========================================================================
  const days = [0, 1, 2, 4];
  let startY = 236;

  days.forEach((dayIndex) => {
    const daySessions = routine
      .filter((s) => s.dayIndex === dayIndex)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    // Day Header Card
    ctx.textAlign = 'left';
    ctx.fillStyle = '#f1f5f9';
    ctx.beginPath();
    ctx.roundRect(60, startY, width - 120, 46, 8);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Day title text
    ctx.fillStyle = '#b45309';
    ctx.font = 'bold 22px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
    ctx.fillText(`🗓️ ${DAY_NAMES_BN[dayIndex]}`, 80, startY + 31);

    // Class count badge
    ctx.textAlign = 'right';
    ctx.fillStyle = '#475569';
    ctx.font = '600 16px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
    ctx.fillText(`${daySessions.length}টি ক্লাস`, width - 85, startY + 30);

    startY += 56;

    // Sessions in this day
    daySessions.forEach((session, idx) => {
      ctx.textAlign = 'left';
      ctx.fillStyle = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
      ctx.beginPath();
      ctx.roundRect(60, startY, width - 120, 74, 8);
      ctx.fill();
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Time pill
      ctx.fillStyle = '#b45309';
      ctx.font = 'bold 19px "Hind Siliguri", monospace';
      ctx.fillText(`⏰ ${session.timeFormatted}`, 80, startY + 31);

      // Room
      ctx.fillStyle = '#0284c7';
      ctx.font = 'bold 16px "Hind Siliguri", monospace';
      ctx.fillText(`📍 রুম: ${session.room}`, 80, startY + 56);

      // Course Title & Code
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 19px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
      ctx.fillText(session.courseTitleBn, 320, startY + 31);

      // Teacher info
      ctx.fillStyle = '#64748b';
      ctx.font = '500 16px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
      ctx.fillText(`শিক্ষক: ${session.teacherName} • কোড: ${session.courseCode}`, 320, startY + 56);

      startY += 82;
    });

    startY += 16;
  });

  // Footer branding
  ctx.textAlign = 'center';
  ctx.fillStyle = '#94a3b8';
  ctx.font = '15px "Hind Siliguri", sans-serif';
  ctx.fillText('লাইভ রুটিন ও নোটিশ দেখুন: mahims.com/ps • প্রস্তুতকারী: মাহিম ইবনে খুদি', width / 2, height - 42);

  // Trigger download
  const link = document.createElement('a');
  link.download = 'DCU_Political_Science_1st_Sem_Routine.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/**
 * Generates and triggers clean printable Routine PDF (Crisp Light Layout)
 * With University Logo on TOP-LEFT and Website Logo + mahims.com on TOP-RIGHT
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
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 3px solid #f59e0b;
            padding-bottom: 16px;
            margin-bottom: 24px;
          }
          .header .brand-left {
            width: 110px;
            text-align: left;
          }
          .header .brand-left img {
            width: 76px;
            height: 76px;
            object-fit: contain;
            border-radius: 12px;
          }
          .header .brand-center {
            flex: 1;
            text-align: center;
            padding: 0 12px;
          }
          .header .brand-center h1 {
            color: #b45309;
            font-size: 25px;
            margin: 0 0 4px 0;
            font-weight: bold;
          }
          .header .brand-center h2 {
            font-size: 19px;
            color: #0f172a;
            margin: 0 0 4px 0;
          }
          .header .brand-center p {
            color: #64748b;
            font-size: 14px;
            margin: 0;
            font-weight: 600;
          }
          .header .brand-right {
            width: 110px;
            text-align: center;
          }
          .header .brand-right img {
            width: 62px;
            height: 62px;
            object-fit: contain;
            border-radius: 12px;
          }
          .header .brand-right .subtext {
            font-size: 11px;
            font-weight: bold;
            font-family: monospace;
            color: #475569;
            margin-top: 2px;
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
          <div class="brand-left">
            <img src="/dcu-logo.png" onerror="this.src='https://res.cloudinary.com/drvyjj7td/image/upload/v1791540199/logo_df1onj.png'" alt="University Logo" />
          </div>
          <div class="brand-center">
            <h1>ঢাকা সেন্ট্রাল ইউনিভার্সিটি</h1>
            <h2>রাষ্ট্রবিজ্ঞান বিভাগ • ১ম বর্ষ ১ম সেমিস্টার</h2>
            <p>ক্লাস রুটিন (২০২৬ শিক্ষাবর্ষ)</p>
          </div>
          <div class="brand-right">
            <img src="/logo.png" alt="mahims.com" />
            <div class="subtext">mahims.com</div>
          </div>
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
