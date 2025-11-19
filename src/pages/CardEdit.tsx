import { useState, useEffect } from 'react';
import type { CardSet, FlashCard } from '../domains/flashcard/dtos/FlashCard';
import CardSetSelector from '../domains/flashcard/components/CardSet/CardSetSelector';
import CardListManager from '../domains/flashcard/components/FlashCard/CardListManager';
import CardForm from '../domains/flashcard/components/FlashCard/CardForm';
import { useFlashcardStore } from '../stores/flashcardStore';

type EditMode = 'list' | 'add' | 'edit';

interface CardEditProps {
    initialCardSetId?: string | null; // 초기 선택할 카드셋 ID
    onCardChanged?: () => void; // 카드 변경 완료 시 콜백
}

const CardEdit = ({ initialCardSetId, onCardChanged }: CardEditProps) => {
    // Zustand store
    const { cardSets, addCardSet, updateCardSet, deleteCardSet, addCard, updateCard, deleteCard, showToast } = useFlashcardStore();

    // 로컬 UI 상태
    const [selectedCardSetId, setSelectedCardSetId] = useState<string | null>(null);
    const [editMode, setEditMode] = useState<EditMode>('list');
    const [editingCard, setEditingCard] = useState<FlashCard | null>(null);
    const [isCardSetSelectorExpanded, setIsCardSetSelectorExpanded] = useState(false);

    // initialCardSetId 또는 cardSets 변경 시 선택 상태 업데이트
    useEffect(() => {
        if (initialCardSetId) {
            setSelectedCardSetId(initialCardSetId);
            setEditMode('list');
        } else if (cardSets.length > 0 && !selectedCardSetId) {
            setSelectedCardSetId(cardSets[0].id);
        }
    }, [initialCardSetId, cardSets, selectedCardSetId]);

    // 선택된 카드셋 가져오기
    const selectedCardSet = cardSets.find(set => set.id === selectedCardSetId);

    // 새 카드셋 생성
    const handleCreateNewCardSet = (name: string, description: string) => {
        const newCardSet: CardSet = {
            id: crypto.randomUUID(),
            name,
            description,
            cards: [],
            createdAt: new Date(),
        };

        addCardSet(newCardSet);
        setSelectedCardSetId(newCardSet.id);
        showToast('success', `"${name}" 카드셋이 생성되었습니다!`);
    };

    // 카드셋 편집
    const handleEditCardSet = (cardSetId: string, name: string, description: string) => {
        try {
            updateCardSet(cardSetId, { name, description });
            showToast('success', '카드셋이 수정되었습니다!');
            onCardChanged?.();
        } catch (error) {
            console.error('카드셋 수정 실패:', error);
            showToast('error', '카드셋 수정에 실패했습니다.');
        }
    };

    // 카드셋 삭제
    const handleDeleteCardSet = (cardSetId: string) => {
        try {
            deleteCardSet(cardSetId);

            // 현재 선택된 카드셋이 삭제된 경우
            if (selectedCardSetId === cardSetId) {
                const remainingCardSets = cardSets.filter(set => set.id !== cardSetId);
                setSelectedCardSetId(remainingCardSets.length > 0 ? remainingCardSets[0].id : null);
                setEditMode('list');
            }

            showToast('success', '카드셋이 삭제되었습니다!');
            onCardChanged?.();
        } catch (error) {
            console.error('카드셋 삭제 실패:', error);
            showToast('error', '카드셋 삭제에 실패했습니다.');
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
                    id: crypto.randomUUID(),
                    createdAt: new Date(),
                    studyCount: 0,
                };

                addCard(selectedCardSetId, newCard);
                showToast('success', '새 카드가 추가되었습니다!');

            } else if (editMode === 'edit' && editingCard) {
                // 기존 카드 수정
                updateCard(selectedCardSetId, editingCard.id, cardData);
                showToast('success', '카드가 수정되었습니다!');
            }

            setEditMode('list');
            setEditingCard(null);
            onCardChanged?.();

        } catch (error) {
            console.error('카드 저장 실패:', error);
            showToast('error', '카드 저장에 실패했습니다.');
        }
    };

    // 카드 삭제
    const handleDeleteCard = (cardId: string) => {
        if (!selectedCardSetId) return;

        try {
            deleteCard(selectedCardSetId, cardId);
            showToast('success', '카드가 삭제되었습니다!');
            onCardChanged?.();
        } catch (error) {
            console.error('카드 삭제 실패:', error);
            showToast('error', '카드 삭제에 실패했습니다.');
        }
    };

    // 목록으로 돌아가기
    const handleBackToList = () => {
        setEditMode('list');
        setEditingCard(null);
    };

    return (
        <div className="max-w-full mx-auto h-[calc(100vh-160px)] flex flex-col overflow-hidden">
            {/* 모바일용 카드셋 선택 영역 (Collapsible) - 리스트 모드에서만 표시 */}
            {editMode === 'list' && (
                <div className="xl:hidden mb-4 flex-shrink-0">
                    {/* 접혀있을 때 헤더 */}
                    <button
                        onClick={() => setIsCardSetSelectorExpanded(!isCardSetSelectorExpanded)}
                        className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-xl">📂</span>
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                                <div className="text-xs text-gray-500 mb-0.5">현재 카드셋</div>
                                {selectedCardSet ? (
                                    <>
                                        <div className="font-medium text-gray-800 truncate">
                                            {selectedCardSet.name}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            {selectedCardSet.cards.length}개 카드
                                        </div>
                                    </>
                                ) : (
                                    <div className="font-medium text-gray-500">
                                        카드셋을 선택해주세요
                                    </div>
                                )}
                            </div>
                        </div>
                        <svg
                            className={`w-5 h-5 text-gray-400 transform transition-transform ${
                                isCardSetSelectorExpanded ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>

                    {/* 펼쳐졌을 때 카드셋 선택기 */}
                    {isCardSetSelectorExpanded && (
                        <div className="mt-2 bg-white rounded-xl shadow-sm border border-gray-200 p-4 max-h-[60vh] overflow-y-auto">
                            <CardSetSelector
                                cardSets={cardSets}
                                selectedCardSetId={selectedCardSetId}
                                onSelectCardSet={(cardSetId) => {
                                    setSelectedCardSetId(cardSetId);
                                    setEditMode('list'); // 카드셋 변경 시 목록 모드로
                                    setEditingCard(null);
                                    setIsCardSetSelectorExpanded(false); // 선택 후 자동으로 접기
                                }}
                                onCreateNewSet={(name, description) => {
                                    handleCreateNewCardSet(name, description);
                                    setIsCardSetSelectorExpanded(false); // 생성 후 자동으로 접기
                                }}
                                onEditCardSet={handleEditCardSet}
                                onDeleteCardSet={handleDeleteCardSet}
                            />
                        </div>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 flex-1 overflow-hidden">
                {/* 왼쪽: 카드셋 선택 영역 - 데스크톱 전용 */}
                <div className="hidden xl:block xl:col-span-1 overflow-y-auto scrollbar-hide">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-0">
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
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
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

                {/* 오른쪽: 카드 관리 영역 */}
                <div className="xl:col-span-2 overflow-hidden flex flex-col w-full">
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
                        <div className="flex-1 overflow-y-auto flex flex-col">
                            {/* 모바일용 헤더 with 뒤로가기 */}
                            <div className="xl:hidden mb-3 flex-shrink-0">
                                <button
                                    onClick={handleBackToList}
                                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium transition-colors mb-3"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    <span>카드 목록으로</span>
                                </button>

                                {/* 현재 편집 중인 카드셋 표시 */}
                                {selectedCardSet && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">📂</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs text-blue-600 mb-0.5">편집 중인 카드셋</div>
                                                <div className="font-medium text-blue-900 truncate">{selectedCardSet.name}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 데스크톱용 뒤로가기 버튼 */}
                            <button
                                onClick={handleBackToList}
                                className="hidden xl:flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
                            >
                                ← 카드 목록으로 돌아가기
                            </button>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col">
                                <div className="p-4 xl:p-6 border-b border-gray-200 flex-shrink-0">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {editMode === 'add' ? '새 플래시카드 추가' : '플래시카드 편집'}
                                    </h3>
                                    <p className="text-sm xl:text-base text-gray-600 mt-1">
                                        {editMode === 'add'
                                            ? `"${selectedCardSet?.name}"에 새 카드를 추가합니다`
                                            : '기존 카드를 수정합니다'
                                        }
                                    </p>
                                </div>

                                <div className="p-4 xl:p-6 flex-1 overflow-y-auto">
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