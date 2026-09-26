/**
 * High-Resolution Vintage Envelope Receipt Generator for Mahim Chithi.
 * Produces an authentic, gorgeous horizontal postal letter envelope (1000px x 640px)
 * with 3D envelope folds, airmail border, vintage postage stamp, postal cancellation mark,
 * Sender (প্রেরক), Recipient (প্রাপক: মাহিম),
 * and pinned keepsake token (without redundant text, strictly inside bounds).
 */

export interface ChithiReceiptData {
  dateStr: string;
  stampName: string;
  stampValue: string;
  stampIcon: string;
  tokenName?: string;
  tokenShortName?: string;
  tokenIcon?: string;
}

export async function generateChithiReceiptCard(data: ChithiReceiptData): Promise<string> {
  const canvas = document.createElement('canvas');
  const width = 1000;
  const height = 640;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');

  // Ensure fonts are ready
  if (typeof document !== 'undefined' && document.fonts) {
    try {
      await document.fonts.ready;
    } catch {}
  }

  // 1. Vintage Cream Envelope Background with Warm Vignette
  const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 100, width / 2, height / 2, 550);
  bgGrad.addColorStop(0, '#fef9ee');
  bgGrad.addColorStop(0.7, '#fbf0d8');
  bgGrad.addColorStop(1, '#f2e0c2');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle Organic Paper Texture Grain
  ctx.fillStyle = 'rgba(180, 83, 9, 0.028)';
  for (let i = 0; i < 26000; i++) {
    const rx = Math.random() * width;
    const ry = Math.random() * height;
    ctx.fillRect(rx, ry, 1.4, 1.4);
  }

  // 2. Realistic 3D Envelope Fold Creases (Subtle triangular flap geometry)
  ctx.save();
  ctx.strokeStyle = 'rgba(180, 83, 9, 0.08)';
  ctx.lineWidth = 1.5;

  // Top flap diagonal crease lines meeting in upper center
  ctx.beginPath();
  ctx.moveTo(32, 32);
  ctx.lineTo(width / 2, 280);
  ctx.lineTo(width - 32, 32);
  ctx.stroke();

  // Subtle flap shadow
  ctx.fillStyle = 'rgba(180, 83, 9, 0.025)';
  ctx.beginPath();
  ctx.moveTo(32, 32);
  ctx.lineTo(width / 2, 280);
  ctx.lineTo(width - 32, 32);
  ctx.closePath();
  ctx.fill();

  // Bottom flap diagonal crease lines
  ctx.beginPath();
  ctx.moveTo(32, height - 32);
  ctx.lineTo(width / 2, 340);
  ctx.lineTo(width - 32, height - 32);
  ctx.stroke();
  ctx.restore();

  // 3. Classic Airmail Par-Avion Slanted Striped Border (Red, White & Blue)
  const stripeW = 20;
  const borderThick = 18;
  const numHoriz = Math.ceil(width / stripeW);

  // Top border
  for (let i = 0; i < numHoriz; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#b91c1c' : '#1d4ed8';
    ctx.beginPath();
    ctx.moveTo(i * stripeW, 0);
    ctx.lineTo((i + 1) * stripeW, 0);
    ctx.lineTo((i + 1) * stripeW - 10, borderThick);
    ctx.lineTo(i * stripeW - 10, borderThick);
    ctx.closePath();
    ctx.fill();
  }

  // Bottom border
  for (let i = 0; i < numHoriz; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#1d4ed8' : '#b91c1c';
    ctx.beginPath();
    ctx.moveTo(i * stripeW, height - borderThick);
    ctx.lineTo((i + 1) * stripeW, height - borderThick);
    ctx.lineTo((i + 1) * stripeW - 10, height);
    ctx.lineTo(i * stripeW - 10, height);
    ctx.closePath();
    ctx.fill();
  }

  // Left & Right borders
  const numVert = Math.ceil(height / stripeW);
  for (let i = 0; i < numVert; i++) {
    // Left
    ctx.fillStyle = i % 2 === 0 ? '#b91c1c' : '#1d4ed8';
    ctx.beginPath();
    ctx.moveTo(0, i * stripeW);
    ctx.lineTo(borderThick, i * stripeW - 8);
    ctx.lineTo(borderThick, (i + 1) * stripeW - 8);
    ctx.lineTo(0, (i + 1) * stripeW);
    ctx.closePath();
    ctx.fill();

    // Right
    ctx.fillStyle = i % 2 === 0 ? '#1d4ed8' : '#b91c1c';
    ctx.beginPath();
    ctx.moveTo(width - borderThick, i * stripeW - 8);
    ctx.lineTo(width, i * stripeW);
    ctx.lineTo(width, (i + 1) * stripeW);
    ctx.lineTo(width - borderThick, (i + 1) * stripeW - 8);
    ctx.closePath();
    ctx.fill();
  }

  // 4. Inner Fine Double Border (Safe zone: 32px to 968px horizontally, 32px to 608px vertically)
  ctx.strokeStyle = '#cbb38d';
  ctx.lineWidth = 1.8;
  ctx.strokeRect(32, 32, width - 64, height - 64);

  ctx.strokeStyle = 'rgba(203, 179, 141, 0.4)';
  ctx.lineWidth = 0.8;
  ctx.strokeRect(36, 36, width - 72, height - 72);

  // 5. Top-Left: Vintage AIR MAIL / PAR AVION Postal Tag
  ctx.save();
  ctx.translate(55, 48);

  ctx.fillStyle = '#1e3a8a';
  ctx.beginPath();
  ctx.roundRect(0, 0, 150, 44, 6);
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(3, 3, 144, 38);

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('AIR MAIL ✈', 75, 16);
  ctx.font = 'bold 11px "Hind Siliguri", sans-serif';
  ctx.fillText('গোপন ডাকপত্র', 75, 31);
  ctx.restore();

  // Top Center Brand Title (NO "চিঠি ডট মি")
  ctx.textAlign = 'left';
  ctx.fillStyle = '#78350f';
  ctx.font = 'bold 27px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Mahim Chithi', 224, 70);

  ctx.fillStyle = '#b45309';
  ctx.font = 'bold 14px "Hind Siliguri", sans-serif';
  ctx.fillText('গোপন ডাকপত্র স্মারক', 224, 91);

  // 6. Top-Right: Vintage Postage Stamp
  const stampX = width - 176;
  const stampY = 48;
  const stampW = 118;
  const stampH = 146;

  ctx.save();
  ctx.translate(stampX + stampW / 2, stampY + stampH / 2);
  ctx.rotate(0.035);

  // Stamp Scalloped Border
  ctx.fillStyle = '#fefce8';
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.roundRect(-stampW / 2, -stampH / 2, stampW, stampH, 4);
  ctx.fill();
  ctx.stroke();
  ctx.setLineDash([]);

  // Stamp Inner Frame
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(-stampW / 2 + 6, -stampH / 2 + 6, stampW - 12, stampH - 12);

  // Stamp Title & Icon
  ctx.fillStyle = '#92400e';
  ctx.textAlign = 'center';
  ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('POSTAGE', 0, -stampH / 2 + 20);

  ctx.font = '36px sans-serif';
  ctx.fillText(data.stampIcon, 0, 7);

  ctx.fillStyle = '#78350f';
  ctx.font = 'bold 14px "Plus Jakarta Sans", "Hind Siliguri", sans-serif';
  ctx.fillText(data.stampValue, 0, stampH / 2 - 13);
  ctx.restore();

  // Postal Ink Cancellation Seal (GPO POSTED 2026 overlapping stamp)
  ctx.save();
  ctx.translate(stampX - 10, stampY + stampH / 2);
  ctx.rotate(-0.18);

  ctx.strokeStyle = 'rgba(185, 28, 28, 0.85)';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.arc(0, 0, 46, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, 39, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = 'rgba(185, 28, 28, 0.85)';
  ctx.textAlign = 'center';
  ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('GPO POSTED', 0, -21);
  ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('2026', 0, -3);
  ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('VERIFIED', 0, 14);

  // Wavy cancellation ink lines flying to the left
  ctx.beginPath();
  for (let row = -16; row <= 16; row += 16) {
    ctx.moveTo(-90, row);
    ctx.bezierCurveTo(-70, row - 6, -50, row + 6, -30, row);
  }
  ctx.stroke();
  ctx.restore();

  // 7. CLASSIC POSTAL ENVELOPE ADDRESS BLOCKS:
  // Left: প্রেরক (Sender)
  // Right (under stamp): প্রাপক (Recipient) - শুধুমাত্র "মাহিম"

  // SENDER (প্রেরক) - Left Block
  const senderX = 55;
  const senderY = 175;
  const senderW = 390;
  const senderH = 210;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.82)';
  ctx.beginPath();
  ctx.roundRect(senderX, senderY, senderW, senderH, 14);
  ctx.fill();
  ctx.strokeStyle = '#decbb0';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Sender Header
  ctx.textAlign = 'left';
  ctx.fillStyle = '#b45309';
  ctx.font = 'bold 15px "Hind Siliguri", sans-serif';
  ctx.fillText('প্রেরক (From):', senderX + 20, senderY + 32);

  // Sender Name
  ctx.fillStyle = '#1c1917';
  ctx.font = 'bold 22px "Hind Siliguri", sans-serif';
  ctx.fillText('গোপন প্রেরক', senderX + 20, senderY + 64);

  ctx.fillStyle = '#78716c';
  ctx.font = '13.5px "Hind Siliguri", sans-serif';
  ctx.fillText('পরিচয়: ১০০% বেনামী ও সুরক্ষিত 🔒', senderX + 20, senderY + 92);

  // Divider line
  ctx.strokeStyle = '#e7dec8';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(senderX + 20, senderY + 110);
  ctx.lineTo(senderX + senderW - 20, senderY + 110);
  ctx.stroke();

  // Delivery status
  ctx.fillStyle = '#065f46';
  ctx.font = 'bold 14px "Hind Siliguri", sans-serif';
  ctx.fillText('✓ স্থিতি: চিঠি ডাকবাক্সে জমা হয়েছে', senderX + 20, senderY + 138);

  ctx.fillStyle = '#57534e';
  ctx.font = '13px "Hind Siliguri", sans-serif';
  ctx.fillText(`তারিখ: ${data.dateStr}`, senderX + 20, senderY + 164);

  ctx.fillStyle = '#78716c';
  ctx.font = '12px "Hind Siliguri", sans-serif';
  ctx.fillText('ডাকঘর: মাহিমের গোপন চিঠির বাক্স', senderX + 20, senderY + 190);


  // RECIPIENT (প্রাপক) - Right Block (ডাকটিকেটের নিচে)
  // User instruction: "প্রাপক এর নাম শুধু থাকবে মাহিম"
  const recipX = 475;
  const recipY = 220;
  const recipW = 465;
  const recipH = 175;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
  ctx.beginPath();
  ctx.roundRect(recipX, recipY, recipW, recipH, 14);
  ctx.fill();
  ctx.strokeStyle = '#c2a170';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Recipient Header
  ctx.textAlign = 'left';
  ctx.fillStyle = '#92400e';
  ctx.font = 'bold 16px "Hind Siliguri", sans-serif';
  ctx.fillText('প্রাপক (To):', recipX + 24, recipY + 34);

  // Recipient Name - EXACTLY "মাহিম" only!
  ctx.fillStyle = '#1c1917';
  ctx.font = 'bold 36px "Hind Siliguri", sans-serif';
  ctx.fillText('মাহিম', recipX + 24, recipY + 78);

  // Subtitle
  ctx.fillStyle = '#78716c';
  ctx.font = '14.5px "Hind Siliguri", sans-serif';
  ctx.fillText('ঠিকানা: অন্তরের ডাকবাক্স', recipX + 24, recipY + 110);

  // Recipient Seal line
  ctx.strokeStyle = '#e7dec8';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(recipX + 24, recipY + 126);
  ctx.lineTo(recipX + recipW - 24, recipY + 126);
  ctx.stroke();

  ctx.fillStyle = '#b45309';
  ctx.font = 'bold 12.5px "Hind Siliguri", sans-serif';
  ctx.fillText('ডাক টিকিট সংলগ্ন • বিশেষ বেনামী ডাকপত্র', recipX + 24, recipY + 150);


  // 8. PINNED GIFT / KEEPSAKE TOKEN (if user attached a token)
  // User instruction: NO "পিন দিয়ে আটকানো" text! Just the pinned keepsake itself!
  if (data.tokenName || data.tokenShortName) {
    const giftName = data.tokenShortName || data.tokenName || 'উপহার';
    const giftIcon = data.tokenIcon || '🎁';

    ctx.save();
    // Position pinned token cleanly below sender block, well within margins
    const pinCardX = 55;
    const pinCardY = 412;
    const pinCardW = 230;
    const pinCardH = 56;

    ctx.translate(pinCardX + pinCardW / 2, pinCardY + pinCardH / 2);
    ctx.rotate(-0.06); // natural slight tilt

    // Keepsake Card Shadow & Body
    ctx.fillStyle = '#fffdf7';
    ctx.beginPath();
    ctx.roundRect(-pinCardW / 2, -pinCardH / 2, pinCardW, pinCardH, 10);
    ctx.fill();

    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Pinned Gift Icon
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = '28px sans-serif';
    ctx.fillText(giftIcon, -pinCardW / 2 + 14, 0);

    // Pinned Gift Name ONLY (NO redundant "পিন দিয়ে আটকানো" as requested!)
    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 17px "Hind Siliguri", sans-serif';
    ctx.fillText(giftName, -pinCardW / 2 + 52, 0);

    // DRAW REALISTIC GOLDEN PAPER CLIP CLAMPED OVER TOP EDGE
    const clipX = -pinCardW / 2 + 20;
    const clipY = -pinCardH / 2 - 10;

    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    // Outer loop
    ctx.moveTo(clipX, clipY + 34);
    ctx.lineTo(clipX, clipY + 8);
    ctx.arc(clipX + 7, clipY + 8, 7, Math.PI, 0, false);
    ctx.lineTo(clipX + 14, clipY + 38);
    ctx.arc(clipX + 9, clipY + 38, 5, 0, Math.PI, false);
    ctx.lineTo(clipX + 4, clipY + 18);
    ctx.stroke();

    // Metallic highlight line
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(clipX + 1, clipY + 30);
    ctx.lineTo(clipX + 1, clipY + 9);
    ctx.arc(clipX + 7, clipY + 9, 6, Math.PI, 0, false);
    ctx.stroke();

    ctx.restore();
  }

  // 9. Bottom-Right: Red Wax Seal Graphic
  ctx.save();
  ctx.translate(width - 125, height - 120);

  // Wax Seal outer jagged rim & shadow
  ctx.fillStyle = '#991b1b';
  ctx.beginPath();
  ctx.arc(0, 0, 50, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#b91c1c';
  ctx.beginPath();
  ctx.arc(0, 0, 42, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#f87171';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(0, 0, 36, 0, Math.PI * 2);
  ctx.stroke();

  // Seal lettering
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('MAHIM', 0, -14);
  ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('CHITHI', 0, 4);
  ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('SEALED', 0, 19);
  ctx.restore();

  // 10. BOTTOM FOOTER NOTE - STRICTLY INSIDE THE INNER BOX (Safe zone: y <= 590, border is at 608)
  // User instruction: "নিচের লেখাগুলো বাহিরে চলে গেছে , ঘরের মধ্যে আনো।"
  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  ctx.fillStyle = '#78716c';
  ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('mahims.com/chithi', 55, 542);

  ctx.fillStyle = '#8c827a';
  ctx.font = '13px "Hind Siliguri", sans-serif';
  ctx.fillText('মনের না বলা অনুভূতির চিরন্তন ডাকঘর • প্রেরকের পরিচয় চিরতরে গোপন', 55, 566);
  ctx.restore();

  return canvas.toDataURL('image/png');
}

/**
 * Trigger download of generated card
 */
export function downloadChithiReceiptCard(dataUrl: string): void {
  const link = document.createElement('a');
  link.download = `Mahim-Chithi-Envelope-${Date.now().toString().slice(-6)}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Web Share API support or returns false for fallback
 */
export async function shareChithiReceiptCard(dataUrl: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `Mahim-Chithi-Envelope.png`, { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Mahim Chithi Postal Receipt',
          text: `মাহিমকে একটি গোপন বেনামী চিঠি পাঠিয়েছি! 📮`,
          files: [file],
        });
        return true;
      }
    } catch {
      return false;
    }
  }
  return false;
}
