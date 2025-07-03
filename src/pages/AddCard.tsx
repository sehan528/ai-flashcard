import { useState, useEffect } from 'react';
import type { CardSet, FlashCard } from '../domains/flashcard/dtos/FlashCard';
import { FlashcardStorage } from '../domains/flashcard/utils/storage';
import CardForm from '../domains/flashcard/components/FlashCard/CardForm';
import CardSetSelector from '../domains/flashcard/components/CardSet/CardSetSelector';

interface AddCardProps {
    onCardAdded?: () => void; // 카드 추가 완료 시 콜백
}

const AddCard = ({ onCardAdded }: AddCardProps) => {
    const [cardSets, setCardSets] = useState<CardSet[]>([]);
    const [selectedCardSetId, setSelectedCardSetId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // 카드셋 목록 로드
    useEffect(() => {
        loadCardSets();
    }, []);

    const loadCardSets = () => {
        const loadedCardSets = FlashcardStorage.getCardSets();
        setCardSets(loadedCardSets);

        // 기본 선택: 첫 번째 카드셋
        if (loadedCardSets.length > 0 && !selectedCardSetId) {
            setSelectedCardSetId(loadedCardSets[0].id);
        }
    };

    // 새 카드셋 생성
    const handleCreateNewCardSet = (name: string, description: string) => {
        const newCardSet: CardSet = {
            id: FlashcardStorage.generateId(),
            name,
            description,
            cards: [],
            createdAt: new Date(),
        };

        FlashcardStorage.addCardSet(newCardSet);
        loadCardSets();
        setSelectedCardSetId(newCardSet.id);

        // 성공 메시지
        setSuccessMessage(`"${name}" 카드셋이 생성되었습니다!`);
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    // 카드 추가
    const handleCardSubmit = async (cardData: Omit<FlashCard, 'id' | 'createdAt' | 'studyCount'>) => {
        if (!selectedCardSetId) {
            alert('카드셋을 선택해주세요.');
            return;
        }

        setIsSubmitting(true);

        try {
            const newCard: FlashCard = {
                ...cardData,
                id: FlashcardStorage.generateId(),
                createdAt: new Date(),
                studyCount: 0,
            };

            FlashcardStorage.addCardToSet(selectedCardSetId, newCard);

            // 카드셋 목록 새로고침
            loadCardSets();

            // 성공 메시지
            const selectedCardSet = cardSets.find(set => set.id === selectedCardSetId);
            setSuccessMessage(`"${selectedCardSet?.name}"에 새 카드가 추가되었습니다!`);
            setTimeout(() => setSuccessMessage(null), 3000);

            // 부모 컴포넌트에 알림
            onCardAdded?.();

        } catch (error) {
            console.error('카드 추가 실패:', error);
            alert('카드 추가에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* 성공 메시지 */}
            {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                    ✅ {successMessage}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 카드셋 선택 영역 */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                        <CardSetSelector
                            cardSets={cardSets}
                            selectedCardSetId={selectedCardSetId}
                            onSelectCardSet={setSelectedCardSetId}
                            onCreateNewSet={handleCreateNewCardSet}
                        />

                        {/* 선택된 카드셋 정보 */}
                        {selectedCardSetId && (
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                <h4 className="font-medium text-blue-900 mb-1">
                                    선택된 카드셋
                                </h4>
                                {(() => {
                                    const selectedSet = cardSets.find(set => set.id === selectedCardSetId);
                                    return selectedSet ? (
                                        <div className="text-sm text-blue-700">
                                            <div>{selectedSet.name}</div>
                                            <div className="opacity-75">
                                                {selectedSet.cards.length}개 카드
                                            </div>
                                        </div>
                                    ) : null;
                                })()}
                            </div>
                        )}
                    </div>
                </div>

                {/* 카드 추가 폼 영역 */}
                <div className="lg:col-span-2">
                    {selectedCardSetId ? (
                        <CardForm
                            onSubmit={handleCardSubmit}
                            key={selectedCardSetId} // 카드셋 변경시 폼 리셋
                        />
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                            <div className="text-4xl mb-4">📝</div>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                카드셋을 선택해주세요
                            </h3>
                            <p className="text-gray-500">
                                새 카드를 추가하려면 먼저 카드셋을 선택하거나 만들어주세요
                            </p>
                        </div>
                    )}

                    {/* 로딩 오버레이 */}
                    {isSubmitting && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-6 flex items-center gap-3">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                <span>카드를 저장하는 중...</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 도움말 섹션 */}
            <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    💡 카드 작성 팁
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                        <strong className="text-gray-800">서술형 카드:</strong>
                        <ul className="mt-1 space-y-1 list-disc list-inside">
                            <li>명확하고 구체적인 질문 작성</li>
                            <li>정답에는 핵심 키워드 포함</li>
                            <li>AI가 평가할 수 있도록 상세히 작성</li>
                        </ul>
                    </div>
                    <div>
                        <strong className="text-gray-800">객관식 카드:</strong>
                        <ul className="mt-1 space-y-1 list-disc list-inside">
                            <li>혼동하기 쉬운 선택지 구성</li>
                            <li>정답이 너무 명확하지 않게 주의</li>
                            <li>2-10개 선택지 권장</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddCard;