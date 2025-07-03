import { Routes, Route } from 'react-router-dom';

import MainApp from './MainApp';
import DevPlayground from './pages/DevPlayground';
import Error404 from './pages/Error404';

function App() {
    return (
        <Routes>
            {/* 메인 앱 (기존 기능) */}
            <Route path="/" element={<MainApp />} />

            {/* 개발 테스트 환경 -> 완료 시 라우트 삭제 */}
            <Route path="/test" element={<DevPlayground />} />

            {/* 404 페이지 */}
            <Route path="*" element={<Error404 />} />
        </Routes>
    );
}

export default App;