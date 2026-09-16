import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    base: '/',
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'classroom-blog-sync-api',
        configureServer(server) {
          server.middlewares.use('/api/save-blogs', (req, res) => {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', (chunk) => {
                body += chunk;
              });
              req.on('end', () => {
                try {
                  const parsed = JSON.parse(body);
                  if (typeof parsed.fileContent === 'string') {
                    const targetPath = path.resolve(__dirname, 'src/data/classroomBlogs.ts');
                    fs.writeFileSync(targetPath, parsed.fileContent, 'utf-8');
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ success: true }));
                    return;
                  }
                } catch (err) {
                  console.error('Error saving blogs to disk:', err);
                }
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Failed to write file' }));
              });
            } else {
              res.statusCode = 405;
              res.end();
            }
          });

          // Sync main site blogs directly to src/data/userBlogPosts.ts so Git push includes them
          server.middlewares.use('/api/save-main-blogs', (req, res) => {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', (chunk) => {
                body += chunk;
              });
              req.on('end', () => {
                try {
                  const parsed = JSON.parse(body);
                  if (Array.isArray(parsed.posts)) {
                    const code = `import { BlogPost } from '../types';\n\n/**\n * All articles written by Mahim from the Admin Panel will be saved here automatically.\n */\nexport const USER_BLOG_POSTS: BlogPost[] = ${JSON.stringify(parsed.posts, null, 2)};\n`;
                    const targetPath = path.resolve(__dirname, 'src/data/userBlogPosts.ts');
                    fs.writeFileSync(targetPath, code, 'utf-8');
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ success: true }));
                    return;
                  }
                } catch (err) {
                  console.error('Error saving main blogs to disk:', err);
                }
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Failed to write file' }));
              });
            } else {
              res.statusCode = 405;
              res.end();
            }
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          entryFileNames: 'assets/app.js',
          chunkFileNames: 'assets/[name].js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              return 'assets/app.css';
            }
            return 'assets/[name][extname]';
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
