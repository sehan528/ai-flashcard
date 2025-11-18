import React, { useState } from 'react';
import type { CardSet } from '../../dtos/FlashCard';
import ContextMenu from '../../../../components/UI/ContextMenu';

interface CardSetItemProps {
    cardSet: CardSet;
    onStartStudy: (cardSet: CardSet) => void;
    onEdit: (cardSet: CardSet) => void;
    onDuplicate: (cardSet: CardSet) => void;
    onDelete: (cardSet: CardSet) => void;
}

const CardSetItem = ({
                         cardSet,
                         onStartStudy,
                         onEdit,
                         onDuplicate,
                         onDelete,
                     }: CardSetItemProps) => {
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

    const handleOptionsClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        setContextMenu({
            x: rect.left,
            y: rect.bottom + 4,
        });
    };

    const closeContextMenu = () => {
        setContextMenu(null);
    };

    const handleEdit = () => {
        onEdit(cardSet);
        closeContextMenu();
    };

    const handleDuplicate = () => {
        onDuplicate(cardSet);
        closeContextMenu();
    };

    const handleDelete = () => {
        onDelete(cardSet);
        closeContextMenu();
    };

    const contextMenuItems = [
        { label: '수정', icon: '✏️', onClick: handleEdit },
        { label: '복제', icon: '📋', onClick: handleDuplicate },
        { label: '삭제', icon: '🗑️', onClick: handleDelete, danger: true },
    ];

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 relative">
                {/* 메인 카드 영역 (클릭 시 학습 시작) */}
                <div
                    className="p-6 cursor-pointer"
                    onClick={() => onStartStudy(cardSet)}
                >
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 pr-8">
                        {cardSet.name}
                    </h3>

                    <p className="text-gray-600 mb-4">
                        {cardSet.description}
                    </p>

                    <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{cardSet.cards.length}개 카드</span>
                        <span>
                            생성일: {cardSet.createdAt.toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {/* 옵션 버튼 (우측 상단) */}
                <button
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
                    onClick={handleOptionsClick}
                    title="옵션"
                >
                    <svg
                        className="w-5 h-5 text-gray-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                </button>
            </div>

            {/* 컨텍스트 메뉴 */}
            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    items={contextMenuItems}
                    onClose={closeContextMenu}
                />
            )}
        </>
    );
};

export default CardSetItem;
