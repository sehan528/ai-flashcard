const Error404 = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-600 mb-4">404</h1>
                <p className="text-gray-500 mb-4">페이지를 찾을 수 없습니다.</p>
                <a href="/" className="text-blue-600 hover:underline">
                    홈으로 돌아가기
                </a>
            </div>
        </div>
    );
};

export default Error404;