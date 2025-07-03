import { Routes, Route } from 'react-router-dom';

import MainApp from './MainApp';
import Error404 from './pages/Error404';

function App() {
    return (
        <Routes>
            {/* 메인 앱 (기존 기능) */}
            <Route path="/" element={<MainApp />} />

            {/* 404 페이지 */}
            <Route path="*" element={<Error404 />} />
        </Routes>
    );
}

export default App;