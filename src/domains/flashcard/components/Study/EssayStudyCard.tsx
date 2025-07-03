import { useState } from 'react';
import type { FlashCard } from '../../dtos/FlashCard';

interface EssayStudyCardProps {
    card: FlashCard;
    onAIEvaluate?: (userAnswer: string) => void;
    isAILoading?: boolean;
}

const EssayStudyCard = ({ card, onAIEvaluate, isAILoading }: EssayStudyCardProps) => {
    const [userAnswer, setUserAnswer] = useState('');
    const [showAnswer, setShowAnswer] = useState(false);

    const handleAIEvaluate = () => {
        if (userAnswer.trim() && onAIEvaluate) {
            onAIEvaluate(userAnswer.trim());
        } else {
            alert('답변을 입력해주세요.');
        }
    };

    const handleShowAnswer = () => {
        setShowAnswer(!showAnswer);
    };

    const handleReset = () => {
        setUserAnswer('');
        setShowAnswer(false);
    };

    return (
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
            </div>

            {/* 정답 표시 영역 */}
            {showAnswer && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-700">✅ 정답:</span>
                    </div>
                    <p className="text-gray-800 leading-relaxed">
                        {typeof card.answer === 'string' ? card.answer : '정답 데이터 오류'}
                    </p>
                </div>
            )}

            {/* 버튼 영역 */}
            <div className="flex flex-wrap gap-3">
                {/* AI 평가 버튼 */}
                <button
                    onClick={handleAIEvaluate}
                    disabled={!userAnswer.trim() || isAILoading}
                    className={`flex-1 min-w-[140px] py-2 px-4 rounded-md font-medium transition-colors ${
                        !userAnswer.trim() || isAILoading
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                    {isAILoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            AI 평가 중...
                        </span>
                    ) : (
                        '🤖 AI에게 평가받기'
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

            {/* 도움말 */}
            <div className="mt-4 text-xs text-gray-500 text-center">
                💡 답변을 작성한 후 AI 평가를 받아보세요. 정답과 비교하여 학습 효과를 높일 수 있습니다.
            </div>
        </div>
    );
};

export default EssayStudyCard;