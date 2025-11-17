import { useState, useEffect } from 'react';
import type { CardSet } from '../domains/flashcard/dtos/FlashCard';
import { FlashcardStorage } from '../domains/flashcard/utils/storage';
import type { AppTab } from '../components/Layout/Header';

export const useAppState = () => {
    const [cardSets, setCardSets] = useState<CardSet[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentTab, setCurrentTab] = useState<AppTab>('home');
    const [selectedCardSetId, setSelectedCardSetId] = useState<string | null>(null);

    // 데이터 새로고침 함수
    const refreshCardSets = () => {
        const loadedCardSets = FlashcardStorage.getCardSets();
        setCardSets(loadedCardSets);
    };

    // 초기 데이터 로드
    useEffect(() => {
        const initializeData = async () => {
            try {
                const loadedCardSets = FlashcardStorage.getCardSets();
                setCardSets(loadedCardSets);

                // 데이터가 없으면 자동으로 테스트 데이터 생성
                if (loadedCardSets.length === 0) {
                    console.log('초기 데이터가 없습니다. 테스트 데이터를 생성합니다...');
                    await FlashcardStorage.createInterviewTestData();
                    // 데이터 다시 로드
                    const updatedCardSets = FlashcardStorage.getCardSets();
                    setCardSets(updatedCardSets);
                }
            } catch (error) {
                console.error('데이터 로드 실패:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeData();
    }, []);

    return {
        // 상태
        cardSets,
        isLoading,
        currentTab,
        selectedCardSetId,

        // 액션
        setCurrentTab,
        setSelectedCardSetId,
        refreshCardSets,
    };
};