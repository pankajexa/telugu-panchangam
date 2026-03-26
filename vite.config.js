import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true },
      manifest: {
        name: 'మనCalendar — తెలుగు పంచాంగం',
        short_name: 'మనCalendar',
        description: 'శ్రీ పరాభవ నామ సంవత్సరం తెలుగు పంచాంగం 2026-27',
        start_url: '/',
        display: 'standalone',
        background_color: '#F5F2ED',
        theme_color: '#C49B2A',
        icons: [
          { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  build: {
    // Ensure assets use relative paths for Capacitor file:// protocol
    assetsDir: 'assets',
  },
})
