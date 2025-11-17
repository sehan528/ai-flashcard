import { useState, useEffect, useRef } from 'react';
import type { CardSet } from '../domains/flashcard/dtos/FlashCard';
import { FlashcardStorage } from '../domains/flashcard/utils/storage';
import type { AppTab } from '../components/Layout/Header';

export const useAppState = () => {
    const [cardSets, setCardSets] = useState<CardSet[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentTab, setCurrentTab] = useState<AppTab>('home');
    const [selectedCardSetId, setSelectedCardSetId] = useState<string | null>(null);
    const isInitializedRef = useRef(false); // 초기화 완료 플래그

    // 데이터 새로고침 함수
    const refreshCardSets = () => {
        const loadedCardSets = FlashcardStorage.getCardSets();
        setCardSets(loadedCardSets);
    };

    // 초기 데이터 로드
    useEffect(() => {
        // 이미 초기화되었으면 건너뛰기 (StrictMode 중복 실행 방지)
        if (isInitializedRef.current) {
            return;
        }

        try {
            const loadedCardSets = FlashcardStorage.getCardSets();
            setCardSets(loadedCardSets);

            // 초기화 완료 표시
            isInitializedRef.current = true;
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
        selectedCardSetId,

        // 액션
        setCurrentTab,
        setSelectedCardSetId,
        refreshCardSets,
    };
};