import { useState, useEffect, useRef } from 'react';
import { FlashcardStorage } from '../domains/flashcard/utils/storage';

const Settings = () => {
    const [statistics, setStatistics] = useState({
        totalCardSets: 0,
        totalCards: 0,
        totalStudyCount: 0
    });
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 통계 정보 로드
    useEffect(() => {
        loadStatistics();
    }, []);

    const loadStatistics = () => {
        const stats = FlashcardStorage.getStatistics();
        setStatistics(stats);
    };

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 3000);
    };

    // Export 기능
    const handleExport = () => {
        try {
            FlashcardStorage.downloadAsJSON();
            showMessage('success', '데이터를 성공적으로 내보냈습니다!');
        } catch (error) {
            showMessage('error', '데이터 내보내기에 실패했습니다.');
        }
    };

    // Import 기능
    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            const result = FlashcardStorage.importFromJSON(content, 'merge');

            if (result.success) {
                showMessage('success', `${result.importedCount}개의 카드셋을 가져왔습니다!`);
                loadStatistics();
            } else {
                showMessage('error', result.error || '데이터 가져오기에 실패했습니다.');
            }
        };
        reader.onerror = () => {
            showMessage('error', '파일 읽기에 실패했습니다.');
        };
        reader.readAsText(file);

        // 파일 입력 초기화
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // 전체 데이터 삭제
    const handleClearData = () => {
        FlashcardStorage.clearAllData();
        loadStatistics();
        setShowDeleteConfirm(false);
        showMessage('success', '모든 데이터가 삭제되었습니다.');
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    설정
                </h2>
                <p className="text-gray-600">
                    앱 설정과 데이터 관리
                </p>
            </div>

            {/* 메시지 알림 */}
            {message && (
                <div className={`mb-4 p-4 rounded-lg ${
                    message.type === 'success'
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                    {message.text}
                </div>
            )}

            {/* 데이터 통계 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    데이터 통계
                </h3>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                            {statistics.totalCardSets}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">카드셋</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                            {statistics.totalCards}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">카드</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                            {statistics.totalStudyCount}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">학습 횟수</div>
                    </div>
                </div>
            </div>

            {/* 데이터 관리 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    데이터 관리
                </h3>

                {/* Export 버튼 */}
                <div className="mb-4">
                    <button
                        onClick={handleExport}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        데이터 내보내기 (Export)
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                        모든 카드셋을 JSON 파일로 저장합니다.
                    </p>
                </div>

                {/* Import 버튼 */}
                <div className="mb-4">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        className="hidden"
                        id="import-file"
                    />
                    <label
                        htmlFor="import-file"
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        데이터 가져오기 (Import)
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                        JSON 파일에서 카드셋을 가져옵니다. 기존 데이터와 병합됩니다.
                    </p>
                </div>

                {/* 구분선 */}
                <div className="border-t border-gray-200 my-6"></div>

                {/* 전체 삭제 버튼 */}
                <div>
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        모든 데이터 삭제
                    </button>
                    <p className="text-xs text-red-500 mt-2">
                        ⚠️ 주의: 모든 카드셋이 영구적으로 삭제됩니다.
                    </p>
                </div>
            </div>

            {/* 삭제 확인 모달 */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md mx-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            정말 삭제하시겠습니까?
                        </h3>
                        <p className="text-gray-600 mb-6">
                            모든 카드셋과 학습 기록이 영구적으로 삭제됩니다.
                            이 작업은 되돌릴 수 없습니다.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleClearData}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                            >
                                삭제
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 앱 정보 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    앱 정보
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>버전:</strong> 1.0.0</p>
                    <p><strong>개발:</strong> React + TypeScript + Vite</p>
                    <p><strong>데이터 저장:</strong> LocalStorage</p>
                    <p><strong>AI 평가:</strong> Hugging Face DialoGPT-medium</p>
                </div>
            </div>
        </div>
    );
};

export default Settings;