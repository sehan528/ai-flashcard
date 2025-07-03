import Header from './components/Layout/Header';
import AppRouter from './components/AppRouter';
import StudyMode from './pages/StudyMode';
import { useAppState } from './hooks/useAppState';
import { useStudyActions } from './hooks/useStudyActions';

function MainApp() {
    // 커스텀 훅으로 상태 관리 분리
    const { cardSets, isLoading, currentTab, setCurrentTab, refreshCardSets } = useAppState();

    // 학습 관련 액션들
    const {
        isStudying,
        currentCardSet,
        isRandomMode,
        handleStartStudy,
        handleExitStudy
    } = useStudyActions();

    // 카드 변경 완료 시 (카드 추가/수정/삭제 시)
    const handleCardChanged = () => {
        refreshCardSets(); // 데이터 새로고침
        // 카드편집 탭에서는 그대로 유지, 다른 곳에서 호출되면 홈으로 이동
    };

    // 학습 종료 후 홈 탭으로 복귀
    const handleStudyExit = () => {
        handleExitStudy();
        setCurrentTab('home');
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

    // 학습 모드일 때
    if (isStudying && currentCardSet) {
        return (
            <StudyMode
                cardSet={currentCardSet}
                isRandom={isRandomMode}
                onExit={handleStudyExit}
            />
        );
    }

    // 일반 모드일 때
    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                currentTab={currentTab}
                onTabChange={setCurrentTab}
            />

            <main className="container mx-auto px-4 py-8 max-w-none lg:max-w-[1400px] xl:max-w-[1600px]">
                <AppRouter
                    currentTab={currentTab}
                    cardSets={cardSets}
                    onRefresh={refreshCardSets}
                    onStartStudy={handleStartStudy}
                    onCardChanged={handleCardChanged}
                />
            </main>
        </div>
    );
}

export default MainApp;