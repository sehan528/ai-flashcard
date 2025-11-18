import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlashcardStorage } from '../domains/flashcard/utils/storage';
import type { CardSet } from '../domains/flashcard/dtos/FlashCard';

const Settings = () => {
    const navigate = useNavigate();
    const [statistics, setStatistics] = useState({
        totalCardSets: 0,
        totalCards: 0,
        totalStudyCount: 0
    });
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [selectedCardSets, setSelectedCardSets] = useState<Set<string>>(new Set());
    const [cardSets, setCardSets] = useState<CardSet[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 통계 정보 로드
    useEffect(() => {
        loadStatistics();
    }, []);

    // 모달 열릴 때 배경 스크롤 방지
    useEffect(() => {
        if (showExportModal || showDeleteConfirm) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // 컴포넌트 언마운트 시 복구
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showExportModal, showDeleteConfirm]);

    const loadStatistics = () => {
        const stats = FlashcardStorage.getStatistics();
        const allCardSets = FlashcardStorage.getCardSets();
        setStatistics(stats);
        setCardSets(allCardSets);
    };

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 3000);
    };

    // Export 모달 열기
    const handleOpenExportModal = () => {
        setShowExportModal(true);
        setSelectedCardSets(new Set());
    };

    // Export 모달 닫기
    const handleCloseExportModal = () => {
        setShowExportModal(false);
        setSelectedCardSets(new Set());
    };

    // 카드셋 선택/해제
    const toggleCardSetSelection = (id: string) => {
        const newSelection = new Set(selectedCardSets);
        if (newSelection.has(id)) {
            newSelection.delete(id);
        } else {
            newSelection.add(id);
        }
        setSelectedCardSets(newSelection);
    };

    // 전체 선택/해제
    const toggleSelectAll = () => {
        if (selectedCardSets.size === cardSets.length) {
            setSelectedCardSets(new Set());
        } else {
            setSelectedCardSets(new Set(cardSets.map(set => set.id)));
        }
    };

    // Export 실행
    const handleExportSelected = () => {
        if (selectedCardSets.size === 0) {
            showMessage('error', '내보낼 카드셋을 선택해주세요.');
            return;
        }

        try {
            FlashcardStorage.downloadSelectedCardSets(Array.from(selectedCardSets));
            showMessage('success', `${selectedCardSets.size}개의 카드셋을 내보냈습니다!`);
            handleCloseExportModal();
        } catch (error) {
            showMessage('error', '데이터 내보내기에 실패했습니다.');
        }
    };

    // Import 기능 (다중 파일 지원)
    const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        try {
            const result = await FlashcardStorage.importMultipleFiles(files);

            if (result.success) {
                showMessage('success', `${result.totalImported}개의 카드셋을 가져왔습니다!`);
                loadStatistics();
            } else {
                // 에러가 있는 경우 더 자세한 메시지
                if (result.errors.length > 0) {
                    // 에러가 3개 이하면 모두 표시, 그 이상이면 처음 3개만
                    const displayErrors = result.errors.slice(0, 3);
                    const remainingErrors = result.errors.length - 3;

                    let errorMessage = `파일 가져오기 실패:\n${displayErrors.join('\n')}`;
                    if (remainingErrors > 0) {
                        errorMessage += `\n... 외 ${remainingErrors}개 파일`;
                    }

                    showMessage('error', errorMessage);
                } else {
                    showMessage('error', '데이터 가져오기에 실패했습니다.');
                }

                // 일부 성공한 경우
                if (result.totalImported > 0) {
                    showMessage('success', `${result.totalImported}개의 카드셋은 성공적으로 가져왔습니다.`);
                    loadStatistics();
                }
            }
        } catch (error) {
            showMessage('error', '파일 읽기에 실패했습니다.');
        }

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

    // 데이터셋 불러오기
    const handleCreateTestData = async () => {
        try {
            const result = await FlashcardStorage.createInterviewTestData();
            loadStatistics();

            if (result.success) {
                if (result.importedCount === 0) {
                    showMessage('success', '데이터셋이 이미 불러와져 있습니다.');
                    // 이미 있어도 메인으로 이동 (사용자가 확인할 수 있도록)
                    setTimeout(() => navigate('/'), 1500);
                } else {
                    const categoriesText = result.categories.length > 0
                        ? ` (${result.categories.join(', ').toUpperCase()})`
                        : '';
                    showMessage('success', `${result.importedCount}개 카드셋 (${result.totalCards}개 카드)을 불러왔습니다!${categoriesText}`);
                    // 성공 메시지를 보여주고 1.5초 후 메인 화면으로 이동
                    setTimeout(() => navigate('/'), 1500);
                }
            } else {
                showMessage('error', '데이터셋 불러오기에 실패했습니다.');
            }
        } catch (error) {
            showMessage('error', '데이터셋 불러오기에 실패했습니다.');
            console.error('Dataset loading failed:', error);
        }
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
                <div className={`mb-4 p-4 rounded-lg whitespace-pre-line ${
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
                        onClick={handleOpenExportModal}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        데이터 내보내기 (Export)
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                        선택한 카드셋을 각각 JSON 파일로 저장합니다.
                    </p>
                </div>

                {/* Import 버튼 */}
                <div className="mb-4">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        multiple
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
                        JSON 파일(들)에서 카드셋을 가져옵니다. 여러 파일 선택 가능합니다.
                    </p>
                </div>

                {/* 데이터셋 불러오기 버튼 */}
                <div className="mb-4">
                    <button
                        onClick={handleCreateTestData}
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        예제 데이터 생성하기
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                        예제 카드셋 데이터들을 생성합니다.
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

            {/* Export 모달 */}
            {showExportModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">
                                내보낼 카드셋 선택
                            </h3>
                            <button
                                onClick={toggleSelectAll}
                                className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-lg transition-colors"
                            >
                                {selectedCardSets.size === cardSets.length ? 'Deselect All' : 'Select All'}
                            </button>
                        </div>

                        {cardSets.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">
                                내보낼 카드셋이 없습니다.
                            </p>
                        ) : (
                            <div className="space-y-2 mb-6">
                                {cardSets.map(cardSet => (
                                    <div
                                        key={cardSet.id}
                                        onClick={() => toggleCardSetSelection(cardSet.id)}
                                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                            selectedCardSets.has(cardSet.id)
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 bg-white hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 mt-1">
                                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                                    selectedCardSets.has(cardSet.id)
                                                        ? 'bg-blue-500 border-blue-500'
                                                        : 'border-gray-300'
                                                }`}>
                                                    {selectedCardSets.has(cardSet.id) && (
                                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-800">{cardSet.name}</h4>
                                                {cardSet.description && (
                                                    <p className="text-sm text-gray-600 mt-1">{cardSet.description}</p>
                                                )}
                                                <p className="text-xs text-gray-500 mt-2">
                                                    {cardSet.cards.length}개의 카드
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={handleCloseExportModal}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleExportSelected}
                                disabled={selectedCardSets.size === 0}
                                className={`flex-1 font-medium py-2 px-4 rounded-lg transition-colors ${
                                    selectedCardSets.size === 0
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                                }`}
                            >
                                내보내기 ({selectedCardSets.size})
                            </button>
                        </div>
                    </div>
                </div>
            )}

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