import { useState, useEffect } from 'react';
import type { CardSet, FlashCard } from '../domains/flashcard/dtos/FlashCard';
import { FlashcardStorage } from '../domains/flashcard/utils/storage';
import CardSetSelector from '../domains/flashcard/components/CardSet/CardSetSelector';
import CardListManager from '../domains/flashcard/components/FlashCard/CardListManager';
import CardForm from '../domains/flashcard/components/FlashCard/CardForm';

type EditMode = 'list' | 'add' | 'edit';

interface CardEditProps {
    initialCardSetId?: string | null; // 초기 선택할 카드셋 ID
    onCardChanged?: () => void; // 카드 변경 완료 시 콜백
}

const CardEdit = ({ initialCardSetId, onCardChanged }: CardEditProps) => {
    const [cardSets, setCardSets] = useState<CardSet[]>([]);
    const [selectedCardSetId, setSelectedCardSetId] = useState<string | null>(null);
    const [editMode, setEditMode] = useState<EditMode>('list');
    const [editingCard, setEditingCard] = useState<FlashCard | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // 카드셋 목록 로드
    useEffect(() => {
        loadCardSets();
    }, []);

    // initialCardSetId가 변경되면 선택된 카드셋 업데이트
    useEffect(() => {
        if (initialCardSetId) {
            setSelectedCardSetId(initialCardSetId);
            setEditMode('list'); // 리스트 모드로 전환
        }
    }, [initialCardSetId]);

    const loadCardSets = () => {
        const loadedCardSets = FlashcardStorage.getCardSets();
        setCardSets(loadedCardSets);

        // initialCardSetId가 있으면 그것을 선택, 없으면 첫 번째 카드셋 선택
        if (initialCardSetId) {
            setSelectedCardSetId(initialCardSetId);
        } else if (loadedCardSets.length > 0 && !selectedCardSetId) {
            setSelectedCardSetId(loadedCardSets[0].id);
        }
    };

    // 선택된 카드셋 가져오기
    const selectedCardSet = cardSets.find(set => set.id === selectedCardSetId);

    // 성공 메시지 표시
    const showSuccessMessage = (message: string) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(null), 3000);
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
        showSuccessMessage(`"${name}" 카드셋이 생성되었습니다!`);
    };

    // 카드셋 편집
    const handleEditCardSet = (cardSetId: string, name: string, description: string) => {
        try {
            const cardSets = FlashcardStorage.getCardSets();
            const updatedSets = cardSets.map(set =>
                set.id === cardSetId
                    ? { ...set, name, description }
                    : set
            );

            FlashcardStorage.saveCardSets(updatedSets);
            loadCardSets();
            showSuccessMessage('카드셋이 수정되었습니다!');
            onCardChanged?.();
        } catch (error) {
            console.error('카드셋 수정 실패:', error);
            alert('카드셋 수정에 실패했습니다.');
        }
    };

    // 카드셋 삭제
    const handleDeleteCardSet = (cardSetId: string) => {
        try {
            const cardSets = FlashcardStorage.getCardSets();
            const filteredSets = cardSets.filter(set => set.id !== cardSetId);

            FlashcardStorage.saveCardSets(filteredSets);

            // 현재 선택된 카드셋이 삭제된 경우
            if (selectedCardSetId === cardSetId) {
                setSelectedCardSetId(filteredSets.length > 0 ? filteredSets[0].id : null);
                setEditMode('list');
            }

            loadCardSets();
            showSuccessMessage('카드셋이 삭제되었습니다!');
            onCardChanged?.();
        } catch (error) {
            console.error('카드셋 삭제 실패:', error);
            alert('카드셋 삭제에 실패했습니다.');
        }
    };

    // 새 카드 추가 시작
    const handleAddNewCard = () => {
        setEditingCard(null);
        setEditMode('add');
    };

    // 카드 편집 시작
    const handleEditCard = (card: FlashCard) => {
        setEditingCard(card);
        setEditMode('edit');
    };

    // 카드 저장 (추가/수정)
    const handleCardSubmit = (cardData: Omit<FlashCard, 'id' | 'createdAt' | 'studyCount'>) => {
        if (!selectedCardSetId) return;

        try {
            if (editMode === 'add') {
                // 새 카드 추가
                const newCard: FlashCard = {
                    ...cardData,
                    id: FlashcardStorage.generateId(),
                    createdAt: new Date(),
                    studyCount: 0,
                };

                FlashcardStorage.addCardToSet(selectedCardSetId, newCard);
                showSuccessMessage('새 카드가 추가되었습니다!');

            } else if (editMode === 'edit' && editingCard) {
                // 기존 카드 수정
                const cardSets = FlashcardStorage.getCardSets();
                const updatedSets = cardSets.map(set => {
                    if (set.id === selectedCardSetId) {
                        return {
                            ...set,
                            cards: set.cards.map(card =>
                                card.id === editingCard.id
                                    ? { ...card, ...cardData }
                                    : card
                            )
                        };
                    }
                    return set;
                });

                FlashcardStorage.saveCardSets(updatedSets);
                showSuccessMessage('카드가 수정되었습니다!');
            }

            loadCardSets();
            setEditMode('list');
            setEditingCard(null);
            onCardChanged?.();

        } catch (error) {
            console.error('카드 저장 실패:', error);
            alert('카드 저장에 실패했습니다.');
        }
    };

    // 카드 삭제
    const handleDeleteCard = (cardId: string) => {
        if (!selectedCardSetId) return;

        try {
            const cardSets = FlashcardStorage.getCardSets();
            const updatedSets = cardSets.map(set => {
                if (set.id === selectedCardSetId) {
                    return {
                        ...set,
                        cards: set.cards.filter(card => card.id !== cardId)
                    };
                }
                return set;
            });

            FlashcardStorage.saveCardSets(updatedSets);
            loadCardSets();
            showSuccessMessage('카드가 삭제되었습니다!');
            onCardChanged?.();

        } catch (error) {
            console.error('카드 삭제 실패:', error);
            alert('카드 삭제에 실패했습니다.');
        }
    };

    // 목록으로 돌아가기
    const handleBackToList = () => {
        setEditMode('list');
        setEditingCard(null);
    };

    return (
        <div className="max-w-full mx-auto h-[calc(100vh-160px)] flex flex-col overflow-hidden">
            {/* 성공 메시지 */}
            {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex-shrink-0">
                    ✅ {successMessage}
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 flex-1 overflow-hidden">
                {/* 왼쪽: 카드셋 선택 영역 */}
                <div className="xl:col-span-1 overflow-hidden">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full flex flex-col max-h-[calc(100vh-200px)]">
                        <div className="flex-1 overflow-y-auto">
                            <CardSetSelector
                                cardSets={cardSets}
                                selectedCardSetId={selectedCardSetId}
                                onSelectCardSet={(cardSetId) => {
                                    setSelectedCardSetId(cardSetId);
                                    setEditMode('list'); // 카드셋 변경 시 목록 모드로
                                    setEditingCard(null);
                                }}
                                onCreateNewSet={handleCreateNewCardSet}
                                onEditCardSet={handleEditCardSet}
                                onDeleteCardSet={handleDeleteCardSet}
                            />

                            {/* 선택된 카드셋 정보 */}
                            {selectedCardSet && (
                                <div className="mt-4 p-3 bg-blue-50 rounded-lg flex-shrink-0">
                                    <h4 className="font-medium text-blue-900 mb-1">
                                        현재 편집 중
                                    </h4>
                                    <div className="text-sm text-blue-700">
                                        <div>{selectedCardSet.name}</div>
                                        <div className="opacity-75">
                                            {selectedCardSet.cards.length}개 카드
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 오른쪽: 카드 관리 영역 */}
                <div className="xl:col-span-2 overflow-hidden flex flex-col">
                    {!selectedCardSetId ? (
                        /* 카드셋 미선택 상태 */
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                            <div className="text-4xl mb-4">📂</div>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                카드셋을 선택해주세요
                            </h3>
                            <p className="text-gray-500">
                                카드를 편집하려면 먼저 카드셋을 선택하거나 만들어주세요
                            </p>
                        </div>
                    ) : editMode === 'list' ? (
                        /* 카드 목록 모드 */
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 overflow-hidden flex flex-col">
                            <CardListManager
                                cardSet={selectedCardSet!}
                                onEditCard={handleEditCard}
                                onDeleteCard={handleDeleteCard}
                                onAddNewCard={handleAddNewCard}
                            />
                        </div>
                    ) : (
                        /* 카드 추가/편집 모드 */
                        <div className="space-y-4 flex-1 overflow-y-auto">
                            {/* 뒤로가기 버튼 */}
                            <button
                                onClick={handleBackToList}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                ← 카드 목록으로 돌아가기
                            </button>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="p-6 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {editMode === 'add' ? '새 플래시카드 추가' : '플래시카드 편집'}
                                    </h3>
                                    <p className="text-gray-600 mt-1">
                                        {editMode === 'add'
                                            ? `"${selectedCardSet?.name}"에 새 카드를 추가합니다`
                                            : '기존 카드를 수정합니다'
                                        }
                                    </p>
                                </div>

                                <div className="p-6">
                                    <CardForm
                                        onSubmit={handleCardSubmit}
                                        onCancel={handleBackToList}
                                        initialData={editingCard || undefined}
                                        key={editMode + (editingCard?.id || 'new')} // 폼 리셋용
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CardEdit;