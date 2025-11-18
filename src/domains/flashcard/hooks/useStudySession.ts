import { useState, useEffect } from 'react';
import type { CardSet, FlashCard } from '../dtos/FlashCard.ts';

interface StudySessionState {
    cardSet: CardSet | null;
    currentCardIndex: number;
    currentCard: FlashCard | null;
    isRandomMode: boolean;
    cardOrder: number[];
    totalCards: number;
    progress: number; // 0-100%
}

interface StudySessionActions {
    startSession: (cardSet: CardSet, isRandom: boolean) => void;
    goToNextCard: () => void;
    goToPreviousCard: () => void;
    goToCard: (index: number) => void;
    endSession: () => void;
    shuffleCards: () => void;
}

export const useStudySession = (): StudySessionState & StudySessionActions => {
    const [sessionState, setSessionState] = useState<StudySessionState>({
        cardSet: null,
        currentCardIndex: 0,
        currentCard: null,
        isRandomMode: false,
        cardOrder: [],
        totalCards: 0,
        progress: 0,
    });

    // Fisher-Yates 셔플 알고리즘
    const shuffleArray = (array: number[]): number[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // 카드 순서 생성
    const generateCardOrder = (totalCards: number, isRandom: boolean): number[] => {
        const indices = Array.from({ length: totalCards }, (_, i) => i);
        return isRandom ? shuffleArray(indices) : indices;
    };

    // 현재 카드 업데이트
    useEffect(() => {
        if (sessionState.cardSet && sessionState.cardOrder.length > 0) {
            const actualCardIndex = sessionState.cardOrder[sessionState.currentCardIndex];
            const currentCard = sessionState.cardSet.cards[actualCardIndex] || null;
            const progress = sessionState.totalCards > 0
                ? Math.round(((sessionState.currentCardIndex + 1) / sessionState.totalCards) * 100)
                : 0;

            setSessionState(prev => ({
                ...prev,
                currentCard,
                progress,
            }));
        }
    }, [sessionState.cardSet, sessionState.currentCardIndex, sessionState.cardOrder, sessionState.totalCards]);

    // 세션 시작
    const startSession = (cardSet: CardSet, isRandom: boolean) => {
        if (cardSet.cards.length === 0) {
            console.warn('카드가 없는 카드셋입니다.');
            return;
        }

        const cardOrder = generateCardOrder(cardSet.cards.length, isRandom);

        setSessionState({
            cardSet,
            currentCardIndex: 0,
            currentCard: null, // useEffect에서 설정됨
            isRandomMode: isRandom,
            cardOrder,
            totalCards: cardSet.cards.length,
            progress: 0,
        });
    };

    // 다음 카드로
    const goToNextCard = () => {
        setSessionState(prev => {
            if (prev.currentCardIndex < prev.totalCards - 1) {
                return {
                    ...prev,
                    currentCardIndex: prev.currentCardIndex + 1,
                };
            }
            return prev; // 마지막 카드일 때는 변경 없음
        });
    };

    // 이전 카드로
    const goToPreviousCard = () => {
        setSessionState(prev => {
            if (prev.currentCardIndex > 0) {
                return {
                    ...prev,
                    currentCardIndex: prev.currentCardIndex - 1,
                };
            }
            return prev; // 첫 번째 카드일 때는 변경 없음
        });
    };

    // 특정 카드로 이동
    const goToCard = (index: number) => {
        setSessionState(prev => {
            if (index >= 0 && index < prev.totalCards) {
                return {
                    ...prev,
                    currentCardIndex: index,
                };
            }
            return prev;
        });
    };

    // 세션 종료
    const endSession = () => {
        setSessionState({
            cardSet: null,
            currentCardIndex: 0,
            currentCard: null,
            isRandomMode: false,
            cardOrder: [],
            totalCards: 0,
            progress: 0,
        });
    };

    // 카드 순서 다시 섞기 (남은 카드만 섞음)
    const shuffleCards = () => {
        if (sessionState.cardSet) {
            const currentIndex = sessionState.currentCardIndex;

            // 이미 본 카드들 (현재 카드 포함)
            const viewedCards = sessionState.cardOrder.slice(0, currentIndex + 1);

            // 아직 안 본 카드들
            const remainingCards = sessionState.cardOrder.slice(currentIndex + 1);

            // 남은 카드들만 섞기
            const shuffledRemaining = shuffleArray(remainingCards);

            // 이미 본 카드 + 섞인 남은 카드
            const newOrder = [...viewedCards, ...shuffledRemaining];

            setSessionState(prev => ({
                ...prev,
                cardOrder: newOrder,
                // currentCardIndex는 유지 (현재 위치에서 계속)
                isRandomMode: true,
            }));
        }
    };

    return {
        ...sessionState,
        startSession,
        goToNextCard,
        goToPreviousCard,
        goToCard,
        endSession,
        shuffleCards,
    };
};