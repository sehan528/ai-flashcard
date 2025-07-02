import type { CardSet } from '../../dtos/FlashCard';
import CardSetItem from './CardSetItem';

interface CardSetGridProps {
    cardSets: CardSet[];
    onStartStudy: (cardSet: CardSet) => void;
    onEdit: (cardSet: CardSet) => void;
    onDuplicate: (cardSet: CardSet) => void;
    onDelete: (cardSet: CardSet) => void;
}

const CardSetGrid = ({
                                                    cardSets,
                                                    onStartStudy,
                                                    onEdit,
                                                    onDuplicate,
                                                    onDelete,
                                                } : CardSetGridProps) => {
    if (cardSets.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>

                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    아직 카드셋이 없습니다
                </h3>

                <p className="text-gray-500">
                    첫 번째 플래시카드 세트를 만들어보세요!
                </p>

            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cardSets.map((cardSet) => (
                <CardSetItem
                    key={cardSet.id}
                    cardSet={cardSet}
                    onStartStudy={onStartStudy}
                    onEdit={onEdit}
                    onDuplicate={onDuplicate}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default CardSetGrid;