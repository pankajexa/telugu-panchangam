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
        background_color: '#1a120e',
        theme_color: '#d6a820',
        icons: [
          { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
