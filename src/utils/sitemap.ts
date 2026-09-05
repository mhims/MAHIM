import { BlogPost, SiteSettings } from '../types';

export function generateSitemapXml(settings: SiteSettings, posts: BlogPost[]): string {
  const baseUrl = `https://${settings.domain || 'mahims.com'}`;
  const now = new Date().toISOString().split('T')[0];

  const staticUrls = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${baseUrl}/#about`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/#skills`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${baseUrl}/#experience`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${baseUrl}/#education`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${baseUrl}/#blog`, priority: '0.9', changefreq: 'daily' },
    { loc: `${baseUrl}/#contact`, priority: '0.8', changefreq: 'weekly' },
  ];

  const postUrls = posts
    .filter(p => p.visibility === 'public')
    .map(p => ({
      loc: `${baseUrl}/#blog/${p.slug}`,
      priority: '0.7',
      changefreq: 'weekly',
      lastmod: p.date || now,
    }));

  const allUrls = [...staticUrls, ...postUrls];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${(url as any).lastmod || now}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;
}

export function generateRobotsTxt(domain = 'mahims.com'): string {
  return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /*?admin=*

# AI Crawlers explicitly welcomed for discovery
User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: https://${domain}/sitemap.xml
`;
}
