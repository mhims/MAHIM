import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const routes = ['about', 'skills', 'experience', 'education', 'blog', 'contact', 'wallet'];

if (fs.existsSync(distDir)) {
  const rootIndexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

  routes.forEach((route) => {
    const routeDir = path.join(distDir, route);
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }
    fs.writeFileSync(path.join(routeDir, 'index.html'), rootIndexHtml, 'utf8');
  });

  console.log('✅ Clean route directories created in dist: ' + routes.join(', '));
}
