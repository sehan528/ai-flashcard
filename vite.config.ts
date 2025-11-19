import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Electron 플러그인은 로컬 환경에서만 사용
// (패키지가 설치되지 않은 환경에서도 웹 빌드 가능)
let electronPlugin: any = null;
try {
  const electronImport = await import('vite-plugin-electron/simple');
  electronPlugin = electronImport.default;
} catch {
  console.log('📦 vite-plugin-electron not installed. Building for web only.');
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Electron 플러그인이 있을 때만 추가
    ...(electronPlugin ? [
      electronPlugin({
        main: {
          entry: 'electron/main.ts',
        },
        preload: {
          input: 'electron/preload.ts',
        },
      })
    ] : []),
  ],
  base: './', // Electron 및 상대 경로 지원
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
