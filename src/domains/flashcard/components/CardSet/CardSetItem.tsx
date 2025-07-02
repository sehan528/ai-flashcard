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
                                                    } : CardSetItemProps) => {
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();

        setContextMenu({
            x: event.clientX,
            y: event.clientY,
        });
    };

    const closeContextMenu = () => {
        setContextMenu(null);
    };

    const contextMenuItems = [
        {
            label: '복제',
            icon: '📋',
            onClick: () => onDuplicate(cardSet),
        },
        {
            label: '수정',
            icon: '✏️',
            onClick: () => onEdit(cardSet),
        },
        {
            label: '삭제',
            icon: '🗑️',
            onClick: () => onDelete(cardSet),
            danger: true,
        },
    ];

    return (
        <>
            <div
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 p-6 cursor-pointer relative"
                onClick={() => onStartStudy(cardSet)}
            >
                {/* 컨텍스트 메뉴 트리거 */}
                <div
                    className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={handleContextMenu}
                >
                    <span className="text-lg">⋮</span>
                </div>

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