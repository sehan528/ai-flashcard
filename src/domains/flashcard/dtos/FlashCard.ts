// 개별 플래시카드 구조
export interface FlashCard {
    id: string;                    // 고유 식별자
    question: string;              // 질문 내용
    answer: string | string[];     // 답변 (서술형: string, 객관식: string[])
    type: 'essay' | 'multiple';    // 문제 유형
    correctIndex?: number;         // 객관식 정답 인덱스 (0, 1, 2...)
    tags: string[];               // 태그 (예: ["React", "JavaScript"])
    createdAt: Date;              // 생성 날짜
    studyCount: number;           // 학습 횟수
}

// 카드셋 구조 (여러 카드를 묶은 단위)
export interface CardSet {
    id: string;                   // 고유 식별자
    name: string;                 // 카드셋 이름 (예: "React 기초")
    description: string;          // 설명
    cards: FlashCard[];           // 포함된 카드들
    createdAt: Date;              // 생성 날짜
    // lastStudied?: Date;           // 마지막 학습 날짜
}

// AI 평가 결과 구조
export interface AIEvaluation {
    score: number;                // 점수 (0-100)
    feedback: string;             // 피드백 메시지
    improvements?: string[];      // 개선점들
}

// AI 사용량 추적
export interface AIUsage {
    dailyCount: number;           // 오늘 사용 횟수
    dailyLimit: number;           // 일일 제한 (50회)
    lastResetDate: string;        // 마지막 리셋 날짜
}

// 학습 기록 (개별 카드 학습 1회)
export interface StudyRecord {
    id: string;                   // 기록 고유 ID
    cardId: string;               // 학습한 카드 ID
    cardSetId: string;            // 카드가 속한 카드셋 ID
    cardSetName: string;          // 카드셋 이름 (조회 편의성)
    timestamp: Date;              // 학습 시각
    date: string;                 // 날짜 (YYYY-MM-DD 형식, 집계용)
}

// 일별 학습 통계
export interface DailyStats {
    date: string;                 // YYYY-MM-DD
    cardsStudied: number;         // 학습한 카드 수
    sessionsCount: number;        // 학습 세션 수
    cardSetIds: string[];         // 학습한 카드셋 ID들
}

// 학습 기록 전체 (localStorage 저장용)
export interface StudyHistory {
    records: StudyRecord[];       // 모든 학습 기록
    dailyStats: {                 // 날짜별 통계 (빠른 조회용)
        [date: string]: DailyStats;
    };
}