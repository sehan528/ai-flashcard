import React, { useState } from 'react';
import type { CardSet } from '../../dtos/FlashCard';

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
    const [showActions, setShowActions] = useState(false);

    const handleToggleActions = (event: React.MouseEvent) => {
        event.stopPropagation();
        setShowActions(!showActions);
    };

    const handleEdit = (event: React.MouseEvent) => {
        event.stopPropagation();
        onEdit(cardSet);
        setShowActions(false);
    };

    const handleDelete = (event: React.MouseEvent) => {
        event.stopPropagation();
        onDelete(cardSet);
        setShowActions(false);
    };

    return (
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

            {/* 화살표 버튼 (우측 상단) */}
            <button
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
                onClick={handleToggleActions}
                title={showActions ? "액션 숨기기" : "액션 보기"}
            >
                <svg
                    className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${
                        showActions ? 'rotate-180' : ''
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

            {/* 액션 버튼들 (화살표 클릭 시 표시) */}
            {showActions && (
                <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-xl">
                    <div className="flex gap-2 justify-end">
                        <button
                            onClick={handleEdit}
                            className="flex items-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
                            title="수정"
                        >
                            <span>✏️</span>
                            <span>수정</span>
                        </button>
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
                            title="삭제"
                        >
                            <span>🗑️</span>
                            <span>삭제</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CardSetItem;
