import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const routes = ['about', 'skills', 'experience', 'education', 'blog', 'contact', 'wallet', 'salami', 'chithi'];

if (fs.existsSync(distDir)) {
  const rootIndexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

  routes.forEach((route) => {
    const routeDir = path.join(distDir, route);
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }
    
    let htmlContent = rootIndexHtml;
    // Ensure all asset paths are absolute
    htmlContent = htmlContent.replace(/\.\/assets\//g, '/assets/');
    htmlContent = htmlContent.replace(/\.\/favicon/g, '/favicon');

    if (route === 'wallet') {
      htmlContent = htmlContent
        .replace(/<title>.*?<\/title>/, '<title>Personal Vault | Mahim</title>')
        .replace(
          /<meta name="robots" content=".*?" \/>/,
          '<meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />'
        )
        .replace(
          /class="bg-\[#fdfdfb\] text-\[#1a1a1a\]/,
          'class="bg-neutral-950 text-neutral-100'
        );
    } else if (route === 'chithi') {
      htmlContent = htmlContent
        .replace(/<title>.*?<\/title>/, '<title>Mahim Chithi | মাহিম চিঠি - চিঠি ডট মি (Mahims Chithi)</title>')
        .replace(
          /<meta name="title" content=".*?" \/>/,
          '<meta name="title" content="Mahim Chithi | মাহিম চিঠি - চিঠি ডট মি (Mahims Chithi)" />'
        )
        .replace(
          /<meta name="description" content=".*?" \/>/,
          '<meta name="description" content="Mahim Chithi (মাহিম চিঠি) - Mahim Ibne Khudi কে বেনামে চিঠি পাঠান। মনের না বলা কথা, সিক্রেট অনুভূতি বা বার্তা পাঠান সম্পূর্ণ গোপনে ও নিরাপদে।" />'
        )
        .replace(
          /<meta name="keywords" content=".*?" \/>/,
          '<meta name="keywords" content="Mahim Chithi, মাহিম চিঠি, Mahims Chithi, মাহিমস চিঠি, Mahim Chithi me, মাহিম চিঠি মি, mahim anonymous letter, চিঠি ডট মি মাহিম, chithi mahims" />'
        )
        .replace(
          /<link rel="canonical" href=".*?" \/>/,
          '<link rel="canonical" href="https://mahims.com/chithi" />'
        );
    }

    fs.writeFileSync(path.join(routeDir, 'index.html'), htmlContent, 'utf8');
  });

  console.log('✅ Clean route directories created in dist: ' + routes.join(', '));
}
