import { contextBridge } from 'electron';

// Renderer 프로세스에서 사용할 API를 안전하게 노출
// 현재는 LocalStorage를 사용하므로 특별한 API가 필요 없지만,
// 향후 파일 시스템 접근 등이 필요하면 여기에 추가

contextBridge.exposeInMainWorld('electronAPI', {
    // 예: 향후 파일 시스템 접근이 필요한 경우
    // readFile: (path: string) => ipcRenderer.invoke('read-file', path),
    // writeFile: (path: string, data: string) => ipcRenderer.invoke('write-file', path, data),

    // 현재는 플레이스홀더
    platform: process.platform,
});

// TypeScript 타입 정의 (src/types/electron.d.ts에 추가 필요)
declare global {
    interface Window {
        electronAPI: {
            platform: string;
        };
    }
}
