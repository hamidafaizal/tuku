import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Opsi untuk auto-update service worker saat ada versi baru
      registerType: 'autoUpdate',
      // Opsi untuk mengaktifkan PWA di mode development
      devOptions: {
        enabled: true
      },
      // Konfigurasi manifest PWA
      manifest: {
        name: 'Tuku POS',
        short_name: 'Tuku',
        description: 'Aplikasi Point of Sale Tuku',
        theme_color: '#0ea5e9', // Warna tema utama (sky-500)
        background_color: '#f6fbff', // Warna background aplikasi
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'logotuku192.png', // Logo yang sudah Anda siapkan
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'logotuku512.png', // Logo yang sudah Anda siapkan
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'logotuku512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable', // Untuk memastikan ikon terlihat baik di semua perangkat
          },
        ],
      },
    }),
  ],
});
