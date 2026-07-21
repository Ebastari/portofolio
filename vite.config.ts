import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import seoPrerender from './seo-prerender'
import contactInject from './contact-inject'

export default defineConfig({
  plugins: [
    react(),
    seoPrerender(),
    contactInject(),
    {
      name: 'serve-public-images',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url ?? ''
          const pathname = url.split('?')[0]
          if (/^\/(levels|hero|dokumentasi)\/[^/]+\.(png|jpg|jpeg|webp|avif|gif)$/i.test(pathname)) {
            const filepath = path.join(__dirname, 'public', pathname)
            if (fs.existsSync(filepath)) {
              const ext = path.extname(pathname).toLowerCase().slice(1)
              const mime: Record<string, string> = {
                png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
                webp: 'image/webp', avif: 'image/avif', gif: 'image/gif',
              }
              res.setHeader('Content-Type', mime[ext] ?? 'application/octet-stream')
              res.setHeader('Cache-Control', 'public, max-age=3600')
              fs.createReadStream(filepath).pipe(res as NodeJS.WritableStream)
              return
            }
          }
          next()
        })
      },
    },
  ],
  base: './',
  build: {
    assetsInlineLimit: 0,
  },
  server: {
    watch: {
      // Ignore locked/busy files on Windows (e.g. images open in another app)
      ignored: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.webp', '**/*.avif'],
    },
  },
})
