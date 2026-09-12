import React, { useEffect } from 'react';
import { useSite } from '../context/SiteContext';

export const DynamicSEO: React.FC = () => {
  const { settings, posts, skills, experiences, education, selectedPostForView } = useSite();

  useEffect(() => {
    const path = typeof window !== 'undefined' 
      ? (window.location.pathname + window.location.hash).toLowerCase()
      : '';
    const isChithi = path.includes('chithi');
    const isSalami = path.includes('salami');
    const isClassroom = path.includes('classroom');
    const isPortfolio = path.includes('portfolio');

    // 1. Dynamic Document Title
    if (isClassroom) {
      document.title = "Mahim's Classroom | মাহিম ক্লাসরুম — একাডেমি ও এডমিশন প্ল্যাটফর্ম (Mahims Classroom)";
    } else if (isChithi) {
      document.title = 'Mahim Chithi | মাহিম চিঠি — মনের না বলা কথা পাঠান গোপনে';
    } else if (isSalami) {
      document.title = 'Mahim Salami | মাহিম সালামি — ঈদ সালামি ট্র্যাকার ও পোর্টাল';
    } else if (isPortfolio) {
      document.title = 'Mahim Portfolio | মাহিম — প্রফেশনাল পোর্টফোলিও, কোডিং ও ক্যারিয়ার';
    } else if (selectedPostForView) {
      document.title = `${selectedPostForView.title} | ${settings.siteName || "Mahim's World"}`;
    } else {
      document.title = "Mahim's World | মাহিম’স ওয়ার্ল্ড — ডিজিটাল ইকোসিস্টেম ও ভাবনা ভুবন";
    }

    // Helper to safely set or create meta tag
    const setMetaTag = (selector: string, attribute: 'name' | 'property', attrValue: string, content: string) => {
      let meta = document.querySelector(selector) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, attrValue);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    let activeDescription = '';
    let activeImage = '';
    let activeUrl = '';

    if (isClassroom) {
      activeDescription = "Mahim's Classroom (মাহিম ক্লাসরুম) - এইচএসসি, বিশ্ববিদ্যালয় ভর্তি প্রস্তুতি ও এসএসসি শিক্ষার্থীদের জন্য অনলাইন ভিত্তিক কনসেপ্ট ক্লাস এবং স্মার্ট এক্সাম সিস্টেম। প্রতিষ্ঠাতা: মাহিম (ঢাকা সেন্ট্রাল ইউনিভার্সিটি)।";
      activeImage = `https://${settings.domain || 'mahims.com'}/assets/og-classroom.jpg`;
      activeUrl = `https://${settings.domain || 'mahims.com'}/classroom`;
    } else if (isChithi) {
      activeDescription = 'মাহিমকে বেনামে চিঠি পাঠান। কোনো পরিচয় ছাড়াই আপনার মনের না বলা কথা, সিক্রেট অনুভূতি বা বার্তা পাঠান ১০০% নিরাপদে।';
      activeImage = `https://${settings.domain || 'mahims.com'}/assets/og-chithi.jpg`;
      activeUrl = `https://${settings.domain || 'mahims.com'}/chithi`;
    } else if (isSalami) {
      activeDescription = 'ঈদ মোবারক! মাহিমকে ঈদ সালামি পাঠান অথবা আপনার প্রাপ্ত সালামি চেক করুন বিকাশ, নগদ বা রকেটের মাধ্যমে।';
      activeImage = `https://${settings.domain || 'mahims.com'}/assets/og-salami.jpg`;
      activeUrl = `https://${settings.domain || 'mahims.com'}/salami`;
    } else {
      activeDescription = selectedPostForView
        ? selectedPostForView.excerpt || selectedPostForView.title
        : "Mahim's World (মাহিম'স ওয়ার্ল্ড) - মাহিম ইবনে খুদি এর অফিসিয়াল ডিজিটাল ইকোসিস্টেম। শিক্ষা ও একাডেমি (Mahim's Classroom), প্রযুক্তি, মুক্ত দর্শন, ক্রিয়েটিভ প্রজেক্ট ও স্মৃতির এক উন্মুক্ত প্ল্যাটফর্ম।";

      activeImage = selectedPostForView?.coverImage
        ? selectedPostForView.coverImage
        : 'https://res.cloudinary.com/drvyjj7td/image/upload/v1788629825/MAHIMIBNEKHUDI_wafylv.png';

      activeUrl = selectedPostForView
        ? `https://${settings.domain || 'mahims.com'}/#blog/${selectedPostForView.slug}`
        : `https://${settings.domain || 'mahims.com'}/`;
    }

    // 2. Update Primary Meta Tags
    setMetaTag('meta[name="description"]', 'name', 'description', activeDescription);
    if (settings.seoKeywords && settings.seoKeywords.length > 0) {
      setMetaTag('meta[name="keywords"]', 'name', 'keywords', settings.seoKeywords.join(', '));
    }
    setMetaTag('meta[name="author"]', 'name', 'author', settings.heroTitle || 'Mahim Ibne Khudi');

    // 3. Update Open Graph Meta Tags
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', document.title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', activeDescription);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', activeImage);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', activeUrl);

    // 4. Update Twitter Card Meta Tags
    setMetaTag('meta[property="twitter:title"]', 'property', 'twitter:title', document.title);
    setMetaTag('meta[property="twitter:description"]', 'property', 'twitter:description', activeDescription);
    setMetaTag('meta[property="twitter:image"]', 'property', 'twitter:image', activeImage);

    // 5. Update Dynamic Schema.org JSON-LD in DOM
    const siteDomain = settings.domain || 'mahims.com';
    const siteUrl = `https://${siteDomain}`;
    const publicPosts = posts.filter(p => p.visibility === 'public');

    const dynamicGraph: any[] = [
      {
        '@type': 'Person',
        '@id': `${siteUrl}/#person`,
        name: settings.heroTitle || 'Mahim Ibne Khudi',
        givenName: 'Mahim',
        familyName: 'Ibne Khudi',
        alternateName: [
          "Mahim's World",
          'Mahims World',
          'Mahim World',
          'মাহিমস ওয়ার্ল্ড',
          'মাহিম ওয়ার্ল্ড',
          'মাহিম গাইবান্ধা',
          'Mahim Gaibandha',
          'Mahim',
          'মাহিম',
          'Mahims',
          'মাহিমস',
          "মাহিম'স",
          'মাহিম ইবনে খুদি',
          'Mahim Ibn Khudi',
          'Ibn Khudi',
          'Ibne Khudi',
          'Asrare Khudi',
        ],
        description: settings.heroBio || "Mahim's World (মাহিম'স ওয়ার্ল্ড) - Founder of Mahim's Classroom, educator, and digital creator.",
        disambiguatingDescription: `${settings.heroTitle} is the creator of Mahim's World and founder of Mahim's Classroom at ${siteDomain}.`,
        url: siteUrl,
        image: settings.heroImage ? [settings.heroImage, settings.whatsappAvatarUrl || ''] : undefined,
        jobTitle: settings.heroSubtitle || "Educator, Tech Enthusiast & Creator — Founder of Mahim's Classroom",
        email: settings.email ? `mailto:${settings.email}` : undefined,
        sameAs: [
          settings.linkedinUrl,
          settings.behanceUrl,
          settings.facebookUrl,
          settings.instagramUrl,
          settings.fiverrUrl,
          settings.whatsappLink,
        ].filter(Boolean),
        knowsAbout: skills && skills.length > 0 ? skills.map(s => s.name) : ['Graphic Design', 'Branding'],
        alumniOf: education && education.length > 0
          ? education.map(e => ({
              '@type': 'EducationalOrganization',
              name: e.institution,
              department: e.department,
            }))
          : undefined,
        worksFor: experiences && experiences.length > 0
          ? experiences.map(e => ({
              '@type': 'Organization',
              name: e.company,
            }))
          : undefined,
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: settings.siteName || 'Mahim',
        description: settings.seoDescription || settings.heroBio,
        publisher: { '@id': `${siteUrl}/#person` },
      },
      {
        '@type': 'ProfilePage',
        '@id': `${siteUrl}/#webpage`,
        url: siteUrl,
        name: document.title,
        isPartOf: { '@id': `${siteUrl}/#website` },
        mainEntity: { '@id': `${siteUrl}/#person` },
      },
    ];

    // Add BlogPosting schema for each published blog post
    publicPosts.forEach(post => {
      dynamicGraph.push({
        '@type': 'BlogPosting',
        '@id': `${siteUrl}/#blog/${post.slug}`,
        mainEntityOfPage: `${siteUrl}/#blog/${post.slug}`,
        headline: post.title,
        description: post.excerpt,
        image: post.coverImage || settings.heroImage,
        datePublished: post.date || new Date().toISOString().split('T')[0],
        dateModified: post.date || new Date().toISOString().split('T')[0],
        author: {
          '@type': 'Person',
          name: post.author || settings.heroTitle || 'Mahim Ibne Khudi',
          url: siteUrl,
        },
        publisher: {
          '@type': 'Person',
          name: settings.heroTitle || 'Mahim Ibne Khudi',
        },
        articleSection: post.category,
      });
    });

    // If a specific blog post is being viewed, add a dedicated Article schema at top
    if (selectedPostForView) {
      dynamicGraph.unshift({
        '@type': 'BlogPosting',
        '@id': `${siteUrl}/#blog/${selectedPostForView.slug}-active`,
        headline: selectedPostForView.title,
        description: selectedPostForView.excerpt,
        image: selectedPostForView.coverImage || settings.heroImage,
        datePublished: selectedPostForView.date,
        articleBody: selectedPostForView.content,
        author: {
          '@type': 'Person',
          name: selectedPostForView.author || settings.heroTitle,
        },
      });
    }

    // Inject or update in document <head>
    let scriptTag = document.getElementById('dynamic-seo-schema') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'dynamic-seo-schema';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': dynamicGraph,
    });
  }, [settings, posts, skills, experiences, education, selectedPostForView]);

  return null; // Headless component
};
