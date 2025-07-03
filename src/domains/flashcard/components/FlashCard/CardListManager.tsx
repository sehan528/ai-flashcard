import { useState } from 'react';
import type { FlashCard, CardSet } from '../../dtos/FlashCard';

interface CardListManagerProps {
    cardSet: CardSet;
    onEditCard: (card: FlashCard) => void;
    onDeleteCard: (cardId: string) => void;
    onAddNewCard: () => void;
}

const CardListManager = ({ cardSet, onEditCard, onDeleteCard, onAddNewCard }: CardListManagerProps) => {
    const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

    // 카드 확장/축소 토글
    const toggleCardExpansion = (cardId: string) => {
        setExpandedCardId(expandedCardId === cardId ? null : cardId);
    };

    // 카드 삭제 확인
    const handleDeleteCard = (card: FlashCard) => {
        if (confirm(`"${card.question.slice(0, 30)}..." 카드를 삭제하시겠습니까?`)) {
            onDeleteCard(card.id);
        }
    };

    // 답변 미리보기 생성
    const getAnswerPreview = (card: FlashCard): string => {
        if (card.type === 'essay') {
            const answer = typeof card.answer === 'string' ? card.answer : '';
            return answer.length > 50 ? answer.slice(0, 50) + '...' : answer;
        } else {
            const choices = Array.isArray(card.answer) ? card.answer : [];
            const correctAnswer = choices[card.correctIndex || 0] || '';
            return `${choices.length}개 선택지 (정답: ${correctAnswer})`;
        }
    };

    // 카드 타입 아이콘 및 색상
    const getCardTypeInfo = (type: 'essay' | 'multiple') => {
        return type === 'essay'
            ? { icon: '📝', label: '서술형', bgColor: 'bg-blue-50', textColor: 'text-blue-700', borderColor: 'border-blue-200' }
            : { icon: '✅', label: '객관식', bgColor: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-200' };
    };

    return (
        <div className="space-y-4">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                        카드 목록
                    </h3>
                    <p className="text-sm text-gray-600">
                        총 {cardSet.cards.length}개 카드
                    </p>
                </div>

                <button
                    onClick={onAddNewCard}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <span>+</span>
                    새 카드 추가
                </button>
            </div>

            {/* 카드가 없을 때 */}
            {cardSet.cards.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-4xl mb-4">📚</div>
                    <h4 className="text-lg font-medium text-gray-600 mb-2">
                        아직 카드가 없습니다
                    </h4>
                    <p className="text-gray-500 mb-4">
                        첫 번째 플래시카드를 만들어보세요!
                    </p>
                    <button
                        onClick={onAddNewCard}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        카드 추가하기
                    </button>
                </div>
            ) : (
                /* 카드 목록 */
                <div className="space-y-3">
                    {cardSet.cards.map((card, index) => {
                        const typeInfo = getCardTypeInfo(card.type);
                        const isExpanded = expandedCardId === card.id;

                        return (
                            <div
                                key={card.id}
                                className={`border rounded-lg transition-all ${
                                    isExpanded ? typeInfo.borderColor : 'border-gray-200'
                                }`}
                            >
                                {/* 카드 헤더 (항상 표시) */}
                                <div
                                    className={`p-4 cursor-pointer hover:bg-gray-50 ${
                                        isExpanded ? typeInfo.bgColor : ''
                                    }`}
                                    onClick={() => toggleCardExpansion(card.id)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            {/* 카드 타입 및 태그 */}
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${typeInfo.bgColor} ${typeInfo.textColor}`}>
                                                    {typeInfo.icon} {typeInfo.label}
                                                </span>

                                                {card.tags.length > 0 && (
                                                    <div className="flex gap-1">
                                                        {card.tags.slice(0, 2).map((tag, tagIndex) => (
                                                            <span
                                                                key={tagIndex}
                                                                className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                        {card.tags.length > 2 && (
                                                            <span className="text-xs text-gray-500">
                                                                +{card.tags.length - 2}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* 질문 */}
                                            <h4 className="font-medium text-gray-800 mb-1 line-clamp-2">
                                                {index + 1}. {card.question}
                                            </h4>

                                            {/* 답변 미리보기 */}
                                            {!isExpanded && (
                                                <p className="text-sm text-gray-600">
                                                    {getAnswerPreview(card)}
                                                </p>
                                            )}
                                        </div>

                                        {/* 버튼들 */}
                                        <div className="flex items-center gap-2 ml-4">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEditCard(card);
                                                }}
                                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                title="카드 수정"
                                            >
                                                ✏️
                                            </button>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteCard(card);
                                                }}
                                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                title="카드 삭제"
                                            >
                                                🗑️
                                            </button>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleCardExpansion(card.id);
                                                }}
                                                className="p-2 text-gray-400 hover:text-gray-600 rounded transition-colors"
                                                title={isExpanded ? "접기" : "자세히 보기"}
                                            >
                                                {isExpanded ? '▲' : '▼'}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* 카드 상세 정보 (확장 시 표시) */}
                                {isExpanded && (
                                    <div className="px-4 pb-4 border-t border-gray-200">
                                        <div className="pt-3 space-y-3">
                                            {/* 질문 전체 */}
                                            <div>
                                                <h5 className="text-sm font-medium text-gray-700 mb-1">질문:</h5>
                                                <p className="text-gray-800 leading-relaxed">
                                                    {card.question}
                                                </p>
                                            </div>

                                            {/* 답변 상세 */}
                                            <div>
                                                <h5 className="text-sm font-medium text-gray-700 mb-1">
                                                    {card.type === 'essay' ? '정답:' : '선택지:'}
                                                </h5>

                                                {card.type === 'essay' ? (
                                                    <p className="text-gray-800 leading-relaxed bg-gray-50 p-3 rounded">
                                                        {typeof card.answer === 'string' ? card.answer : '답변 오류'}
                                                    </p>
                                                ) : (
                                                    <div className="space-y-2">
                                                        {Array.isArray(card.answer) && card.answer.map((choice, choiceIndex) => (
                                                            <div
                                                                key={choiceIndex}
                                                                className={`p-2 rounded flex items-center gap-2 ${
                                                                    choiceIndex === card.correctIndex
                                                                        ? 'bg-green-50 border border-green-200'
                                                                        : 'bg-gray-50'
                                                                }`}
                                                            >
                                                                <span className="text-sm font-medium text-gray-600">
                                                                    {choiceIndex + 1}.
                                                                </span>
                                                                <span className="flex-1">{choice}</span>
                                                                {choiceIndex === card.correctIndex && (
                                                                    <span className="text-green-600 text-sm font-medium">
                                                                        ✓ 정답
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* 태그 전체 */}
                                            {card.tags.length > 0 && (
                                                <div>
                                                    <h5 className="text-sm font-medium text-gray-700 mb-1">태그:</h5>
                                                    <div className="flex flex-wrap gap-1">
                                                        {card.tags.map((tag, tagIndex) => (
                                                            <span
                                                                key={tagIndex}
                                                                className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* 메타 정보 */}
                                            <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t">
                                                <span>
                                                    생성일: {card.createdAt.toLocaleDateString()}
                                                </span>
                                                <span>
                                                    학습 횟수: {card.studyCount}회
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CardListManager;