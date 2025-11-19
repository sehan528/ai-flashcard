import { useState, useEffect } from 'react';
import Header from './components/Layout/Header';
import AppRouter from './components/AppRouter';
import StudyMode from './pages/StudyMode';
import Toast from './components/UI/Toast';
import { useStudyActions } from './hooks/useStudyActions';
import { useFlashcardStore } from './stores/flashcardStore';
import type { AppTab } from './components/Layout/Header';

function MainApp() {
    // Zustand store
    const { isLoading, initialize } = useFlashcardStore();

    // 로컬 UI 상태 (네비게이션 관련)
    const [currentTab, setCurrentTab] = useState<AppTab>('home');
    const [selectedCardSetId, setSelectedCardSetId] = useState<string | null>(null);

    // Zustand store 초기화
    useEffect(() => {
        initialize();
    }, [initialize]);

    // 학습 관련 액션들
    const {
        isStudying,
        currentCardSet,
        isRandomMode,
        handleStartStudy,
        handleExitStudy
    } = useStudyActions();

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
            <>
                <StudyMode
                    cardSet={currentCardSet}
                    isRandom={isRandomMode}
                    onExit={handleStudyExit}
                />
                <Toast />
            </>
        );
    }

    // 일반 모드일 때
    return (
        <>
            <div className="min-h-screen bg-gray-50">
                <Header
                    currentTab={currentTab}
                    onTabChange={setCurrentTab}
                />

                <main className="container mx-auto px-4 py-8 max-w-none lg:max-w-[1400px] xl:max-w-[1600px]">
                    <AppRouter
                        currentTab={currentTab}
                        selectedCardSetId={selectedCardSetId}
                        onRefresh={() => {}} // Statistics에서 사용 (나중에 Statistics 전환 시 제거 예정)
                        onStartStudy={handleStartStudy}
                        onCardChanged={() => {}} // CardEdit에서 사용 (현재는 불필요)
                        onEditCardSet={(cardSetId: string) => {
                            setSelectedCardSetId(cardSetId);
                            setCurrentTab('card-edit');
                        }}
                    />
                </main>
            </div>
            <Toast />
        </>
    );
}

export default MainApp;