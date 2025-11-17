import type { CardSet } from '../domains/flashcard/dtos/FlashCard';
import type { AppTab } from './Layout/Header';
import Home from '../pages/Home';
import CardEdit from '../pages/CardEdit';
import Settings from '../pages/Settings';

interface AppRouterProps {
    currentTab: AppTab;
    cardSets: CardSet[];
    selectedCardSetId: string | null;
    onRefresh: () => void;
    onStartStudy: (cardSet: CardSet, isRandom: boolean) => void;
    onCardChanged: () => void; // 카드 변경 완료 콜백
    onEditCardSet: (cardSetId: string) => void; // 카드셋 수정 콜백
}

const AppRouter = ({
                       currentTab,
                       cardSets,
                       selectedCardSetId,
                       onRefresh,
                       onStartStudy,
                       onCardChanged,
                       onEditCardSet
                   }: AppRouterProps) => {
    switch (currentTab) {
        case 'home':
            return (
                <Home
                    cardSets={cardSets}
                    onRefresh={onRefresh}
                    onStartStudy={onStartStudy}
                    onEditCardSet={onEditCardSet}
                />
            );
        case 'card-edit':
            return (
                <CardEdit
                    initialCardSetId={selectedCardSetId}
                    onCardChanged={onCardChanged} // 카드 변경 완료 콜백 전달
                />
            );
        case 'settings':
            return <Settings />;
        default:
            return (
                <Home
                    cardSets={cardSets}
                    onRefresh={onRefresh}
                    onStartStudy={onStartStudy}
                    onEditCardSet={onEditCardSet}
                />
            );
    }
};

export default AppRouter;