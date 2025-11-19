import React, { useState } from 'react';
import type { CardSet } from '../../dtos/FlashCard';
import ContextMenu from '../../../../components/UI/ContextMenu';
import CardSetEditModal from './CardSetEditModal';

interface CardSetSelectorProps {
    cardSets: CardSet[];
    selectedCardSetId: string | null;
    onSelectCardSet: (cardSetId: string) => void;
    onCreateNewSet: (name: string, description: string) => void;
    onEditCardSet?: (cardSetId: string, name: string, description: string) => void;
    onDeleteCardSet?: (cardSetId: string) => void;
}

const CardSetSelector = ({
                             cardSets,
                             selectedCardSetId,
                             onSelectCardSet,
                             onCreateNewSet,
                             onEditCardSet,
                             onDeleteCardSet,
                         }: CardSetSelectorProps) => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newSetName, setNewSetName] = useState('');
    const [newSetDescription, setNewSetDescription] = useState('');
    const [createErrors, setCreateErrors] = useState<Record<string, string>>({});

    // 컨텍스트 메뉴 상태
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; cardSetId: string } | null>(null);

    // 편집 모달 상태
    const [editModal, setEditModal] = useState<{ isOpen: boolean; cardSet: CardSet | null }>({
        isOpen: false,
        cardSet: null,
    });

    // 삭제 확인 다이얼로그 상태
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; cardSet: CardSet | null }>({
        isOpen: false,
        cardSet: null,
    });

    // 새 카드셋 생성 폼 검증
    const validateCreateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!newSetName.trim()) {
            newErrors.name = '카드셋 이름을 입력해주세요.';
        } else if (newSetName.length > 30) {
            newErrors.name = '카드셋 이름은 30자 이하로 입력해주세요.';
        }

        if (newSetDescription.length > 150) {
            newErrors.description = '설명은 150자 이하로 입력해주세요.';
        }

        setCreateErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 새 카드셋 생성
    const handleCreateNewSet = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateCreateForm()) {
            onCreateNewSet(newSetName.trim(), newSetDescription.trim());
            setNewSetName('');
            setNewSetDescription('');
            setCreateErrors({});
            setShowCreateForm(false);
        }
    };

    // 컨텍스트 메뉴 표시
    const handleContextMenu = (e: React.MouseEvent, cardSetId: string) => {
        e.preventDefault();
        e.stopPropagation();

        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            cardSetId,
        });
    };

    // 컨텍스트 메뉴 닫기
    const closeContextMenu = () => {
        setContextMenu(null);
    };

    // 카드셋 편집 시작
    const handleEditCardSet = (cardSetId: string) => {
        const cardSet = cardSets.find(set => set.id === cardSetId);
        if (cardSet) {
            setEditModal({ isOpen: true, cardSet });
        }
        closeContextMenu();
    };

    // 카드셋 삭제 확인 다이얼로그 표시
    const handleDeleteCardSet = (cardSetId: string) => {
        const cardSet = cardSets.find(set => set.id === cardSetId);
        if (cardSet) {
            setDeleteConfirm({ isOpen: true, cardSet });
        }
        closeContextMenu();
    };

    // 카드셋 삭제 확정
    const confirmDeleteCardSet = () => {
        if (deleteConfirm.cardSet && onDeleteCardSet) {
            onDeleteCardSet(deleteConfirm.cardSet.id);
        }
        setDeleteConfirm({ isOpen: false, cardSet: null });
    };

