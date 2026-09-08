import { ChithiLetter } from '../types/chithi';

/**
 * High-res 1080x1920 Canvas Story Card Generator
 * Perfect for Instagram Stories, Facebook Stories, and WhatsApp Status
 */
export async function generateStoryImage(letter: ChithiLetter): Promise<string> {
  const canvas = document.createElement('canvas');
  const width = 1080;
  const height = 1920;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D canvas context');

  // Background gradient: Vintage Warm Sand to Ivory
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#fbf7ee');
  bgGrad.addColorStop(0.5, '#f5efe0');
  bgGrad.addColorStop(1, '#ebe1cc');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle Vintage Border
  ctx.strokeStyle = '#d4c5a9';
  ctx.lineWidth = 4;
  ctx.strokeRect(36, 36, width - 72, height - 72);

  // Top Airmail Stripes Banner
  const stripeH = 16;
  const stripeW = 40;
  for (let x = 40; x < width - 40; x += stripeW * 2) {
    ctx.fillStyle = '#dc2626'; // Red
    ctx.beginPath();
    ctx.moveTo(x, 40);
    ctx.lineTo(x + stripeW, 40);
    ctx.lineTo(x + stripeW - 10, 40 + stripeH);
    ctx.lineTo(x - 10, 40 + stripeH);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#2563eb'; // Blue
    ctx.beginPath();
    ctx.moveTo(x + stripeW, 40);
    ctx.lineTo(x + stripeW * 2, 40);
    ctx.lineTo(x + stripeW * 2 - 10, 40 + stripeH);
    ctx.lineTo(x + stripeW - 10, 40 + stripeH);
    ctx.closePath();
    ctx.fill();
  }

  // Header Stamp: Mahim Chithi
  ctx.fillStyle = '#78350f';
  ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('MAHIM CHITHI • চিঠি ডট মি', width / 2, 140);

  ctx.font = '24px "Hind Siliguri", sans-serif';
  ctx.fillStyle = '#92400e';
  ctx.fillText('— গোপন চিঠির বাক্স / Anonymous Letter —', width / 2, 185);

  // Vintage Postage Stamp on Top Right
  const stampX = width - 240;
  const stampY = 80;
  ctx.save();
  ctx.translate(stampX, stampY);
  ctx.rotate((4 * Math.PI) / 180);
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(0, 0, 150, 180);
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 3;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(4, 4, 142, 172);
  ctx.setLineDash([]);

  // Stamp inner artwork
  ctx.fillStyle = '#78350f';
  ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('BANGLADESH', 75, 36);
  ctx.font = 'bold 44px sans-serif';
  ctx.fillText('🕊️', 75, 95);
  ctx.font = 'bold 22px "Hind Siliguri", sans-serif';
  ctx.fillText('চিঠি ২০২৬', 75, 140);
  ctx.font = '16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('৳ ১.০০', 75, 165);
  ctx.restore();

  // Postal Circular Ink Seal Stamp (Left)
  ctx.save();
  ctx.translate(160, 180);
  ctx.rotate((-12 * Math.PI) / 180);
  ctx.strokeStyle = 'rgba(180, 83, 9, 0.45)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 60, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 48, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = 'rgba(180, 83, 9, 0.55)';
  ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('AIR MAIL', 0, -20);
  ctx.fillText('DHAKA GPO', 0, 5);
  ctx.fillText(new Date().toLocaleDateString('en-GB'), 0, 30);
  ctx.restore();

  // Main Letter Paper Card (Center)
  const cardX = 90;
  const cardY = 320;
  const cardW = width - 180;
  const cardH = 920;

  // Shadow for paper
  ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 20;

  // Paper base
  ctx.fillStyle = '#fffdf9';
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, [16, 16, 16, 16]);
  ctx.fill();

  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Ruled Notebook Lines
  ctx.strokeStyle = '#e2d9c8';
  ctx.lineWidth = 1.5;
  const lineSpacing = 48;
  for (let y = cardY + 110; y < cardY + cardH - 120; y += lineSpacing) {
    ctx.beginPath();
    ctx.moveTo(cardX + 40, y);
    ctx.lineTo(cardX + cardW - 40, y);
    ctx.stroke();
  }

  // Red Left Margin Line
  ctx.strokeStyle = '#fca5a5';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cardX + 90, cardY + 40);
  ctx.lineTo(cardX + 90, cardY + cardH - 40);
  ctx.stroke();

  // Wax Seal Badge at top center of paper
  ctx.fillStyle = '#991b1b';
  ctx.beginPath();
  ctx.arc(cardX + cardW / 2, cardY + 42, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#fef3c7';
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✉️', cardX + cardW / 2, cardY + 50);

  // Letter Content with Word Wrap
  const text = letter.content || '';
  ctx.textAlign = 'left';
  ctx.font = '36px "Galada", "Kalam", "Hind Siliguri", cursive, sans-serif';
  ctx.fillStyle = letter.inkColor === 'maroon' ? '#831843' : letter.inkColor === 'black' ? '#18181b' : '#1e3a8a';

  const maxTextWidth = cardW - 160;
  const startX = cardX + 110;
  let currentY = cardY + 140;

  // Wrap lines
  const words = text.split(/\s+/);
  let currentLine = '';
  for (let n = 0; n < words.length; n++) {
    const testLine = currentLine ? currentLine + ' ' + words[n] : words[n];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxTextWidth && n > 0) {
      ctx.fillText(currentLine, startX, currentY);
      currentLine = words[n];
      currentY += lineSpacing;
      if (currentY > cardY + cardH - 140) {
        currentLine += '...';
        break;
      }
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine && currentY <= cardY + cardH - 140) {
    ctx.fillText(currentLine, startX, currentY);
  }

  // Sender Metadata Footer inside Paper
  const metaY = cardY + cardH - 60;
  ctx.font = '22px "Hind Siliguri", sans-serif';
  ctx.fillStyle = '#6b7280';
  ctx.fillText(`📍 ${letter.senderLocation || 'অজ্ঞাত লোকেশন'}`, startX, metaY);

  const dateStr = new Date(letter.timestamp || letter.createdAt).toLocaleDateString('bn-BD', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  ctx.textAlign = 'right';
  ctx.fillText(`🕒 ${dateStr}`, cardX + cardW - 60, metaY);

  // Reply Box Placeholder for Instagram Story (Below paper)
  const replyBoxY = 1300;
  const replyBoxH = 380;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 3;
  ctx.setLineDash([12, 8]);
  ctx.beginPath();
  ctx.roundRect(cardX, replyBoxY, cardW, replyBoxH, [20, 20, 20, 20]);
  ctx.fill();
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 32px "Hind Siliguri", sans-serif';
  ctx.fillText('মাহিমের উত্তর / Reply:', width / 2, replyBoxY + 80);

  ctx.font = '26px "Hind Siliguri", sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('(ইনস্টাগ্রাম বা ফেসবুক স্টোরিতে টেক্সট টুল দিয়ে আপনার উত্তর লিখুন)', width / 2, replyBoxY + 140);
  ctx.font = '48px sans-serif';
  ctx.fillText('✍️💭', width / 2, replyBoxY + 230);

  // Bottom Branding Watermark
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('mahims.com/chithi', width / 2, height - 100);

  ctx.font = '20px "Hind Siliguri", sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('আপনার গোপন চিঠি পাঠাতে ভিজিট করুন', width / 2, height - 68);

  return canvas.toDataURL('image/png');
}

export function downloadBase64Image(dataUrl: string, filename = 'mahim-chithi-story.png') {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
