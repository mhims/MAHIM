import { ChithiLetter } from '../types/chithi';

/**
 * Robust text wrapping helper that handles:
 * 1. Paragraph breaks & newlines (\n)
 * 2. Space-separated words
 * 3. Unbroken strings / long URLs / words exceeding maxWidth (splits character by character)
 * NEVER overflows horizontally beyond maxWidth under any circumstance.
 */
function wrapTextLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  if (!text) return [];

  const rawParagraphs = text.split(/\r?\n/);
  const resultLines: string[] = [];

  for (let pIdx = 0; pIdx < rawParagraphs.length; pIdx++) {
    const paragraph = rawParagraphs[pIdx].trim();
    if (!paragraph) {
      if (resultLines.length > 0 && resultLines[resultLines.length - 1] !== '') {
        resultLines.push('');
      }
      continue;
    }

    const words = paragraph.split(/\s+/);
    let currentLine = '';

    for (let wIdx = 0; wIdx < words.length; wIdx++) {
      const word = words[wIdx];
      if (!word) continue;

      const wordWidth = ctx.measureText(word).width;

      // If a single word or unbroken string is wider than maxWidth, break character by character
      if (wordWidth > maxWidth) {
        if (currentLine) {
          resultLines.push(currentLine);
          currentLine = '';
        }

        let chunk = '';
        for (let c = 0; c < word.length; c++) {
          const char = word[c];
          const testChunk = chunk + char;
          if (ctx.measureText(testChunk).width > maxWidth) {
            if (chunk) resultLines.push(chunk);
            chunk = char;
          } else {
            chunk = testChunk;
          }
        }
        if (chunk) {
          currentLine = chunk;
        }
        continue;
      }

      // Normal word flow
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (ctx.measureText(testLine).width > maxWidth) {
        if (currentLine) resultLines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      resultLines.push(currentLine);
    }
  }

  return resultLines;
}

/**
 * Calculates adaptive font size & line spacing based on letter content length.
 * - Short text (<= 150 chars): large 34px font, 52px line spacing (compact aesthetic card)
 * - Medium text (151 - 350 chars): 30px font, 46px line spacing
 * - Long text (351 - 650 chars): 26px font, 40px line spacing
 * - Very long text (651+ chars): 22px font, 35px line spacing
 */
function getAdaptiveLetterTypography(contentLength: number) {
  if (contentLength <= 150) {
    return {
      fontSize: 34,
      lineSpacing: 52,
      font: '34px "Galada", "Kalam", "Hind Siliguri", cursive, sans-serif',
    };
  } else if (contentLength <= 350) {
    return {
      fontSize: 30,
      lineSpacing: 46,
      font: '30px "Galada", "Kalam", "Hind Siliguri", cursive, sans-serif',
    };
  } else if (contentLength <= 650) {
    return {
      fontSize: 26,
      lineSpacing: 40,
      font: '26px "Galada", "Kalam", "Hind Siliguri", cursive, sans-serif',
    };
  } else {
    return {
      fontSize: 22,
      lineSpacing: 35,
      font: '22px "Galada", "Kalam", "Hind Siliguri", cursive, sans-serif',
    };
  }
}

/**
 * Adaptive Canvas Story Card Generator
 * - Short text keeps original compact, balanced dimensions
 * - Long text gracefully expands card height and overall image height
 * - Unbreakable strings and long words never overflow horizontally
 * - Ruled notebook lines align with handwriting baseline
 */
