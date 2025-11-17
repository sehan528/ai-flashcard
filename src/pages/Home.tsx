import { useState } from 'react';
import type { CardSet } from '../domains/flashcard/dtos/FlashCard';
import { FlashcardStorage } from '../domains/flashcard/utils/storage';
import CardSetGrid from '../domains/flashcard/components/CardSet/CardSetGrid';
import RandomToggle from '../components/UI/RandomToggle';

interface HomeProps {
    cardSets: CardSet[];
    onRefresh: () => void;
    onStartStudy: (cardSet: CardSet, isRandom: boolean) => void;
    onEditCardSet: (cardSetId: string) => void;
}

const Home = ({ cardSets, onRefresh, onStartStudy, onEditCardSet } : HomeProps) => {
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
            // 복제된 카드셋 생성
            const duplicatedSet: CardSet = {
                ...cardSet,
                id: FlashcardStorage.generateId(),
                name: `${cardSet.name} (복사본)`,
                createdAt: new Date(),
                cards: cardSet.cards.map(card => ({
                    ...card,
                    id: FlashcardStorage.generateId(),
                    createdAt: new Date(),
                    studyCount: 0,
                }))
            };

            FlashcardStorage.addCardSet(duplicatedSet);
            onRefresh();
            console.log('카드셋 복제 완료:', duplicatedSet.name);
        } catch (error) {
            console.error('카드셋 복제 실패:', error);
            alert('카드셋 복제에 실패했습니다.');
        }
    };

    const handleDeleteCardSet = (cardSet: CardSet) => {
        if (confirm(`"${cardSet.name}" 카드셋을 삭제하시겠습니까?`)) {
            try {
                const cardSets = FlashcardStorage.getCardSets();
                const filteredSets = cardSets.filter(set => set.id !== cardSet.id);

                FlashcardStorage.saveCardSets(filteredSets);
                onRefresh();

                console.log('카드셋 삭제 완료:', cardSet.name);
            } catch (error) {
                console.error('카드셋 삭제 실패:', error);

                alert('카드셋 삭제에 실패했습니다.');
            }
        }
    };

    const handleAddSampleData = () => {
        FlashcardStorage.createSampleData();
        onRefresh();
    };

    return (
        <div>
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    내 플래시카드 ({cardSets.length}개)
                </h2>

                <RandomToggle
                    isRandom={isRandom}
                    onToggle={setIsRandom}
                />
            </div>

            <CardSetGrid
                cardSets={cardSets}
                onStartStudy={handleStartStudy}
                onEdit={handleEditCardSet}
                onDuplicate={handleDuplicateCardSet}
                onDelete={handleDeleteCardSet}
            />

            {/* 개발용 버튼 */}
            <div className="mt-8 text-center">
                <button
                    onClick={handleAddSampleData}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    샘플 데이터 추가하기
                </button>
            </div>
        </div>
    );
};

export default Home;