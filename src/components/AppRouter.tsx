import type { CardSet } from '../domains/flashcard/dtos/FlashCard';
import type { AppTab } from './Layout/Header';
import Home from '../pages/Home';
import AddCard from '../pages/AddCard';
import Settings from '../pages/Settings';

interface AppRouterProps {
    currentTab: AppTab;
    cardSets: CardSet[];
    onRefresh: () => void;
    onStartStudy: (cardSet: CardSet, isRandom: boolean) => void;
    onCardAdded: () => void; // 새로 추가
}

const AppRouter = ({
                       currentTab,
                       cardSets,
                       onRefresh,
                       onStartStudy,
                       onCardAdded
                   }: AppRouterProps) => {
    switch (currentTab) {
        case 'home':
            return (
                <Home
                    cardSets={cardSets}
                    onRefresh={onRefresh}
                    onStartStudy={onStartStudy}
                />
            );
        case 'add-card':
            return (
                <AddCard
                    onCardAdded={onCardAdded} // 카드 추가 완료 콜백 전달
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
                />
            );
    }
};

export default AppRouter;