import React from 'react';
import type { CardSet } from '../domains/flashcard/dtos/FlashCard';
import { useStudySession } from '../domains/flashcard/hooks/useStudySession';
import EssayStudyCard from '../domains/flashcard/components/Study/EssayStudyCard';
import MultipleStudyCard from '../domains/flashcard/components/Study/MultipleStudyCard';

interface StudyModeProps {
    cardSet: CardSet;
    isRandom: boolean;
    onExit: () => void;
}

const StudyMode = ({ cardSet, isRandom, onExit }: StudyModeProps) => {
    const {
        currentCard,
        currentCardIndex,
        totalCards,
        progress,
        startSession,
        goToNextCard,
        goToPreviousCard,
        shuffleCards,
        endSession,
    } = useStudySession();

    // 세션 시작 (컴포넌트 마운트 시)
    React.useEffect(() => {
        startSession(cardSet, isRandom);

        // 컴포넌트 언마운트 시 세션 종료
        return () => {
            endSession();
        };
    }, [cardSet, isRandom]);


    // 학습 종료
    const handleExit = () => {
        if (confirm('학습을 종료하시겠습니까?')) {
            endSession();
            onExit();
        }
    };

    // 로딩 상태
    if (!currentCard) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <div className="text-xl text-gray-600">학습 준비 중...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 헤더 */}
            <header className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-4 max-w-4xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-800">
                                {cardSet.name}
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                {currentCardIndex + 1} / {totalCards} 카드
                                {isRandom && (
                                    <span className="ml-2 text-orange-600">• 랜덤 모드</span>
                                )}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* 진행률 */}
                            <div className="flex items-center gap-2">
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm text-gray-600 font-medium">
                                    {progress}%
                                </span>
                            </div>

                            {/* 종료 버튼 */}
                            <button
                                onClick={handleExit}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                종료
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* 메인 컨텐츠 */}
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                {/* 카드 표시 영역 */}
                <div className="mb-8">
                    {currentCard.type === 'essay' ? (
                        <EssayStudyCard
                            card={currentCard}
                        />
                    ) : (
                        <MultipleStudyCard
                            card={currentCard}
                        />
                    )}
                </div>

                {/* 네비게이션 컨트롤 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        {/* 이전 버튼 */}
                        <button
                            onClick={goToPreviousCard}
                            disabled={currentCardIndex === 0}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                                currentCardIndex === 0
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            ← 이전 카드
                        </button>

                        {/* 가운데 컨트롤 */}
                        <div className="flex items-center gap-4">
                            {/* 카드 순서 셔플 */}
                            <button
                                onClick={shuffleCards}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-orange-600 border border-orange-300 rounded-md hover:bg-orange-50 transition-colors"
                                title="카드 순서를 다시 섞습니다"
                            >
                                🔀 셔플
                            </button>

                            {/* 카드 인덱스 표시 */}
                            <div className="text-sm text-gray-500">
                                {Array.from({ length: Math.min(totalCards, 10) }, (_, i) => (
                                    <span
                                        key={i}
                                        className={`inline-block w-2 h-2 rounded-full mx-0.5 ${
                                            i === currentCardIndex % 10
                                                ? 'bg-blue-600'
                                                : 'bg-gray-300'
                                        }`}
                                    />
                                ))}
                                {totalCards > 10 && (
                                    <span className="ml-1 text-xs">
                                        ...
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* 다음 버튼 */}
                        <button
                            onClick={goToNextCard}
                            disabled={currentCardIndex === totalCards - 1}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                                currentCardIndex === totalCards - 1
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                            다음 카드 →
                        </button>
                    </div>

                    {/* 학습 완료 메시지 */}
                    {currentCardIndex === totalCards - 1 && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2 text-green-700">
                                <span className="text-lg">🎉</span>
                                <span className="font-medium">
                                    모든 카드를 완료했습니다!
                                </span>
                            </div>
                            <p className="text-sm text-green-600 mt-1">
                                복습을 원하시면 셔플 버튼을 눌러 다시 시작해보세요.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default StudyMode;