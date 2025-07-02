import type { CardSet } from '../domains/flashcard/dtos/FlashCard';

export const useStudyActions = () => {

    // 학습 시작 핸들러
    const handleStartStudy = (cardSet: CardSet, isRandom: boolean) => {
        console.log(`학습 시작: ${cardSet.name}, 랜덤 모드: ${isRandom ? 'ON' : 'OFF'}`);
        // TODO: 학습 모드로 전환
        // 향후 여기에 실제 학습 모드 로직 추가
    };

    return {
        handleStartStudy,
    };
};