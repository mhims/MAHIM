import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const routes = ['about', 'skills', 'experience', 'education', 'blog', 'contact', 'wallet', 'salami', 'chithi', 'classroom'];

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
          '<meta name="keywords" content="Mahim Chithi, মাহিম চিঠি, Mahims Chithi, মাহিমস চিঠি, Mahim Chithi me, মাহিম চিঠি মি, mahim anonymous letter, চিঠি ডট মি মাহিম, chithi mahims, Mahim Ibne Khudi chithi" />'
        )
        .replace(
          /<link rel="canonical" href=".*?" \/>/,
          '<link rel="canonical" href="https://mahims.com/chithi" />'
        )
        .replace(
          /<meta property="og:title" content=".*?" \/>/,
          '<meta property="og:title" content="Mahim Chithi | মাহিম চিঠি — মনের না বলা কথা পাঠান গোপনে" />'
        )
        .replace(
          /<meta property="og:description" content=".*?" \/>/,
          '<meta property="og:description" content="মাহিমকে বেনামে চিঠি পাঠান। কোনো পরিচয় ছাড়াই আপনার মনের না বলা কথা, সিক্রেট অনুভূতি বা বার্তা পাঠান ১০০% নিরাপদে।" />'
        )
        .replace(
          /<meta property="og:url" content=".*?" \/>/,
          '<meta property="og:url" content="https://mahims.com/chithi" />'
        )
        .replace(
          /<meta property="og:site_name" content=".*?" \/>/,
          '<meta property="og:site_name" content="Mahim Chithi" />'
        )
        .replace(
          /<meta property="og:image" content=".*?" \/>/,
          '<meta property="og:image" content="https://mahims.com/assets/og-chithi.jpg" />'
        )
        .replace(
          /<meta property="og:image:secure_url" content=".*?" \/>/,
          '<meta property="og:image:secure_url" content="https://mahims.com/assets/og-chithi.jpg" />'
        )
        .replace(
          /<meta property="og:image:alt" content=".*?" \/>/,
          '<meta property="og:image:alt" content="Mahim Chithi - Vintage Letter and Anonymous Postal Box" />'
        )
        .replace(
          /<link rel="image_src" href=".*?" \/>/,
          '<link rel="image_src" href="https://mahims.com/assets/og-chithi.jpg" />'
        )
        .replace(
          /<meta property="twitter:url" content=".*?" \/>/,
          '<meta property="twitter:url" content="https://mahims.com/chithi" />'
        )
        .replace(
          /<meta property="twitter:title" content=".*?" \/>/,
          '<meta property="twitter:title" content="Mahim Chithi | মাহিম চিঠি — মনের না বলা কথা পাঠান গোপনে" />'
        )
        .replace(
          /<meta property="twitter:description" content=".*?" \/>/,
          '<meta property="twitter:description" content="মাহিমকে বেনামে চিঠি পাঠান। কোনো পরিচয় ছাড়াই আপনার মনের না বলা কথা বা সিক্রেট বার্তা পাঠান ১০০% নিরাপদে।" />'
        )
        .replace(
          /<meta property="twitter:image" content=".*?" \/>/,
          '<meta property="twitter:image" content="https://mahims.com/assets/og-chithi.jpg" />'
        );
    } else if (route === 'salami') {
      htmlContent = htmlContent
        .replace(/<title>.*?<\/title>/, '<title>Mahim Salami | মাহিম সালামি — ঈদ সালামি ট্র্যাকার ও পোর্টাল</title>')
        .replace(
          /<meta name="title" content=".*?" \/>/,
          '<meta name="title" content="Mahim Salami | মাহিম সালামি — ঈদ সালামি ট্র্যাকার ও পোর্টাল" />'
        )
        .replace(
          /<meta name="description" content=".*?" \/>/,
          '<meta name="description" content="Mahim Salami (মাহিম সালামি) - Mahim Ibne Khudi\'s official Eid Salami Tracker & Portal. Check your salami and send salami to Mahim online via bKash, Nagad or Rocket." />'
        )
        .replace(
          /<meta name="keywords" content=".*?" \/>/,
          '<meta name="keywords" content="mahim salami, Mahim salami, mahim eid salami, eid salami mahim, mahims salami, mahim salami tracker, মাহিম সালামি, ঈদ সালামি মাহিম, Mahim Ibne Khudi salami" />'
        )
        .replace(
          /<link rel="canonical" href=".*?" \/>/,
          '<link rel="canonical" href="https://mahims.com/salami" />'
        )
        .replace(
          /<meta property="og:title" content=".*?" \/>/,
          '<meta property="og:title" content="Mahim Salami | মাহিম সালামি — ঈদ সালামি ট্র্যাকার ও পোর্টাল" />'
        )
        .replace(
          /<meta property="og:description" content=".*?" \/>/,
          '<meta property="og:description" content="ঈদ মোবারক! মাহিমকে ঈদ সালামি পাঠান অথবা আপনার প্রাপ্ত সালামি চেক করুন বিকাশ, নগদ বা রকেটের মাধ্যমে।" />'
        )
        .replace(
          /<meta property="og:url" content=".*?" \/>/,
          '<meta property="og:url" content="https://mahims.com/salami" />'
        )
        .replace(
          /<meta property="og:site_name" content=".*?" \/>/,
          '<meta property="og:site_name" content="Mahim Salami" />'
        )
        .replace(
          /<meta property="og:image" content=".*?" \/>/,
          '<meta property="og:image" content="https://mahims.com/assets/og-salami.jpg" />'
        )
        .replace(
          /<meta property="og:image:secure_url" content=".*?" \/>/,
          '<meta property="og:image:secure_url" content="https://mahims.com/assets/og-salami.jpg" />'
        )
        .replace(
          /<meta property="og:image:alt" content=".*?" \/>/,
          '<meta property="og:image:alt" content="Mahim Salami - Eid Mubarak Celebration and Salami Portal" />'
        )
        .replace(
          /<link rel="image_src" href=".*?" \/>/,
          '<link rel="image_src" href="https://mahims.com/assets/og-salami.jpg" />'
        )
        .replace(
          /<meta property="twitter:url" content=".*?" \/>/,
          '<meta property="twitter:url" content="https://mahims.com/salami" />'
        )
        .replace(
          /<meta property="twitter:title" content=".*?" \/>/,
          '<meta property="twitter:title" content="Mahim Salami | মাহিম সালামি — ঈদ সালামি ট্র্যাকার ও পোর্টাল" />'
        )
        .replace(
          /<meta property="twitter:description" content=".*?" \/>/,
          '<meta property="twitter:description" content="ঈদ মোবারক! মাহিমকে ঈদ সালামি পাঠান অথবা আপনার প্রাপ্ত সালামি চেক করুন অনলাইন পোর্টালে।" />'
        )
        .replace(
          /<meta property="twitter:image" content=".*?" \/>/,
          '<meta property="twitter:image" content="https://mahims.com/assets/og-salami.jpg" />'
        );
    } else if (route === 'classroom') {
      htmlContent = htmlContent
        .replace(/<title>.*?<\/title>/, '<title>Mahim\'s Classroom | মাহিম ক্লাসরুম — একাডেমি ও এডমিশন প্ল্যাটফর্ম</title>')
        .replace(
          /<meta name="title" content=".*?" \/>/,
          '<meta name="title" content="Mahim\'s Classroom | মাহিম ক্লাসরুম — একাডেমি ও এডমিশন প্ল্যাটফর্ম" />'
        )
        .replace(
          /<meta name="description" content=".*?" \/>/,
          '<meta name="description" content="Mahim\'s Classroom (মাহিম ক্লাসরুম) - এইচএসসি, বিশ্ববিদ্যালয় ভর্তি প্রস্তুতি ও এসএসসি শিক্ষার্থীদের জন্য অনলাইন ভিত্তিক কনসেপ্ট ক্লাস এবং স্মার্ট এক্সাম প্ল্যাটফর্ম। প্রতিষ্ঠাতা: মাহিম (ঢাকা সেন্ট্রাল ইউনিভার্সিটি)।" />'
        )
        .replace(
          /<meta name="keywords" content=".*?" \/>/,
          '<meta name="keywords" content="Mahim\'s Classroom, মাহিম ক্লাসরুম, Mahims Classroom, Mahim Classroom, মাহিমস ক্লাসরুম, mahim classroom, এইচএসসি আইসিটি, এইচএসসি বাংলা, ভার্সিটি এডমিশন, এডমিশন এক্সাম ব্যাচ, এসএসসি স্মার্ট এক্সাম, মাহিম ঢাকা সেন্ট্রাল ইউনিভার্সিটি" />'
        )
        .replace(
          /<link rel="canonical" href=".*?" \/>/,
          '<link rel="canonical" href="https://mahims.com/classroom" />'
        )
        .replace(
          /<meta property="og:title" content=".*?" \/>/,
          '<meta property="og:title" content="Mahim\'s Classroom | মাহিম ক্লাসরুম — একাডেমি ও এডমিশন প্ল্যাটফর্ম" />'
        )
        .replace(
          /<meta property="og:description" content=".*?" \/>/,
          '<meta property="og:description" content="এইচএসসি, বিশ্ববিদ্যালয় ভর্তি প্রস্তুতি ও এসএসসি শিক্ষার্থীদের জন্য অনলাইন ভিত্তিক কনসেপ্ট ক্লাস এবং স্মার্ট এক্সাম সিস্টেম। প্রতিষ্ঠাতা: মাহিম (ঢাকা সেন্ট্রাল ইউনিভার্সিটি)।" />'
        )
        .replace(
          /<meta property="og:url" content=".*?" \/>/,
          '<meta property="og:url" content="https://mahims.com/classroom" />'
        )
        .replace(
          /<meta property="og:site_name" content=".*?" \/>/,
          '<meta property="og:site_name" content="Mahim\'s Classroom" />'
        )
        .replace(
          /<meta property="og:image" content=".*?" \/>/,
          '<meta property="og:image" content="https://mahims.com/assets/og-classroom.jpg" />'
        )
        .replace(
          /<meta property="og:image:secure_url" content=".*?" \/>/,
          '<meta property="og:image:secure_url" content="https://mahims.com/assets/og-classroom.jpg" />'
        )
        .replace(
          /<meta property="og:image:alt" content=".*?" \/>/,
          '<meta property="og:image:alt" content="Mahim\'s Classroom - Academic & Admission Learning Platform" />'
        )
        .replace(
          /<link rel="image_src" href=".*?" \/>/,
          '<link rel="image_src" href="https://mahims.com/assets/og-classroom.jpg" />'
        )
        .replace(
          /<meta property="twitter:url" content=".*?" \/>/,
          '<meta property="twitter:url" content="https://mahims.com/classroom" />'
        )
        .replace(
          /<meta property="twitter:title" content=".*?" \/>/,
          '<meta property="twitter:title" content="Mahim\'s Classroom | মাহিম ক্লাসরুম — একাডেমি ও এডমিশন প্ল্যাটফর্ম" />'
        )
        .replace(
          /<meta property="twitter:description" content=".*?" \/>/,
          '<meta property="twitter:description" content="এইচএসসি, বিশ্ববিদ্যালয় ভর্তি প্রস্তুতি ও এসএসসি শিক্ষার্থীদের জন্য অনলাইন ভিত্তিক কনসেপ্ট ক্লাস এবং স্মার্ট এক্সাম সিস্টেম।" />'
        )
        .replace(
          /<meta property="twitter:image" content=".*?" \/>/,
          '<meta property="twitter:image" content="https://mahims.com/assets/og-classroom.jpg" />'
        );
    }

    fs.writeFileSync(path.join(routeDir, 'index.html'), htmlContent, 'utf8');
  });

  console.log('✅ Clean route directories created in dist: ' + routes.join(', '));
}
