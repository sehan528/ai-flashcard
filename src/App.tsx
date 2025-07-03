import { Routes, Route } from 'react-router-dom';

import MainApp from './MainApp';

import DevPlayground from './pages/DevPlayground';

function App() {
    return (
        <Routes>
            {/* 메인 앱 (기존 기능) */}
            <Route path="/" element={<MainApp />} />

            {/* 개발 테스트 환경 -> 완료 시 라우트 삭제 */}
            <Route path="/test" element={<DevPlayground />} />


        </Routes>
    );
}

export default App;