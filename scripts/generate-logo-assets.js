import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

// 1. Generate 800x800 Square Logo (for profile, logo.png, logo-square.jpg)
const squareLogoSvg = `
<svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradients -->
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="65%">
      <stop offset="0%" stop-color="#1f1a10" stop-opacity="1" />
      <stop offset="50%" stop-color="#0e0d0b" stop-opacity="1" />
      <stop offset="100%" stop-color="#050505" stop-opacity="1" />
    </radialGradient>

    <radialGradient id="centerAura" cx="50%" cy="45%" r="40%">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.28" />
      <stop offset="60%" stop-color="#d97706" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>

    <!-- Border Gradient -->
    <linearGradient id="frameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" stop-opacity="0.8" />
      <stop offset="30%" stop-color="#f59e0b" stop-opacity="0.5" />
      <stop offset="70%" stop-color="#b45309" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#fef08a" stop-opacity="0.6" />
    </linearGradient>

    <!-- Luxury Gold Facet Gradients for 'M' -->
    <linearGradient id="goldLight" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="25%" stop-color="#FDE047" />
      <stop offset="60%" stop-color="#EAB308" />
      <stop offset="100%" stop-color="#CA8A04" />
    </linearGradient>

    <linearGradient id="goldMid" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FACC15" />
      <stop offset="50%" stop-color="#EAB308" />
      <stop offset="100%" stop-color="#A16207" />
    </linearGradient>

    <linearGradient id="goldDeep" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#EAB308" />
      <stop offset="50%" stop-color="#B45309" />
      <stop offset="100%" stop-color="#78350F" />
    </linearGradient>

    <linearGradient id="goldSpecular" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.9" />
      <stop offset="50%" stop-color="#FEF08A" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#EAB308" stop-opacity="0.2" />
    </linearGradient>

    <!-- Drop Shadow Filter -->
    <filter id="luxuryShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.8" />
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#f59e0b" flood-opacity="0.25" />
    </filter>

    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect width="800" height="800" fill="url(#bgGlow)" />
  <circle cx="400" cy="400" r="340" fill="url(#centerAura)" />

  <!-- Outer Emblem Squircle Frame -->
  <rect x="70" y="70" width="660" height="660" rx="190" fill="#0c0b09" stroke="url(#frameGrad)" stroke-width="3" filter="url(#luxuryShadow)" />
  <rect x="85" y="85" width="630" height="630" rx="175" fill="none" stroke="#f59e0b" stroke-opacity="0.12" stroke-width="1.5" />

  <!-- Corner Precision Accents -->
  <circle cx="155" cy="155" r="3" fill="#facc15" opacity="0.6" />
  <circle cx="645" cy="155" r="3" fill="#facc15" opacity="0.6" />
  <circle cx="155" cy="645" r="3" fill="#facc15" opacity="0.6" />
  <circle cx="645" cy="645" r="3" fill="#facc15" opacity="0.6" />

  <!-- THE 'M' MONOGRAM GROUP -->
  <g filter="url(#luxuryShadow)" transform="translate(0, -10)">
    <!-- 1. Left Vertical Pillar -->
    <polygon points="195,570 195,230 275,230 275,570" fill="url(#goldMid)" />
    <!-- Left Pillar Highlight Edge -->
    <polygon points="195,230 210,230 210,570 195,570" fill="url(#goldSpecular)" />

    <!-- 2. Right Vertical Pillar -->
    <polygon points="525,570 525,230 605,230 605,570" fill="url(#goldDeep)" />
    <!-- Right Pillar Inner Highlight -->
    <polygon points="525,230 535,230 535,570 525,570" fill="#FEF08A" opacity="0.35" />

    <!-- 3. Left Inner Diagonal Chiseled Beam -->
    <polygon points="275,230 400,435 400,535 275,330" fill="url(#goldLight)" />
    <!-- Specular Ridge line along left diagonal -->
    <line x1="275" y1="230" x2="400" y2="435" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" filter="url(#softGlow)" />

    <!-- 4. Right Inner Diagonal Chiseled Beam -->
    <polygon points="525,230 400,435 400,535 525,330" fill="url(#goldDeep)" />

    <!-- 5. Central Facet Apex Diamond Core -->
    <polygon points="400,380 440,435 400,490 360,435" fill="url(#goldMid)" />
    <polygon points="400,380 440,435 400,435" fill="#FEF08A" opacity="0.6" />

    <!-- 6. Top Center Floating Starlet / Diamond (Crown) -->
    <polygon points="400,195 414,215 400,235 386,215" fill="url(#goldLight)" />
    <circle cx="400" cy="215" r="2" fill="#FFFFFF" />
  </g>

  <!-- Bottom Brand Signature -->
  <g transform="translate(400, 665)">
    <text text-anchor="middle" font-family="'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif" font-weight="800" font-size="28" letter-spacing="10" fill="#f3f4f6">
      MAHIM
    </text>
    <text y="24" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="600" font-size="12" letter-spacing="6" fill="#f59e0b">
      WORLD
    </text>
  </g>
</svg>
`;

