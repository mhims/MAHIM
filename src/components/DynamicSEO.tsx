import React, { useEffect } from 'react';
import { useSite } from '../context/SiteContext';

export const DynamicSEO: React.FC = () => {
  const { settings, posts, skills, experiences, education, selectedPostForView } = useSite();

  useEffect(() => {
    // 1. Dynamic Document Title
    if (selectedPostForView) {
      document.title = `${selectedPostForView.title} | ${settings.siteName || 'Mahim'}`;
    } else if (settings.seoTitle) {
      document.title = settings.seoTitle;
    } else {
      document.title = `${settings.heroTitle || 'Mahim'} | ${settings.heroSubtitle || 'Graphic Designer'}`;
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

    const activeDescription = selectedPostForView
      ? selectedPostForView.excerpt || selectedPostForView.title
      : settings.seoDescription || settings.heroBio || '';

    const activeImage = selectedPostForView?.coverImage
      ? selectedPostForView.coverImage
      : settings.heroImage || 'https://mahims.com/assets/og-preview.jpg';

    const activeUrl = selectedPostForView
      ? `https://${settings.domain || 'mahims.com'}/#blog/${selectedPostForView.slug}`
      : `https://${settings.domain || 'mahims.com'}/`;

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
        description: settings.heroBio || 'Professional Graphic Designer & Brand Specialist',
        disambiguatingDescription: `${settings.heroTitle} is a Bangladeshi graphic designer and creative visual specialist at ${siteDomain}.`,
        url: siteUrl,
        image: settings.heroImage ? [settings.heroImage, settings.whatsappAvatarUrl || ''] : undefined,
        jobTitle: settings.heroSubtitle || 'Graphic Designer & Creative Professional',
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
