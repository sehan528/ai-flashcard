import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Electron 및 상대 경로 지원
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