// 2. Generate 1200x630 Social Banner (Standard Open Graph Facebook / WhatsApp / Twitter Preview)
const bannerLogoSvg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradients -->
    <radialGradient id="bgGlowWide" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#1c170d" stop-opacity="1" />
      <stop offset="45%" stop-color="#0c0b09" stop-opacity="1" />
      <stop offset="100%" stop-color="#040404" stop-opacity="1" />
    </radialGradient>

    <radialGradient id="emblemGlow" cx="280" cy="315" r="260">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.25" />
      <stop offset="60%" stop-color="#d97706" stop-opacity="0.05" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>

    <!-- Gold Gradients for 'M' -->
    <linearGradient id="goldLightW" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="25%" stop-color="#FDE047" />
      <stop offset="60%" stop-color="#EAB308" />
      <stop offset="100%" stop-color="#CA8A04" />
    </linearGradient>

    <linearGradient id="goldMidW" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FACC15" />
      <stop offset="50%" stop-color="#EAB308" />
      <stop offset="100%" stop-color="#A16207" />
    </linearGradient>

    <linearGradient id="goldDeepW" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#EAB308" />
      <stop offset="50%" stop-color="#B45309" />
      <stop offset="100%" stop-color="#78350F" />
    </linearGradient>

    <linearGradient id="frameGradW" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" stop-opacity="0.75" />
      <stop offset="35%" stop-color="#f59e0b" stop-opacity="0.45" />
      <stop offset="70%" stop-color="#b45309" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#fef08a" stop-opacity="0.55" />
    </linearGradient>

    <filter id="shadowW" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="22" flood-color="#000000" flood-opacity="0.75" />
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#f59e0b" flood-opacity="0.2" />
    </filter>

    <filter id="softGlowW" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Deep Canvas -->
  <rect width="1200" height="630" fill="url(#bgGlowWide)" />
  <circle cx="280" cy="315" r="260" fill="url(#emblemGlow)" />

  <!-- Subtle Ambient Tech Grid Lines -->
  <g stroke="#ffffff" stroke-opacity="0.03" stroke-width="1">
    <line x1="0" y1="105" x2="1200" y2="105" />
    <line x1="0" y1="210" x2="1200" y2="210" />
    <line x1="0" y1="315" x2="1200" y2="315" />
    <line x1="0" y1="420" x2="1200" y2="420" />
    <line x1="0" y1="525" x2="1200" y2="525" />
    <line x1="280" y1="0" x2="280" y2="630" />
    <line x1="560" y1="0" x2="560" y2="630" />
    <line x1="840" y1="0" x2="840" y2="630" />
  </g>

  <!-- LEFT SIDE: THE ICONIC 'M' MONOGRAM EMBLEM -->
  <g transform="translate(90, 125)" filter="url(#shadowW)">
    <!-- Squircle Frame (380 x 380) -->
    <rect x="0" y="0" width="380" height="380" rx="105" fill="#0d0c09" stroke="url(#frameGradW)" stroke-width="2.5" />
    <rect x="10" y="10" width="360" height="360" rx="95" fill="none" stroke="#f59e0b" stroke-opacity="0.12" stroke-width="1.2" />

    <!-- Corner Dots -->
    <circle cx="45" cy="45" r="2.5" fill="#facc15" opacity="0.6" />
    <circle cx="335" cy="45" r="2.5" fill="#facc15" opacity="0.6" />
    <circle cx="45" cy="335" r="2.5" fill="#facc15" opacity="0.6" />
    <circle cx="335" cy="335" r="2.5" fill="#facc15" opacity="0.6" />

    <!-- Scaled M inside the squircle (origin ~380x380) -->
    <g transform="translate(190, 185) scale(0.58) translate(-400, -390)">
      <!-- Left Pillar -->
      <polygon points="195,570 195,230 275,230 275,570" fill="url(#goldMidW)" />
      <polygon points="195,230 210,230 210,570 195,570" fill="#FFFFFF" opacity="0.75" />

      <!-- Right Pillar -->
      <polygon points="525,570 525,230 605,230 605,570" fill="url(#goldDeepW)" />
      <polygon points="525,230 535,230 535,570 525,570" fill="#FEF08A" opacity="0.35" />

      <!-- Left Diagonal -->
      <polygon points="275,230 400,435 400,535 275,330" fill="url(#goldLightW)" />
      <line x1="275" y1="230" x2="400" y2="435" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" filter="url(#softGlowW)" />

      <!-- Right Diagonal -->
      <polygon points="525,230 400,435 400,535 525,330" fill="url(#goldDeepW)" />

      <!-- Center Diamond Core -->
      <polygon points="400,380 440,435 400,490 360,435" fill="url(#goldMidW)" />
      <polygon points="400,380 440,435 400,435" fill="#FEF08A" opacity="0.6" />

      <!-- Crown Diamond -->
      <polygon points="400,195 414,215 400,235 386,215" fill="url(#goldLightW)" />
      <circle cx="400" cy="215" r="2" fill="#FFFFFF" />
    </g>
  </g>

  <!-- RIGHT SIDE: BRAND TYPOGRAPHY & IDENTITY -->
  <g transform="translate(540, 160)">
    <!-- Small Category Pill -->
    <rect x="0" y="0" width="230" height="34" rx="17" fill="#f59e0b" fill-opacity="0.12" stroke="#f59e0b" stroke-opacity="0.3" stroke-width="1" />
    <circle cx="18" cy="17" r="4" fill="#f59e0b" />
    <text x="32" y="22" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="700" font-size="12" letter-spacing="3" fill="#f59e0b">
      OFFICIAL ECOSYSTEM
    </text>

    <!-- Main Title "MAHIM'S WORLD" -->
    <text x="0" y="95" font-family="'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif" font-weight="900" font-size="62" letter-spacing="2" fill="#FFFFFF">
      Mahim's World
    </text>

    <!-- Bengali Title Line -->
    <text x="0" y="145" font-family="'Hind Siliguri', sans-serif" font-weight="600" font-size="28" fill="#d4d4d8">
      মাহিম ইবনে খুদি — ডিজিটাল ইউনিভার্স
    </text>

    <!-- Divider -->
    <line x1="0" y1="180" x2="520" y2="180" stroke="#f59e0b" stroke-opacity="0.3" stroke-width="1.5" />

    <!-- Ecosystem Pillars -->
    <g transform="translate(0, 215)">
      <!-- Item 1 -->
      <circle cx="6" cy="6" r="3" fill="#f59e0b" />
      <text x="18" y="10" font-family="'Hind Siliguri', sans-serif" font-weight="500" font-size="17" fill="#a1a1aa">
        Mahim's Classroom
      </text>

      <!-- Item 2 -->
      <circle cx="190" cy="6" r="3" fill="#f59e0b" />
      <text x="202" y="10" font-family="'Hind Siliguri', sans-serif" font-weight="500" font-size="17" fill="#a1a1aa">
        Portfolio &amp; CV
      </text>

      <!-- Item 3 -->
      <circle cx="340" cy="6" r="3" fill="#f59e0b" />
      <text x="352" y="10" font-family="'Hind Siliguri', sans-serif" font-weight="500" font-size="17" fill="#a1a1aa">
        Tech &amp; Thoughts
      </text>
    </g>

    <!-- Website URL badge at bottom -->
    <g transform="translate(0, 270)">
      <text font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="800" font-size="20" letter-spacing="3" fill="#facc15">
        mahims.com
      </text>
    </g>
  </g>
</svg>
`;

async function generateAllAssets() {
  console.log('Rendering high-res brand logo assets via Sharp...');

  // 1. public/logo.png (800x800 PNG)
  await sharp(Buffer.from(squareLogoSvg))
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.resolve('public/logo.png'));
  console.log('✓ public/logo.png generated');

  // 2. public/assets/logo-square.jpg (800x800 JPEG)
  await sharp(Buffer.from(squareLogoSvg))
    .jpeg({ quality: 95, chromaSubsampling: '4:4:4' })
    .toFile(path.resolve('public/assets/logo-square.jpg'));
  console.log('✓ public/assets/logo-square.jpg generated');

  // 3. public/assets/og-main.png (1200x630 PNG)
  await sharp(Buffer.from(bannerLogoSvg))
    .png({ quality: 100, compressionLevel: 8 })
    .toFile(path.resolve('public/assets/og-main.png'));
  console.log('✓ public/assets/og-main.png generated');

  // 4. public/og-image.png (1200x630 PNG root fallback)
  await sharp(Buffer.from(bannerLogoSvg))
    .png({ quality: 100, compressionLevel: 8 })
    .toFile(path.resolve('public/og-image.png'));
  console.log('✓ public/og-image.png generated');

  // 5. public/assets/og-preview.jpg (1200x630 JPEG)
  await sharp(Buffer.from(bannerLogoSvg))
    .jpeg({ quality: 95, chromaSubsampling: '4:4:4' })
    .toFile(path.resolve('public/assets/og-preview.jpg'));
  console.log('✓ public/assets/og-preview.jpg generated');

  // 6. Favicon 192x192 & 512x512 with the new iconic M logo
  await sharp(Buffer.from(squareLogoSvg))
    .resize(512, 512)
    .png()
    .toFile(path.resolve('public/android-chrome-512x512.png'));

  await sharp(Buffer.from(squareLogoSvg))
    .resize(192, 192)
    .png()
    .toFile(path.resolve('public/android-chrome-192x192.png'));

  await sharp(Buffer.from(squareLogoSvg))
    .resize(180, 180)
    .png()
    .toFile(path.resolve('public/apple-touch-icon.png'));

  // Google Search Favicon must be multiples of 48px (48x48, 96x96, 144x144, 192x192)
  const icon96Buf = await sharp(Buffer.from(squareLogoSvg)).resize(96, 96).png().toBuffer();
  fs.writeFileSync(path.resolve('public/favicon-96x96.png'), icon96Buf);

  const icon48Buf = await sharp(Buffer.from(squareLogoSvg)).resize(48, 48).png().toBuffer();
  fs.writeFileSync(path.resolve('public/favicon-48x48.png'), icon48Buf);

  const icon32Buf = await sharp(Buffer.from(squareLogoSvg)).resize(32, 32).png().toBuffer();
  fs.writeFileSync(path.resolve('public/favicon-32x32.png'), icon32Buf);

  const icon16Buf = await sharp(Buffer.from(squareLogoSvg)).resize(16, 16).png().toBuffer();
  fs.writeFileSync(path.resolve('public/favicon-16x16.png'), icon16Buf);

  const icon64Buf = await sharp(Buffer.from(squareLogoSvg)).resize(64, 64).png().toBuffer();
  const icon128Buf = await sharp(Buffer.from(squareLogoSvg)).resize(128, 128).png().toBuffer();
  const icon256Buf = await sharp(Buffer.from(squareLogoSvg)).resize(256, 256).png().toBuffer();

  // Create real multi-size favicon.ico (including Google-required 48x48)
  const icoBuffer = await pngToIco([icon16Buf, icon32Buf, icon48Buf, icon64Buf, icon96Buf, icon128Buf, icon256Buf]);
  fs.writeFileSync(path.resolve('public/favicon.ico'), icoBuffer);
  console.log('✓ public/favicon.ico (multi-size: 16, 32, 48, 64, 96, 128, 256) generated');

  // SVG Favicon for modern browser tabs and Google Search SVG support
  const faviconSvg = `
<svg width="128" height="128" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="favGoldLight" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="35%" stop-color="#FDE047" />
      <stop offset="70%" stop-color="#EAB308" />
      <stop offset="100%" stop-color="#CA8A04" />
    </linearGradient>
    <linearGradient id="favGoldMid" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FACC15" />
      <stop offset="50%" stop-color="#EAB308" />
      <stop offset="100%" stop-color="#A16207" />
    </linearGradient>
    <linearGradient id="favGoldDeep" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#EAB308" />
      <stop offset="50%" stop-color="#B45309" />
      <stop offset="100%" stop-color="#78350F" />
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="28" fill="#0c0b09" stroke="#f59e0b" stroke-width="2.5" stroke-opacity="0.6" />
  <polygon points="12,84 12,22 27,22 27,84" fill="url(#favGoldMid)" />
  <polygon points="12,22 16,22 16,84 12,84" fill="#FFFFFF" opacity="0.8" />
  <polygon points="73,84 73,22 88,22 88,84" fill="url(#favGoldDeep)" />
  <polygon points="73,22 76,22 76,84 73,84" fill="#FEF08A" opacity="0.4" />
  <polygon points="27,22 50,58 50,76 27,39" fill="url(#favGoldLight)" />
  <line x1="27" y1="22" x2="50" y2="58" stroke="#FFFFFF" stroke-width="1.5" />
  <polygon points="73,22 50,58 50,76 73,39" fill="url(#favGoldDeep)" />
  <polygon points="50,48 56,58 50,68 44,58" fill="url(#favGoldMid)" />
  <polygon points="50,14 53,19 50,23 47,19" fill="url(#favGoldLight)" />
</svg>
`.trim();
  fs.writeFileSync(path.resolve('public/favicon.svg'), faviconSvg, 'utf8');
  console.log('✓ public/favicon.svg generated');

  console.log('✓ All brand icons, favicons, and social cards generated successfully!');
}

generateAllAssets().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
