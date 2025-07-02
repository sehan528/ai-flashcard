import { useState, useEffect } from 'react';
import type { CardSet } from '../domains/flashcard/dtos/FlashCard';
import { FlashcardStorage } from '../domains/flashcard/utils/storage';
import type { AppTab } from '../components/Layout/Header';

export const useAppState = () => {
    const [cardSets, setCardSets] = useState<CardSet[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentTab, setCurrentTab] = useState<AppTab>('home');

    // 데이터 새로고침 함수
    const refreshCardSets = () => {
        const loadedCardSets = FlashcardStorage.getCardSets();
        setCardSets(loadedCardSets);
    };

    // 초기 데이터 로드
    useEffect(() => {
        try {
            const loadedCardSets = FlashcardStorage.getCardSets();
            setCardSets(loadedCardSets);

            // 샘플 데이터가 없으면 생성 (개발용)
            if (loadedCardSets.length === 0) {
                FlashcardStorage.createSampleData();
                refreshCardSets();
            }
        } catch (error) {
            console.error('데이터 로드 실패:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        // 상태
        cardSets,
        isLoading,
        currentTab,

        // 액션
        setCurrentTab,
        refreshCardSets,
    };
};