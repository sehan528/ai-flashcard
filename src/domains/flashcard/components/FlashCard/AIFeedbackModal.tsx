// src/domains/flashcard/components/FlashCard/AIFeedbackModal.tsx
import { useEffect } from 'react';

interface AIFeedbackResult {
    score: number;
    feedback: string;
    improvements?: string[];
    source: 'ai' | 'fallback';
    remaining: number;
    error?: string;
}

interface AIFeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    result: AIFeedbackResult | null;
    userAnswer: string;
    isLoading?: boolean;
    errorMessage?: string | null;
}

const AIFeedbackModal = ({
                             isOpen,
                             onClose,
                             result,
                             userAnswer,
                             isLoading = false,
                             errorMessage = null
                         }: AIFeedbackModalProps) => {

    // ESC 키로 모달 닫기
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden'; // 스크롤 방지
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // 점수에 따른 색상 및 이모지 결정
    const getScoreInfo = (score: number) => {
        if (score >= 90) {
            return {
                color: 'text-green-700 bg-green-100 border-green-300',
                emoji: '🎉',
                label: '우수',
                bgColor: 'bg-green-50'
            };
        } else if (score >= 70) {
            return {
                color: 'text-blue-700 bg-blue-100 border-blue-300',
                emoji: '👍',
                label: '양호',
                bgColor: 'bg-blue-50'
            };
        } else if (score >= 50) {
            return {
                color: 'text-yellow-700 bg-yellow-100 border-yellow-300',
                emoji: '💡',
                label: '보통',
                bgColor: 'bg-yellow-50'
            };
        } else {
            return {
                color: 'text-orange-700 bg-orange-100 border-orange-300',
                emoji: '📚',
                label: '개선 필요',
                bgColor: 'bg-orange-50'
            };
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* 헤더 */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🤖</span>
                        <h3 className="text-xl font-semibold text-gray-800">
                            AI 평가 결과
                        </h3>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="모달 닫기"
                    >
                        <span className="text-xl text-gray-500">×</span>
                    </button>
                </div>

                <div className="p-6">
                    {/* 로딩 상태 */}
                    {isLoading && (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600 text-lg">AI가 답변을 평가하고 있습니다...</p>
                            <p className="text-gray-500 text-sm mt-2">잠시만 기다려주세요</p>
                        </div>
                    )}

                    {/* 에러 상태 */}
                    {errorMessage && !isLoading && (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-4">😅</div>
                            <h4 className="text-lg font-medium text-red-600 mb-2">
                                평가 중 오류가 발생했습니다
                            </h4>
                            <p className="text-gray-600 mb-4">{errorMessage}</p>
                            <button
                                onClick={onClose}
                                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                확인
                            </button>
                        </div>
                    )}

                    {/* 성공 상태 */}
                    {result && !isLoading && !errorMessage && (
                        <div className="space-y-6">
                            {/* 내 답변 표시 */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">📝 내 답변:</h4>
                                <p className="text-gray-800 leading-relaxed">
                                    {userAnswer}
                                </p>
                            </div>

                            {/* 점수 표시 */}
                            {(() => {
                                const scoreInfo = getScoreInfo(result.score);
                                return (
                                    <div className={`rounded-lg border-2 p-6 ${scoreInfo.bgColor} ${scoreInfo.color}`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-3xl">{scoreInfo.emoji}</span>
                                                <div>
                                                    <div className="text-2xl font-bold">
                                                        {result.score}점
                                                    </div>
                                                    <div className="text-sm opacity-75">
                                                        {scoreInfo.label}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 점수 바 */}
                                            <div className="w-24 h-3 bg-white rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-current transition-all duration-1000 ease-out"
                                                    style={{ width: `${result.score}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* AI 피드백 */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="flex items-center gap-2 text-sm font-medium text-blue-800 mb-3">
                                    <span>💬</span>
                                    AI 피드백
                                </h4>
                                <p className="text-blue-900 leading-relaxed">
                                    {result.feedback}
                                </p>
                            </div>

                            {/* 개선점 (있는 경우) */}
                            {result.improvements && result.improvements.length > 0 && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <h4 className="flex items-center gap-2 text-sm font-medium text-yellow-800 mb-3">
                                        <span>💡</span>
                                        추가 학습 제안
                                    </h4>
                                    <ul className="space-y-2">
                                        {result.improvements.map((improvement, index) => (
                                            <li key={index} className="flex items-start gap-2 text-yellow-900">
                                                <span className="text-yellow-600 mt-1">•</span>
                                                <span>{improvement}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* 사용량 정보 */}
                            <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
                                <div className="flex items-center gap-2">
                                    <span>🔥</span>
                                    <span>
                    AI 사용량: {50 - result.remaining}/50회 사용
                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    {result.source === 'fallback' && (
                                        <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">
                      기본 평가
                    </span>
                                    )}
                                    <span className="text-xs">
                    매일 자정 리셋
                  </span>
                                </div>
                            </div>

                            {/* 액션 버튼 */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={onClose}
                                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    확인
                                </button>

                                {result.score < 70 && (
                                    <button
                                        onClick={() => {
                                            // TODO: 정답 보기 기능 연결
                                            console.log('정답 보기 클릭');
                                            onClose();
                                        }}
                                        className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        정답 보기
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIFeedbackModal;