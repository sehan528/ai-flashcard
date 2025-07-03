import { useState } from 'react';
import type { CardSet } from '../domains/flashcard/dtos/FlashCard';

interface StudyState {
    isStudying: boolean;
    currentCardSet: CardSet | null;
    isRandomMode: boolean;
}

export const useStudyActions = () => {
    const [studyState, setStudyState] = useState<StudyState>({
        isStudying: false,
        currentCardSet: null,
        isRandomMode: false,
    });

    // 학습 시작 핸들러
    const handleStartStudy = (cardSet: CardSet, isRandom: boolean) => {
        // 카드가 없는 카드셋 체크
        if (cardSet.cards.length === 0) {
            alert(`"${cardSet.name}" 카드셋에 카드가 없습니다. 먼저 카드를 추가해주세요.`);
            return;
        }

        console.log(`학습 시작: ${cardSet.name}, 랜덤 모드: ${isRandom ? 'ON' : 'OFF'}`);

        setStudyState({
            isStudying: true,
            currentCardSet: cardSet,
            isRandomMode: isRandom,
        });
    };

    // 학습 종료 핸들러
    const handleExitStudy = () => {
        setStudyState({
            isStudying: false,
            currentCardSet: null,
            isRandomMode: false,
        });

        console.log('학습 종료');
    };

    return {
        ...studyState,
        handleStartStudy,
        handleExitStudy,
    };
};