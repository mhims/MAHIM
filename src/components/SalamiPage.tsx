import React, { useEffect } from 'react';

export function SalamiPage() {
  const scriptUrl = "https://script.google.com/macros/s/AKfycbxrBZ9EGkIrbrdAyC5f-SSfQkY8HYdN_I745ZcccfJWrJbV0pu6GmVYycQD7hrf5lPJTg/exec";

  useEffect(() => {
    document.title = "Mahim Salami | মাহিম সালামি — ঈদ সালামি ট্র্যাকার ও পোর্টাল";

    const metaTags: Record<string, string> = {
      'title': 'Mahim Salami | Eid Salami Tracker - Mahim Ibne Khudi',
      'description': 'Mahim Salami (মাহিম সালামি) - Mahim Ibne Khudi\'s official Eid Salami Tracker & Portal. Check your salami and send salami to Mahim online via bKash, Nagad or Rocket.',
      'keywords': 'mahim salami, Mahim salami, mahim eid salami, eid salami mahim, mahims salami, mahim salami tracker, মাহিম সালামি, ঈদ সালামি মাহিম, Mahim Ibne Khudi salami',
      'robots': 'index, follow, max-image-preview:large',
    };

    Object.entries(metaTags).forEach(([name, val]) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', val);
    });

    const ogTags: Record<string, string> = {
      'og:title': 'Mahim Salami | মাহিম সালামি — ঈদ সালামি ট্র্যাকার ও পোর্টাল',
      'og:description': 'ঈদ মোবারক! মাহিমকে ঈদ সালামি পাঠান অথবা আপনার প্রাপ্ত সালামি চেক করুন বিকাশ, নগদ বা রকেটের মাধ্যমে।',
      'og:url': 'https://mahims.com/salami',
      'og:site_name': 'Mahim Salami',
      'og:image': 'https://mahims.com/assets/og-salami.jpg',
      'og:image:secure_url': 'https://mahims.com/assets/og-salami.jpg',
      'twitter:title': 'Mahim Salami | মাহিম সালামি — ঈদ সালামি ট্র্যাকার ও পোর্টাল',
      'twitter:description': 'ঈদ মোবারক! মাহিমকে ঈদ সালামি পাঠান অথবা আপনার প্রাপ্ত সালামি চেক করুন অনলাইন পোর্টালে।',
      'twitter:image': 'https://mahims.com/assets/og-salami.jpg',
      'twitter:card': 'summary_large_image',
    };

    Object.entries(ogTags).forEach(([prop, val]) => {
      let el = document.querySelector(`meta[property="${prop}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', prop);
        document.head.appendChild(el);
      }
      el.setAttribute('content', val);
    });

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://mahims.com/salami');
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen m-0 p-0 overflow-hidden bg-white z-50">
      <iframe
        src={scriptUrl}
        title="Eid Salami Tracker"
        className="w-full h-full border-0 block"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; payment"
      />
    </div>
  );
}
export default SalamiPage;