// 카드셋 편집 저장
    const handleSaveEdit = (name: string, description: string) => {
        if (editModal.cardSet && onEditCardSet) {
            onEditCardSet(editModal.cardSet.id, name, description);
        }
        setEditModal({ isOpen: false, cardSet: null });
    };

    // 컨텍스트 메뉴 아이템들
    const getContextMenuItems = (cardSetId: string) => [
        {
            label: '편집',
            icon: '✏️',
            onClick: () => handleEditCardSet(cardSetId),
        },
        {
            label: '삭제',
            icon: '🗑️',
            onClick: () => handleDeleteCardSet(cardSetId),
            danger: true,
        },
    ];

    return (
        <>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        카드셋 선택 *
                    </label>

                    {cardSets.length === 0 ? (
                        <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                            <p className="text-gray-600 mb-3">아직 카드셋이 없습니다.</p>
                            <button
                                type="button"
                                onClick={() => setShowCreateForm(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                첫 번째 카드셋 만들기
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {/* 기존 카드셋 목록 */}
                            <div className="grid gap-2 max-h-[24rem] overflow-y-auto scrollbar-hide">
                                {cardSets.map((cardSet) => (
                                    <div
                                        key={cardSet.id}
                                        className={`p-3 border rounded-lg transition-all cursor-pointer relative group ${
                                            selectedCardSetId === cardSet.id
                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
                                        }`}
                                        onClick={() => onSelectCardSet(cardSet.id)}
                                    >
                                        {/* 컨텍스트 메뉴 버튼 */}
                                        <button
                                            className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded transition-all"
                                            onClick={(e) => handleContextMenu(e, cardSet.id)}
                                            title="옵션"
                                        >
                                            <span className="text-gray-500 text-sm">⋮</span>
                                        </button>

                                        <div className="font-medium pr-6">{cardSet.name}</div>
                                        <div className="text-sm opacity-75">
                                            {cardSet.description} • {cardSet.cards.length}개 카드
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* 새 카드셋 만들기 버튼 */}
                            <button
                                type="button"
                                onClick={() => setShowCreateForm(true)}
                                className="w-full p-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-gray-400 hover:text-gray-700 transition-colors"
                            >
                                + 새 카드셋 만들기
                            </button>
                        </div>
                    )}
                </div>

                {/* 새 카드셋 생성 폼 */}
                {showCreateForm && (
                    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                        <form onSubmit={handleCreateNewSet} className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    카드셋 이름 *
                                </label>
                                <input
                                    type="text"
                                    value={newSetName}
                                    onChange={(e) => setNewSetName(e.target.value)}
                                    placeholder="예: JavaScript 기초, React Hooks"
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        createErrors.name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    maxLength={30}
                                    required
                                />
                                <div className="flex justify-between items-center mt-1">
                                    {createErrors.name ? (
                                        <p className="text-sm text-red-600">{createErrors.name}</p>
                                    ) : (
                                        <div />
                                    )}
                                    <span className="text-xs text-gray-500">
                                        {newSetName.length}/30
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    설명 (선택사항)
                                </label>
                                <textarea
                                    value={newSetDescription}
                                    onChange={(e) => setNewSetDescription(e.target.value)}
                                    placeholder="카드셋에 대한 간단한 설명"
                                    rows={2}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                                        createErrors.description ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    maxLength={150}
                                />
                                <div className="flex justify-between items-center mt-1">
                                    {createErrors.description ? (
                                        <p className="text-sm text-red-600">{createErrors.description}</p>
                                    ) : (
                                        <div />
                                    )}
                                    <span className="text-xs text-gray-500">
                                        {newSetDescription.length}/150
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition-colors text-sm"
                                >
                                    카드셋 생성
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateForm(false);
                                        setNewSetName('');
                                        setNewSetDescription('');
                                        setCreateErrors({});
                                    }}
                                    className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm"
                                >
                                    취소
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            {/* 컨텍스트 메뉴 */}
            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    items={getContextMenuItems(contextMenu.cardSetId)}
                    onClose={closeContextMenu}
                />
            )}

            {/* 편집 모달 */}
            {editModal.cardSet && (
                <CardSetEditModal
                    cardSet={editModal.cardSet}
                    isOpen={editModal.isOpen}
                    onClose={() => setEditModal({ isOpen: false, cardSet: null })}
                    onSave={handleSaveEdit}
                />
            )}

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

export default CardSetSelector;