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
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; cardSet: CardSet | null }>({
        isOpen: false,
        cardSet: null,
    });

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
        setDeleteConfirm({ isOpen: true, cardSet });
    };

    const confirmDeleteCardSet = () => {
        if (deleteConfirm.cardSet) {
            try {
                deleteCardSet(deleteConfirm.cardSet.id);
                showToast('success', `"${deleteConfirm.cardSet.name}" 카드셋이 삭제되었습니다.`);
            } catch (error) {
                console.error('카드셋 삭제 실패:', error);
                showToast('error', '카드셋 삭제에 실패했습니다.');
            }
        }
        setDeleteConfirm({ isOpen: false, cardSet: null });
    };

    const handleAddSampleData = () => {
        createSampleData();
        showToast('success', '샘플 데이터가 추가되었습니다.');
    };

    return (
        <>
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

        {/* 삭제 확인 다이얼로그 */}
        {deleteConfirm.isOpen && deleteConfirm.cardSet && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
                <div className="bg-white rounded-xl p-6 max-w-md mx-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                        카드셋 삭제 확인
                    </h3>
                    <p className="text-gray-600 mb-6">
                        <strong>"{deleteConfirm.cardSet.name}"</strong> 카드셋을 삭제하시겠습니까?
                        <br />
                        <span className="text-sm text-red-600 mt-2 block">
                            이 작업은 되돌릴 수 없습니다.
                        </span>
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setDeleteConfirm({ isOpen: false, cardSet: null })}
                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                            취소
                        </button>
                        <button
                            onClick={confirmDeleteCardSet}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                            삭제
                        </button>
                    </div>
                </div>
            </div>
        )}
    </>
    );
};

export default Home;