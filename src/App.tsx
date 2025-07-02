import Header from './components/Layout/Header';
import AppRouter from './components/AppRouter';
import { useAppState } from './hooks/useAppState';
import { useStudyActions } from './hooks/useStudyActions';

function App() {
    // 커스텀 훅으로 상태 관리 분리
    const { cardSets, isLoading, currentTab, setCurrentTab, refreshCardSets } = useAppState();

    // 학습 관련 액션들
    const { handleStartStudy } = useStudyActions();

    // 로딩 중일 때
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl text-gray-600">로딩 중...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                currentTab={currentTab}
                onTabChange={setCurrentTab}
            />

            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <AppRouter
                    currentTab={currentTab}
                    cardSets={cardSets}
                    onRefresh={refreshCardSets}
                    onStartStudy={handleStartStudy}
                />
            </main>
        </div>
    );
}

export default App;