export async function generateStoryImage(letter: ChithiLetter, customReplyText?: string): Promise<string> {
  const width = 1080;
  const cardX = 90;
  const cardW = width - 180; // 900px
  const startX = cardX + 110; // ~200px (leaves 25px right of red margin line)
  const letterMaxTextW = cardW - 110 - 45; // ~745px available width
  const replyMaxTextW = cardW - 80; // ~820px available width

  // Temporary canvas to measure text lines accurately
  const measureCanvas = document.createElement('canvas');
  const measureCtx = measureCanvas.getContext('2d');
  if (!measureCtx) throw new Error('Could not get measurement context');

  // Determine adaptive typography for letter
  const trimmedLetterContent = (letter.content || '').trim();
  const typo = getAdaptiveLetterTypography(trimmedLetterContent.length);

  measureCtx.font = typo.font;
  const letterLines = wrapTextLines(measureCtx, trimmedLetterContent, letterMaxTextW);
  const letterLineCount = Math.max(1, letterLines.length);

  // Calculate dynamic paper card height
  // Top header inside card = 105px (wax seal + breathing room)
  // Text content = letterLineCount * lineSpacing
  // Bottom metadata footer = 65px
  // Minimum card height = 260px (for short messages)
  const calculatedCardH = 105 + letterLineCount * typo.lineSpacing + 65;
  const cardH = Math.max(260, calculatedCardH);

  // Measure reply content lines (if reply provided)
  const hasReply = Boolean(customReplyText && customReplyText.trim());
  let replyLines: string[] = [];
  let replyBoxH = 210; // Default height for blank template

  if (hasReply) {
    const trimmedReply = customReplyText!.trim();
    const replyFontSize = trimmedReply.length > 300 ? 25 : 29;
    const replyLineSpacing = replyFontSize === 25 ? 38 : 44;
    measureCtx.font = `${replyFontSize}px "Hind Siliguri", sans-serif`;
    replyLines = wrapTextLines(measureCtx, trimmedReply, replyMaxTextW);
    const replyLinesH = Math.max(1, replyLines.length) * replyLineSpacing;
    replyBoxH = Math.max(180, 95 + replyLinesH + 35);
  }

  // Calculate dynamic canvas total height
  const topHeaderH = 300;
  const cardY = topHeaderH;
  const gap = 34;
  const replyBoxY = cardY + cardH + gap;
  const bottomWatermarkH = 135;
  const height = replyBoxY + replyBoxH + bottomWatermarkH;

  // Create final canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D canvas context');

  // Background gradient: Vintage Warm Sand to Ivory
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#fbf7ee');
  bgGrad.addColorStop(0.5, '#f6f0e2');
  bgGrad.addColorStop(1, '#ece3ce');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle Vintage Outer Border
  ctx.strokeStyle = '#d9ccb4';
  ctx.lineWidth = 4;
  ctx.strokeRect(32, 32, width - 64, height - 64);

  // Top Airmail Stripes Banner
  const stripeH = 16;
  const stripeW = 40;
  for (let x = 36; x < width - 36; x += stripeW * 2) {
    ctx.fillStyle = '#dc2626'; // Red
    ctx.beginPath();
    ctx.moveTo(x, 36);
    ctx.lineTo(x + stripeW, 36);
    ctx.lineTo(x + stripeW - 10, 36 + stripeH);
    ctx.lineTo(x - 10, 36 + stripeH);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#2563eb'; // Blue
    ctx.beginPath();
    ctx.moveTo(x + stripeW, 36);
    ctx.lineTo(x + stripeW * 2, 36);
    ctx.lineTo(x + stripeW * 2 - 10, 36 + stripeH);
    ctx.lineTo(x + stripeW - 10, 36 + stripeH);
    ctx.closePath();
    ctx.fill();
  }

  // Header Stamp: MAHIM CHITHI
  ctx.fillStyle = '#78350f';
  ctx.font = 'bold 38px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('MAHIM CHITHI', width / 2, 135);

  ctx.font = '22px "Hind Siliguri", sans-serif';
  ctx.fillStyle = '#92400e';
  ctx.fillText('— গোপন চিঠি ও উত্তর / Anonymous Letter & Reply —', width / 2, 178);

  // Vintage Postage Stamp on Top Right
  const stampX = width - 235;
  const stampY = 75;
  ctx.save();
  ctx.translate(stampX, stampY);
  ctx.rotate((4 * Math.PI) / 180);
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(0, 0, 145, 175);
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 3;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(4, 4, 137, 167);
  ctx.setLineDash([]);

  // Stamp inner artwork
  ctx.fillStyle = '#78350f';
  ctx.font = 'bold 19px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('BANGLADESH', 72, 34);
  ctx.font = 'bold 42px sans-serif';
  ctx.fillText('🕊️', 72, 92);
  ctx.font = 'bold 20px "Hind Siliguri", sans-serif';
  ctx.fillText('চিঠি ২০২৬', 72, 136);
  ctx.font = '15px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('৳ ১.০০', 72, 160);
  ctx.restore();

  // Postal Circular Ink Seal Stamp (Left)
  ctx.save();
  ctx.translate(155, 175);
  ctx.rotate((-12 * Math.PI) / 180);
  ctx.strokeStyle = 'rgba(180, 83, 9, 0.45)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 58, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 46, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = 'rgba(180, 83, 9, 0.55)';
  ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('AIR MAIL', 0, -20);
  ctx.fillText('DHAKA GPO', 0, 4);
  ctx.fillText(new Date().toLocaleDateString('en-GB'), 0, 28);
  ctx.restore();

  // ================= MAIN LETTER PAPER CARD =================
  // Paper Shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
  ctx.shadowBlur = 32;
  ctx.shadowOffsetY = 16;

  // Paper base
  ctx.fillStyle = '#fffdfa';
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, [16, 16, 16, 16]);
  ctx.fill();

  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Paper subtle border
  ctx.strokeStyle = '#e8decb';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Ruled Notebook Lines
  ctx.strokeStyle = '#e8dfd1';
  ctx.lineWidth = 1.5;
  const ruledStart = cardY + 115;
  const ruledEnd = cardY + cardH - 55;
  for (let y = ruledStart; y <= ruledEnd; y += typo.lineSpacing) {
    ctx.beginPath();
    ctx.moveTo(cardX + 36, y);
    ctx.lineTo(cardX + cardW - 36, y);
    ctx.stroke();
  }

  // Red Left Margin Line
  ctx.strokeStyle = '#fca5a5';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cardX + 85, cardY + 30);
  ctx.lineTo(cardX + 85, cardY + cardH - 30);
  ctx.stroke();

  // Wax Seal Badge at top center of paper
  ctx.fillStyle = '#991b1b';
  ctx.beginPath();
  ctx.arc(cardX + cardW / 2, cardY + 40, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#fef3c7';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✉️', cardX + cardW / 2, cardY + 47);

  // Letter Content
  ctx.textAlign = 'left';
  ctx.font = typo.font;
  ctx.fillStyle =
    letter.inkColor === 'maroon' ? '#831843' : letter.inkColor === 'black' ? '#18181b' : '#1e3a8a';

  // Text baseline is positioned 7px above ruled line so characters rest neatly on the notebook rule
  let textBaselineY = cardY + 108;
  for (const line of letterLines) {
    if (line) {
      ctx.fillText(line, startX, textBaselineY);
    }
    textBaselineY += typo.lineSpacing;
  }

  // Footer inside Paper (Date & Anonymous status)
  const metaY = cardY + cardH - 30;
  ctx.font = '21px "Hind Siliguri", sans-serif';
  ctx.fillStyle = '#6b7280';
  ctx.fillText(`🔒 ১০০% বেনামী বার্তা`, startX, metaY);

  const dateStr = new Date(letter.timestamp || letter.createdAt).toLocaleDateString('bn-BD', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  ctx.textAlign = 'right';
  ctx.fillText(`🕒 ${dateStr}`, cardX + cardW - 45, metaY);

  // ================= REPLY BOX (LIGHT MODE) =================
  if (hasReply) {
    // Crisp, elegant Light Mode card
    ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 12;

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(cardX, replyBoxY, cardW, replyBoxH, [18, 18, 18, 18]);
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Warm border
    ctx.strokeStyle = '#e2d9c8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Header: "উত্তর / Reply:" (Clean and without personal branding)
    ctx.fillStyle = '#78350f'; // Rich warm brown
    ctx.font = 'bold 28px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('💬 উত্তর / Reply:', cardX + 40, replyBoxY + 52);

    // Subtle divider line
    ctx.strokeStyle = '#f1ece1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cardX + 40, replyBoxY + 74);
    ctx.lineTo(cardX + cardW - 40, replyBoxY + 74);
    ctx.stroke();

    // Reply Text (Dark high-contrast legible font)
    const trimmedReply = customReplyText!.trim();
    const replyFontSize = trimmedReply.length > 300 ? 25 : 29;
    const replyLineSpacing = replyFontSize === 25 ? 38 : 44;
    ctx.fillStyle = '#18181b';
    ctx.font = `${replyFontSize}px "Hind Siliguri", sans-serif`;
    let rY = replyBoxY + 116;
    for (const rLine of replyLines) {
      if (rLine) {
        ctx.fillText(rLine, cardX + 40, rY);
      }
      rY += replyLineSpacing;
    }
  } else {
    // Blank Reply Box for manual Instagram/Facebook Story text overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.strokeStyle = '#d4c5a9';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([10, 6]);
    ctx.beginPath();
    ctx.roundRect(cardX, replyBoxY, cardW, replyBoxH, [18, 18, 18, 18]);
    ctx.fill();
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 28px "Hind Siliguri", sans-serif';
    ctx.fillText('উত্তর / Reply:', width / 2, replyBoxY + 65);

    ctx.font = '22px "Hind Siliguri", sans-serif';
    ctx.fillStyle = '#71717a';
    ctx.fillText('(ইনস্টাগ্রাম বা ফেসবুক স্টোরিতে টেক্সট দিয়ে উত্তর লিখুন)', width / 2, replyBoxY + 115);

    ctx.font = '38px sans-serif';
    ctx.fillText('✍️💭', width / 2, replyBoxY + 170);
  }

  // ================= BOTTOM WATERMARK =================
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('mahims.com/chithi', width / 2, height - 70);

  ctx.font = '19px "Hind Siliguri", sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('গোপন চিঠি পাঠাতে ভিজিট করুন', width / 2, height - 40);

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
