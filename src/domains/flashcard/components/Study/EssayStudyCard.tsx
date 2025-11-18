import React, { useState } from 'react';
import type { FlashCard } from '../../dtos/FlashCard';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

import { useAIEvaluation } from '../../hooks/useAIEvaluation';
import AIFeedbackModal from '../FlashCard/AIFeedbackModal';

interface EssayStudyCardProps {
    card: FlashCard;
    onAnswerViewed?: () => void;
}

const EssayStudyCard = ({ card, onAnswerViewed }: EssayStudyCardProps) => {
    const [userAnswer, setUserAnswer] = useState('');
    const [showAnswer, setShowAnswer] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);

    // AI 평가 Hook 사용
    const {
        isLoading: isAILoading,
        // isError: isAIError,
        result: aiResult,
        errorMessage: aiErrorMessage,
        evaluateAnswer,
        reset: resetAI,
        remainingUsage,
    } = useAIEvaluation();

    const handleAIEvaluate = async () => {
        if (!userAnswer.trim()) {
            alert('답변을 입력해주세요.');
            return;
        }

        if (userAnswer.trim().length < 5) {
            alert('답변을 5자 이상 입력해주세요.');
            return;
        }

        // 사용량 체크
        if (remainingUsage <= 0) {
            alert('일일 AI 사용 한도(50회)에 도달했습니다. 내일 다시 시도해주세요.');
            return;
        }

        setShowFeedbackModal(true);

        const correctAnswer = typeof card.answer === 'string' ? card.answer : '정답 정보 없음';

        try {
            await evaluateAnswer(card.question, userAnswer.trim(), correctAnswer);
        } catch (error) {
            console.error('AI 평가 실패:', error);
        }
    };

    const handleShowAnswer = () => {
        const newShowAnswer = !showAnswer;
        setShowAnswer(newShowAnswer);

        // 정답을 처음 볼 때 부모에게 알림
        if (newShowAnswer && onAnswerViewed) {
            onAnswerViewed();
        }
    };

    const handleReset = () => {
        setUserAnswer('');
        setShowAnswer(false);
        resetAI();
    };

    const handleModalClose = () => {
        setShowFeedbackModal(false);
        resetAI();
    };

    // 사용량에 따른 버튼 상태
    const getAIButtonState = () => {
        if (remainingUsage <= 0) {
            return {
                disabled: true,
                text: '일일 사용량 초과',
                className: 'bg-gray-300 text-gray-500 cursor-not-allowed'
            };
        }

        if (isAILoading) {
            return {
                disabled: true,
                text: 'AI 평가 중...',
                className: 'bg-blue-400 text-white cursor-wait'
            };
        }

        if (!userAnswer.trim() || userAnswer.trim().length < 5) {
            return {
                disabled: true,
                text: '🤖 AI에게 평가받기',
                className: 'bg-gray-300 text-gray-500 cursor-not-allowed'
            };
        }

        return {
            disabled: false,
            text: `🤖 AI에게 평가받기 (${remainingUsage}회 남음)`,
            className: 'bg-blue-600 text-white hover:bg-blue-700'
        };
    };

    const aiButtonState = getAIButtonState();

    // 카드 변경 시 상태 초기화
    React.useEffect(() => {
        setUserAnswer('');
        setShowAnswer(false);
        resetAI();
    }, [card.id]);

    // 키보드 단축키 (Enter로 정답 보기)
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // textarea에 포커스 있으면 무시 (Enter는 개행으로 동작)
            const target = e.target as HTMLElement;
            if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
                return;
            }

            if (e.key === 'Enter') {
                e.preventDefault();
                handleShowAnswer();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [showAnswer]);

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 min-h-[400px] flex flex-col">
                {/* 질문 영역 */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">
                            📝 서술형
                        </span>
                        {card.tags.length > 0 && (
                            <div className="flex gap-1">
                                {card.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <h2 className="text-xl font-semibold text-gray-800 leading-relaxed">
                        {card.question}
                    </h2>
                </div>

                {/* 답변 입력 영역 */}
                <div className="flex-1 mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        답변을 작성해주세요
                    </label>
                    <textarea
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="여기에 답변을 작성하세요..."
                        className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        disabled={isAILoading}
                    />

                    {/* 답변 길이 힌트 */}
                    <div className="flex justify-between items-center mt-1">
                        <div className="text-xs text-gray-500">
                            {userAnswer.length < 5 && userAnswer.length > 0 && (
                                <span className="text-orange-600">
                                    최소 5자 이상 입력해주세요
                                </span>
                            )}
                        </div>
                        <div className="text-xs text-gray-400">
                            {userAnswer.length}자
                        </div>
                    </div>
                </div>

                {/* 정답 표시 영역 */}
                {showAnswer && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-gray-700">✅ 정답:</span>
                        </div>
                        <div className="text-gray-800 leading-relaxed prose prose-sm max-w-none">
                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                {typeof card.answer === 'string' ? card.answer : '정답 데이터 오류'}
                            </ReactMarkdown>
                        </div>
                    </div>
                )}

                {/* 버튼 영역 */}
                <div className="flex flex-wrap gap-3">
                    {/* AI 평가 버튼 */}
                    <button
                        onClick={handleAIEvaluate}
                        disabled={aiButtonState.disabled}
                        className={`flex-1 min-w-[140px] py-2 px-4 rounded-md font-medium transition-colors ${aiButtonState.className}`}
                    >
                        {isAILoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                {aiButtonState.text}
                            </span>
                        ) : (
                            aiButtonState.text
                        )}
                    </button>

                    {/* 정답 보기 버튼 */}
                    <button
                        onClick={handleShowAnswer}
                        className="flex-1 min-w-[120px] py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        {showAnswer ? '정답 숨기기' : '정답 보기'}
                    </button>

                    {/* 초기화 버튼 */}
                    <button
                        onClick={handleReset}
                        className="py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        🔄 초기화
                    </button>
                </div>

                {/* 도움말 및 사용량 정보 */}
                <div className="mt-4 space-y-2">
                    <div className="text-xs text-gray-500 text-center">
                        💡 답변을 작성한 후 AI 평가를 받아보세요. 정답과 비교하여 학습 효과를 높일 수 있습니다.
                    </div>
                    <div className="text-xs text-gray-400 text-center border-t border-gray-100 pt-2">
                        ⌨️ 단축키: <strong>Enter</strong> 정답 보기 | <strong>← →</strong> 이전/다음 카드
                    </div>

                    {remainingUsage <= 10 && remainingUsage > 0 && (
                        <div className="text-xs text-orange-600 text-center">
                            ⚠️ AI 사용량이 {remainingUsage}회 남았습니다. (매일 자정 리셋)
                        </div>
                    )}

                    {remainingUsage === 0 && (
                        <div className="text-xs text-red-600 text-center">
                            🚫 오늘의 AI 사용량을 모두 사용했습니다. 내일 다시 이용해주세요.
                        </div>
                    )}
                </div>
            </div>

            {/* AI 피드백 모달 */}
            <AIFeedbackModal
                isOpen={showFeedbackModal}
                onClose={handleModalClose}
                result={aiResult}
                userAnswer={userAnswer}
                isLoading={isAILoading}
                errorMessage={aiErrorMessage}
            />
        </>
    );
};

export default EssayStudyCard;