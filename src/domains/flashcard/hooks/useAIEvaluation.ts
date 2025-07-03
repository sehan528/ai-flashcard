import React, { useState, useCallback } from 'react';

// API 응답 타입
interface AIEvaluationResponse {
    score: number;
    feedback: string;
    improvements?: string[];
    source: 'ai' | 'fallback';
    remaining: number;
    error?: string;
}

// Hook 상태 타입
interface AIEvaluationState {
    isLoading: boolean;
    isError: boolean;
    result: AIEvaluationResponse | null;
    errorMessage: string | null;
}

// Hook 리턴 타입
interface UseAIEvaluationReturn extends AIEvaluationState {
    evaluateAnswer: (question: string, userAnswer: string, correctAnswer: string) => Promise<void>;
    reset: () => void;
    remainingUsage: number;
}

// AI 사용량 추적을 위한 localStorage 키
const AI_USAGE_KEY = 'ai-flashcard-usage';

// 사용량 데이터 타입
interface AIUsageData {
    dailyCount: number;
    lastResetDate: string;
    dailyLimit: number;
}

// 오늘 날짜 문자열 생성
const getTodayString = (): string => {
    return new Date().toDateString();
};

// AI 사용량 관리 유틸리티
const AIUsageManager = {
    // 현재 사용량 가져오기
    getCurrentUsage(): AIUsageData {
        try {
            const stored = localStorage.getItem(AI_USAGE_KEY);
            if (!stored) {
                return { dailyCount: 0, lastResetDate: getTodayString(), dailyLimit: 50 };
            }

            const usage: AIUsageData = JSON.parse(stored);

            // 날짜가 바뀌었으면 리셋
            if (usage.lastResetDate !== getTodayString()) {
                const resetUsage = { dailyCount: 0, lastResetDate: getTodayString(), dailyLimit: 50 };
                this.saveUsage(resetUsage);
                return resetUsage;
            }

            return usage;
        } catch {
            return { dailyCount: 0, lastResetDate: getTodayString(), dailyLimit: 50 };
        }
    },

    // 사용량 증가
    incrementUsage(): AIUsageData {
        const current = this.getCurrentUsage();
        const updated = { ...current, dailyCount: current.dailyCount + 1 };
        this.saveUsage(updated);
        return updated;
    },

    // 사용량 저장
    saveUsage(usage: AIUsageData): void {
        try {
            localStorage.setItem(AI_USAGE_KEY, JSON.stringify(usage));
        } catch (error) {
            console.error('Failed to save AI usage data:', error);
        }
    },

    // 서버 응답으로 사용량 동기화
    syncWithServer(serverRemaining: number): void {
        const current = this.getCurrentUsage();
        const serverUsed = current.dailyLimit - serverRemaining;

        if (serverUsed !== current.dailyCount) {
            const synced = { ...current, dailyCount: serverUsed };
            this.saveUsage(synced);
        }
    }
};

export const useAIEvaluation = (): UseAIEvaluationReturn => {
    const [state, setState] = useState<AIEvaluationState>({
        isLoading: false,
        isError: false,
        result: null,
        errorMessage: null,
    });

    // 현재 잔여 사용량 계산
    const currentUsage = AIUsageManager.getCurrentUsage();
    const remainingUsage = Math.max(0, currentUsage.dailyLimit - currentUsage.dailyCount);

    // API 호출 함수
    const evaluateAnswer = useCallback(async (
        question: string,
        userAnswer: string,
        correctAnswer: string
    ): Promise<void> => {
        // 로컬 사용량 체크
        const usage = AIUsageManager.getCurrentUsage();
        if (usage.dailyCount >= usage.dailyLimit) {
            setState({
                isLoading: false,
                isError: true,
                result: null,
                errorMessage: '일일 AI 사용 한도(50회)에 도달했습니다. 내일 다시 시도해주세요.',
            });
            return;
        }

        // 입력 검증
        if (!userAnswer.trim() || userAnswer.trim().length < 5) {
            setState({
                isLoading: false,
                isError: true,
                result: null,
                errorMessage: '답변을 5자 이상 입력해주세요.',
            });
            return;
        }

        setState(prev => ({
            ...prev,
            isLoading: true,
            isError: false,
            errorMessage: null,
        }));

        try {
            const response = await fetch('/api/ai-evaluate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: question.trim(),
                    userAnswer: userAnswer.trim(),
                    correctAnswer: correctAnswer.trim(),
                }),
            });

            const data: AIEvaluationResponse = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `API Error: ${response.status}`);
            }

            // 성공 시 로컬 사용량 증가
            AIUsageManager.incrementUsage();

            // 서버와 사용량 동기화
            if (typeof data.remaining === 'number') {
                AIUsageManager.syncWithServer(data.remaining);
            }

            setState({
                isLoading: false,
                isError: false,
                result: data,
                errorMessage: null,
            });

        } catch (error) {
            console.error('AI evaluation error:', error);

            // 네트워크 오류인지 확인
            const isNetworkError = error instanceof TypeError && error.message.includes('fetch');
            const errorMessage = isNetworkError
                ? '네트워크 연결을 확인해주세요.'
                : error instanceof Error
                    ? error.message
                    : 'AI 평가 중 오류가 발생했습니다.';

            setState({
                isLoading: false,
                isError: true,
                result: null,
                errorMessage,
            });
        }
    }, []);

    // 상태 초기화
    const reset = useCallback(() => {
        setState({
            isLoading: false,
            isError: false,
            result: null,
            errorMessage: null,
        });
    }, []);

    return {
        ...state,
        evaluateAnswer,
        reset,
        remainingUsage,
    };
};

// AI 사용량 정보만 가져오는 유틸리티 Hook
export const useAIUsage = () => {
    const [usage, setUsage] = useState<AIUsageData>(AIUsageManager.getCurrentUsage());

    const refreshUsage = useCallback(() => {
        setUsage(AIUsageManager.getCurrentUsage());
    }, []);

    // 컴포넌트 마운트 시와 주기적으로 사용량 갱신
    React.useEffect(() => {
        refreshUsage();

        // 1분마다 사용량 체크 (날짜 변경 감지)
        const interval = setInterval(refreshUsage, 60000);

        return () => clearInterval(interval);
    }, [refreshUsage]);

    return {
        ...usage,
        remainingCount: Math.max(0, usage.dailyLimit - usage.dailyCount),
        refreshUsage,
    };
};