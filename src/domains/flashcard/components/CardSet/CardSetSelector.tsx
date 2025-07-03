import React, { useState } from 'react';
import type { CardSet } from '../../dtos/FlashCard';


interface CardSetSelectorProps {
    cardSets: CardSet[];
    selectedCardSetId: string | null;
    onSelectCardSet: (cardSetId: string) => void;
    onCreateNewSet: (name: string, description: string) => void;
}

const CardSetSelector = ({
                             cardSets,
                             selectedCardSetId,
                             onSelectCardSet,
                             onCreateNewSet,
                         }: CardSetSelectorProps) => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newSetName, setNewSetName] = useState('');
    const [newSetDescription, setNewSetDescription] = useState('');

    const handleCreateNewSet = (e: React.FormEvent) => {
        e.preventDefault();

        if (newSetName.trim()) {
            onCreateNewSet(newSetName.trim(), newSetDescription.trim());
            setNewSetName('');
            setNewSetDescription('');
            setShowCreateForm(false);
        }
    };

    return (
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
                        <div className="grid gap-2 max-h-60 overflow-y-auto">
                            {cardSets.map((cardSet) => (
                                <button
                                    key={cardSet.id}
                                    type="button"
                                    onClick={() => onSelectCardSet(cardSet.id)}
                                    className={`p-3 text-left border rounded-lg transition-all ${
                                        selectedCardSetId === cardSet.id
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="font-medium">{cardSet.name}</div>
                                    <div className="text-sm opacity-75">
                                        {cardSet.description} • {cardSet.cards.length}개 카드
                                    </div>
                                </button>
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
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
    );
};

export default CardSetSelector;