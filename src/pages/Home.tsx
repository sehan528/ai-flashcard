import { useState } from 'react';
import type { CardSet } from '../domains/flashcard/dtos/FlashCard';
import CardSetGrid from '../domains/flashcard/components/CardSet/CardSetGrid';
import RandomToggle from '../components/UI/RandomToggle';
import { useFlashcardStore } from '../stores/flashcardStore';

interface HomeProps {
    onStartStudy: (cardSet: CardSet, isRandom: boolean) => void;
    onEditCardSet: (cardSetId: string) => void;
}

const Home = ({ onStartStudy, onEditCardSet } : HomeProps) => {
    // Zustand store
    const { cardSets, duplicateCardSet, deleteCardSet, createSampleData, showToast } = useFlashcardStore();

    // 로컬 UI 상태
    const [isRandom, setIsRandom] = useState(false);

    // 이벤트 핸들러들
    const handleStartStudy = (cardSet: CardSet) => {
        onStartStudy(cardSet, isRandom);
    };

    const handleEditCardSet = (cardSet: CardSet) => {
        onEditCardSet(cardSet.id);
    };

    const handleDuplicateCardSet = (cardSet: CardSet) => {
        try {
            duplicateCardSet(cardSet);
            showToast('success', `"${cardSet.name}" 카드셋이 복제되었습니다.`);
        } catch (error) {
            console.error('카드셋 복제 실패:', error);
            showToast('error', '카드셋 복제에 실패했습니다.');
        }
    };

    const handleDeleteCardSet = (cardSet: CardSet) => {
        if (confirm(`"${cardSet.name}" 카드셋을 삭제하시겠습니까?`)) {
            try {
                deleteCardSet(cardSet.id);
                showToast('success', `"${cardSet.name}" 카드셋이 삭제되었습니다.`);
            } catch (error) {
                console.error('카드셋 삭제 실패:', error);
                showToast('error', '카드셋 삭제에 실패했습니다.');
            }
        }
    };

    const handleAddSampleData = () => {
        createSampleData();
        showToast('success', '샘플 데이터가 추가되었습니다.');
    };

    return (
        <div className="flex flex-col h-[calc(100vh-200px)]">
            {/* 고정 헤더 영역 */}
            <div className="sticky top-[200px] z-40 bg-gray-50 pb-4 mb-4 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    내 플래시카드 ({cardSets.length}개)
                </h2>

                <div className="flex flex-col items-center gap-2">
                    <RandomToggle
                        isRandom={isRandom}
                        onToggle={setIsRandom}
                    />
                    <p className="text-xs text-gray-500">
                        {isRandom
                            ? '학습 시 카드셋 내 문제들이 랜덤 순서로 출제됩니다'
                            : '학습 시 카드셋 내 문제들이 순서대로 출제됩니다'}
                    </p>
                </div>
            </div>

            {/* 스크롤 가능한 카드 그리드 영역 */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
                <CardSetGrid
                    cardSets={cardSets}
                    onStartStudy={handleStartStudy}
                    onEdit={handleEditCardSet}
                    onDuplicate={handleDuplicateCardSet}
                    onDelete={handleDeleteCardSet}
                />

                {/* 개발용 버튼 */}
                <div className="mt-8 mb-8 text-center">
                    <button
                        onClick={handleAddSampleData}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        샘플 데이터 추가하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;