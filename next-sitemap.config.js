/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://fastutils.com',
  generateRobotsTxt: false, // We already have a custom robots.txt
  generateIndexSitemap: false,
  outDir: 'public',
  exclude: ['/api/*'],
  alternateRefs: [],
  transform: async (config, path) => {
    // Custom transform function to set priorities
    const priority = path === '/' ? 1.0 : 0.8;
    const changefreq = path === '/' ? 'daily' : 'weekly';
    
    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },
}
