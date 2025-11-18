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

    // 단축키 도움말 표시 상태
    const [showShortcutHelp, setShowShortcutHelp] = React.useState(false);

    // 현재 카드의 정답 확인 여부 (서술형 카드용)
    const [isAnswerViewed, setIsAnswerViewed] = React.useState(false);

    // 세션 시작 (컴포넌트 마운트 시)
    React.useEffect(() => {
        startSession(cardSet, isRandom);

        // 컴포넌트 언마운트 시 세션 종료
        return () => {
            endSession();
        };
    }, [cardSet, isRandom]);

    // 카드 변경 시 정답 확인 여부 초기화
    React.useEffect(() => {
        setIsAnswerViewed(false);
    }, [currentCardIndex]);

    // 서술형 카드의 네비게이션 가능 여부 체크
    const canNavigate = () => {
        // 객관식 카드는 항상 이동 가능
        if (currentCard && currentCard.type === 'multiple') {
            return true;
        }
        // 서술형 카드는 정답을 본 후에만 이동 가능
        return isAnswerViewed;
    };

    // 커스텀 네비게이션 함수 (정답 확인 체크 포함)
    const handleGoToNextCard = () => {
        if (currentCard && currentCard.type === 'essay' && !isAnswerViewed) {
            alert('정답을 확인한 후 다음 카드로 넘어갈 수 있습니다.');
            return;
        }
        goToNextCard();
    };

    const handleGoToPreviousCard = () => {
        goToPreviousCard();
    };

    // 키보드 단축키 (화살표 키로 네비게이션)
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // 입력 중인 요소가 있으면 무시 (textarea, input 등)
            const target = e.target as HTMLElement;
            if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
                return;
            }

            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                if (currentCardIndex > 0) {
                    handleGoToPreviousCard();
                }
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                if (currentCardIndex < totalCards - 1) {
                    handleGoToNextCard();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentCardIndex, totalCards, isAnswerViewed, currentCard]);


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

                            {/* 단축키 도움말 버튼 */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowShortcutHelp(!showShortcutHelp)}
                                    className="px-3 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                    title="키보드 단축키"
                                >
                                    ⌨️
                                </button>

                                {/* 단축키 안내 드롭다운 */}
                                {showShortcutHelp && (
                                    <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="font-semibold text-gray-800">⌨️ 키보드 단축키</h3>
                                            <button
                                                onClick={() => setShowShortcutHelp(false)}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                ✕
                                            </button>
                                        </div>

                                        <div className="space-y-3 text-sm">
                                            {/* 네비게이션 */}
                                            <div>
                                                <div className="font-medium text-gray-700 mb-1">📍 카드 이동</div>
                                                <div className="text-gray-600 space-y-1 ml-2">
                                                    <div><kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">←</kbd> 이전 카드</div>
                                                    <div><kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">→</kbd> 다음 카드</div>
                                                </div>
                                            </div>

                                            {/* 서술형 */}
                                            <div className="border-t border-gray-200 pt-3">
                                                <div className="font-medium text-gray-700 mb-1">📝 서술형 카드</div>
                                                <div className="text-gray-600 space-y-1 ml-2">
                                                    <div><kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">Enter</kbd> 정답 보기/숨기기</div>
                                                    <div className="text-xs text-gray-500 ml-2">※ 답변 입력 중에는 개행</div>
                                                </div>
                                            </div>

                                            {/* 객관식 */}
                                            <div className="border-t border-gray-200 pt-3">
                                                <div className="font-medium text-gray-700 mb-1">✅ 객관식 카드</div>
                                                <div className="text-gray-600 space-y-1 ml-2">
                                                    <div><kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">1-0</kbd> 선택지 선택 (1~10번)</div>
                                                    <div><kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">Enter</kbd> 정답 확인 / 다시 풀기</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500">
                                            💡 입력 필드에 포커스가 있을 때는 단축키가 비활성화됩니다.
                                        </div>
                                    </div>
                                )}
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
                            onAnswerViewed={() => setIsAnswerViewed(true)}
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
                            onClick={handleGoToPreviousCard}
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
                            onClick={handleGoToNextCard}
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