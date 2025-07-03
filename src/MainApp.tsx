import Header from './components/Layout/Header';
import AppRouter from './components/AppRouter';
import { useAppState } from './hooks/useAppState';
import { useStudyActions } from './hooks/useStudyActions';

function MainApp() {
    // 커스텀 훅으로 상태 관리 분리
    const { cardSets, isLoading, currentTab, setCurrentTab, refreshCardSets } = useAppState();

    // 학습 관련 액션들
    const { handleStartStudy } = useStudyActions();

    // 카드 추가 완료 시 홈탭으로 이동 및 새로고침
    const handleCardAdded = () => {
        refreshCardSets(); // 데이터 새로고침
        setCurrentTab('home'); // 홈 탭으로 이동
    };

    // 로딩 중일 때
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <div className="text-xl text-gray-600">로딩 중...</div>
                </div>
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
                    onCardAdded={handleCardAdded} // 새로 추가
                />
            </main>
        </div>
    );
}

export default MainApp;