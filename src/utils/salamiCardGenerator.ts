/**
 * Sharable Eid Salami Digital Card Generator
 * Creates a high-resolution, festive greeting card ready for Facebook/WhatsApp sharing.
 */

export interface SalamiCardData {
  name: string;
  amount: string;
  dateStr?: string;
  wish?: string;
}

export function generateSalamiCardCanvas(data: SalamiCardData): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve('');
      return;
    }

    // 1. Background gradient (Royal Cream to Warm Ivory)
    const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1080);
    bgGrad.addColorStop(0, '#fdfaf5');
    bgGrad.addColorStop(0.5, '#fff7ea');
    bgGrad.addColorStop(1, '#fbeedb');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1080);

    // 2. Outer Royal Gold Border
    ctx.strokeStyle = '#c5a059';
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, 1020, 1020);

    // 3. Inner Decorative Dashed Border
    ctx.save();
    ctx.strokeStyle = '#d12053';
    ctx.lineWidth = 4;
    ctx.setLineDash([16, 12]);
    ctx.strokeRect(55, 55, 970, 970);
    ctx.restore();

    // 4. Corner Ornaments
    const drawCorner = (x: number, y: number, angle: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.strokeStyle = '#c5a059';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 35, 0, Math.PI / 2);
      ctx.stroke();
      ctx.fillStyle = '#d12053';
      ctx.beginPath();
      ctx.arc(18, 18, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    drawCorner(55, 55, 0);
    drawCorner(1025, 55, 90);
    drawCorner(1025, 1025, 180);
    drawCorner(55, 1025, 270);

    // 5. Crescent & Star / Lantern Illustration
    ctx.fillStyle = '#c5a059';
    ctx.font = '54px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🌙 ✨ 🕌', 540, 140);

    // 6. Header: "ঈদ মোবারক"
    ctx.fillStyle = '#5d4037';
    ctx.font = 'bold 76px "Hind Siliguri", sans-serif';
    ctx.fillText('ঈদ মোবারক', 540, 230);

    // Subtitle
    ctx.fillStyle = '#c5a059';
    ctx.font = '600 32px "Hind Siliguri", sans-serif';
    ctx.fillText('— মাহিম সালামি পোর্টাল ২০২৬ —', 540, 285);

    // 7. Middle Card Container (White with shadow)
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(93, 64, 55, 0.12)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 15;

    // Rounded rectangle
    const rx = 100, ry = 330, rw = 880, rh = 540, radius = 32;
    ctx.beginPath();
    ctx.moveTo(rx + radius, ry);
    ctx.lineTo(rx + rw - radius, ry);
    ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + radius);
    ctx.lineTo(rx + rw, ry + rh - radius);
    ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - radius, ry + rh);
    ctx.lineTo(rx + radius, ry + rh);
    ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - radius);
    ctx.lineTo(rx, ry + radius);
    ctx.quadraticCurveTo(rx, ry, rx + radius, ry);
    ctx.closePath();
    ctx.fill();

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Card border
    ctx.strokeStyle = '#f1e2c9';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 8. Recipient Badge
    ctx.fillStyle = '#fff0f5';
    const bw = 460, bh = 54, bx = (1080 - bw) / 2, by = 365;
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, 27);
    ctx.fill();
    ctx.strokeStyle = '#d12053';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#d12053';
    ctx.font = 'bold 26px "Hind Siliguri", sans-serif';
    ctx.fillText(`🎉 ডিজিটাল ঈদ সালামি রসিদ`, 540, 401);

    // 9. Name
    ctx.fillStyle = '#5d4037';
    ctx.font = 'bold 44px "Hind Siliguri", sans-serif';
    ctx.fillText(`অভিনন্দন, ${data.name || 'প্রিয় বন্ধু'}!`, 540, 475);

    // 10. Won Salami Amount Highlight Box
    ctx.fillStyle = '#fdf2f4';
    const aw = 700, ah = 160, ax = (1080 - aw) / 2, ay = 515;
    ctx.beginPath();
    ctx.roundRect(ax, ay, aw, ah, 24);
    ctx.fill();
    ctx.strokeStyle = '#d12053';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 8]);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#7a5e52';
    ctx.font = '600 24px "Hind Siliguri", sans-serif';
    ctx.fillText('স্পিন থেকে নির্ধারিত আপনার সালামির পরিমাণ', 540, 560);

    ctx.fillStyle = '#d12053';
    ctx.font = 'bold 64px "Hind Siliguri", sans-serif';
    ctx.fillText(data.amount || '১.৫ টাকা', 540, 635);

    // 11. Custom Eid Wish
    const wishText = data.wish && data.wish.trim() !== 'N/A' && data.wish.trim()
      ? `"${data.wish.slice(0, 70)}"`
      : '“ঈদের আনন্দ ছড়িয়ে পড়ুক সবার প্রাণে, সালামি আসুক হাসিমুখে!”';

    ctx.fillStyle = '#6b4f44';
    ctx.font = 'italic 26px "Hind Siliguri", sans-serif';
    ctx.fillText(wishText, 540, 725);

    // 12. Verification & Status Note
    ctx.fillStyle = '#2e7d32';
    ctx.font = 'bold 22px "Hind Siliguri", sans-serif';
    ctx.fillText('✅ বিকাশ নম্বরে দ্রুত পৌঁছে দেওয়ার ব্যবস্থা করা হচ্ছে', 540, 775);

    ctx.fillStyle = '#a6825c';
    ctx.font = '500 20px "Hind Siliguri", sans-serif';
    ctx.fillText(`তারিখ: ${data.dateStr || new Date().toLocaleDateString('bn-BD')}`, 540, 815);

    // 13. Footer Branding
    ctx.fillStyle = '#5d4037';
    ctx.font = 'bold 26px "Hind Siliguri", sans-serif';
    ctx.fillText('মাহিম ইবনে খুদি • mahims.com/salami', 540, 940);

    ctx.fillStyle = '#a6825c';
    ctx.font = '500 20px "Hind Siliguri", sans-serif';
    ctx.fillText('আপনারও সালামি নিন অথবা মাহিমকে সালামি পাঠান এই লিংকে!', 540, 975);

    resolve(canvas.toDataURL('image/png'));
  });
}

export function downloadSalamiCard(dataUrl: string, name: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  const safeName = (name || 'mahim-salami').replace(/[^a-zA-Z0-9\u0980-\u09FF]/g, '_');
  link.download = `salami-card-${safeName}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function shareSalamiCard(dataUrl: string, name: string, amount: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `salami-${name || 'friend'}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'আমার ঈদ সালামি রসিদ! 🌙',
          text: `মাহিমের ওয়েবসাইট থেকে স্পিন করে আমি পেলাম ${amount} ঈদ সালামি! 🎰😂 আপনিও চেক করতে পারেন: https://mahims.com/salami`,
          files: [file],
        });
        return true;
      } else {
        await navigator.share({
          title: 'আমার ঈদ সালামি রসিদ! 🌙',
          text: `মাহিমের ওয়েবসাইট থেকে স্পিন করে আমি পেলাম ${amount} ঈদ সালামি! 🎰😂 আপনিও সালামি নিন: https://mahims.com/salami`,
          url: 'https://mahims.com/salami',
        });
        return true;
      }
    } catch {
      return false;
    }
  }
  return false;
}
