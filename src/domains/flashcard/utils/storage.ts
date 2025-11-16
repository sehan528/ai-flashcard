import type {CardSet, FlashCard} from '../dtos/FlashCard';

const STORAGE_KEY = 'ai-flashcard-sets';

export class FlashcardStorage {

    // 모든 카드셋 가져오기
    static getCardSets(): CardSet[] {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (!data) return [];

            const parsed = JSON.parse(data);
            // Date 객체 복원
            return parsed.map((set: any) => ({
                ...set,
                createdAt: new Date(set.createdAt),
                lastStudied: set.lastStudied ? new Date(set.lastStudied) : undefined,
                cards: set.cards.map((card: any) => ({
                    ...card,
                    createdAt: new Date(card.createdAt)
                }))
            }));
        } catch (error) {
            console.error('카드셋 로드 실패:', error);
            return [];
        }
    }

    // 모든 카드셋 저장하기
    static saveCardSets(cardSets: CardSet[]): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cardSets));
        } catch (error) {
            console.error('카드셋 저장 실패:', error);
            throw new Error('저장에 실패했습니다.');
        }
    }

    // 새 카드셋 추가
    static addCardSet(cardSet: CardSet): void {
        const cardSets = this.getCardSets();
        cardSets.push(cardSet);
        this.saveCardSets(cardSets);
    }

    // 카드셋에 카드 추가
    static addCardToSet(cardSetId: string, card: FlashCard): void {
        const cardSets = this.getCardSets();
        const setIndex = cardSets.findIndex(set => set.id === cardSetId);

        if (setIndex === -1) {
            throw new Error('카드셋을 찾을 수 없습니다.');
        }

        cardSets[setIndex].cards.push(card);
        this.saveCardSets(cardSets);
    }

    // 고유 ID 생성
    static generateId(): string {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // 개발용: 샘플 데이터 생성
    static createSampleData(): void {
        const sampleCardSet: CardSet = {
            id: this.generateId(),
            name: "JavaScript 기초",
            description: "JavaScript 기본 개념들",
            createdAt: new Date(),
            cards: [
                {
                    id: this.generateId(),
                    question: "호이스팅이란 무엇인가요?",
                    answer: "변수와 함수 선언이 스코프 최상단으로 끌어올려지는 JavaScript의 특성",
                    type: "essay",
                    tags: ["JavaScript", "호이스팅"],
                    createdAt: new Date(),
                    studyCount: 0
                },
                {
                    id: this.generateId(),
                    question: "다음 중 falsy 값이 아닌 것은?",
                    answer: ["0", "''", "[]", "null"],
                    type: "multiple",
                    correctIndex: 2, // "[]"가 정답
                    tags: ["JavaScript", "타입"],
                    createdAt: new Date(),
                    studyCount: 0
                }
            ]
        };

        this.addCardSet(sampleCardSet);
        console.log('샘플 데이터 생성 완료!');
    }

    // Export: JSON 파일로 데이터 내보내기
    static exportToJSON(): string {
        const cardSets = this.getCardSets();
        return JSON.stringify(cardSets, null, 2);
    }

    // Export: JSON 파일 다운로드 (전체)
    static downloadAsJSON(): void {
        const jsonString = this.exportToJSON();
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        link.download = `flashcard-export-${timestamp}.json`;
        link.href = url;
        link.click();

        URL.revokeObjectURL(url);
    }

    // Export: 선택한 카드셋들을 각각 개별 JSON 파일로 다운로드
    static downloadSelectedCardSets(cardSetIds: string[]): void {
        const allCardSets = this.getCardSets();

        cardSetIds.forEach(id => {
            const cardSet = allCardSets.find(set => set.id === id);
            if (!cardSet) return;

            const jsonString = JSON.stringify(cardSet, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');

            // 파일명: 카드셋 이름 + 타임스탬프
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
            const safeName = cardSet.name.replace(/[^a-zA-Z0-9가-힣\s]/g, '').replace(/\s+/g, '-');
            link.download = `${safeName}-${timestamp}.json`;
            link.href = url;
            link.click();

            URL.revokeObjectURL(url);
        });
    }

    // Import: 단일 카드셋 유효성 검증
    static validateCardSet(set: any): { valid: boolean; error?: string } {
        if (!set.id || !set.name || !Array.isArray(set.cards)) {
            return { valid: false, error: '카드셋 데이터 구조가 올바르지 않습니다.' };
        }

        for (const card of set.cards) {
            if (!card.id || !card.question || !card.answer || !card.type) {
                return { valid: false, error: '카드 데이터 구조가 올바르지 않습니다.' };
            }

            if (card.type !== 'essay' && card.type !== 'multiple') {
                return { valid: false, error: '카드 타입은 "essay" 또는 "multiple"이어야 합니다.' };
            }

            if (card.type === 'multiple' && (!Array.isArray(card.answer) || card.correctIndex === undefined)) {
                return { valid: false, error: '객관식 카드는 배열 형태의 답변과 정답 인덱스가 필요합니다.' };
            }
        }

        return { valid: true };
    }

    // Import: JSON 데이터 유효성 검증 (배열 또는 단일 객체)
    static validateImportData(data: any): { valid: boolean; error?: string } {
        // 단일 카드셋 객체인 경우
        if (!Array.isArray(data)) {
            return this.validateCardSet(data);
        }

        // 카드셋 배열인 경우
        for (const set of data) {
            const validation = this.validateCardSet(set);
            if (!validation.valid) {
                return validation;
            }
        }

        return { valid: true };
    }

    // Import: JSON 문자열에서 데이터 가져오기 (배열 또는 단일 객체 지원)
    static importFromJSON(jsonString: string, mergeMode: 'merge' | 'replace' = 'merge'): {
        success: boolean;
        error?: string;
        importedCount?: number;
    } {
        try {
            const data = JSON.parse(jsonString);

            // 유효성 검증
            const validation = this.validateImportData(data);
            if (!validation.valid) {
                return { success: false, error: validation.error };
            }

            // 단일 카드셋을 배열로 변환
            const dataArray = Array.isArray(data) ? data : [data];

            // Date 객체 복원
            const importedCardSets: CardSet[] = dataArray.map((set: any) => ({
                ...set,
                createdAt: new Date(set.createdAt),
                lastStudied: set.lastStudied ? new Date(set.lastStudied) : undefined,
                cards: set.cards.map((card: any) => ({
                    ...card,
                    createdAt: new Date(card.createdAt)
                }))
            }));

            if (mergeMode === 'replace') {
                // 기존 데이터 덮어쓰기
                this.saveCardSets(importedCardSets);
            } else {
                // 기존 데이터와 병합 (중복 ID 제거)
                const existingCardSets = this.getCardSets();
                const existingIds = new Set(existingCardSets.map(set => set.id));

                const newCardSets = importedCardSets.filter(set => !existingIds.has(set.id));
                const mergedCardSets = [...existingCardSets, ...newCardSets];

                this.saveCardSets(mergedCardSets);
            }

            return {
                success: true,
                importedCount: mergeMode === 'replace' ? importedCardSets.length : importedCardSets.filter(set => !this.getCardSets().map(s => s.id).includes(set.id)).length
            };
        } catch (error) {
            console.error('Import 실패:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'JSON 파싱에 실패했습니다.'
            };
        }
    }

    // Import: 여러 JSON 파일을 동시에 가져오기
    static async importMultipleFiles(files: FileList): Promise<{
        success: boolean;
        totalImported: number;
        errors: string[];
    }> {
        let totalImported = 0;
        const errors: string[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            try {
                const content = await file.text();
                const result = this.importFromJSON(content, 'merge');

                if (result.success) {
                    totalImported += result.importedCount || 0;
                } else {
                    errors.push(`${file.name}: ${result.error}`);
                }
            } catch (error) {
                errors.push(`${file.name}: 파일 읽기 실패`);
            }
        }

        return {
            success: errors.length === 0,
            totalImported,
            errors
        };
    }

    // 모든 데이터 삭제
    static clearAllData(): void {
        localStorage.removeItem(STORAGE_KEY);
    }

    // 데이터 통계 정보
    static getStatistics(): {
        totalCardSets: number;
        totalCards: number;
        totalStudyCount: number;
    } {
        const cardSets = this.getCardSets();
        const totalCards = cardSets.reduce((sum, set) => sum + set.cards.length, 0);
        const totalStudyCount = cardSets.reduce((sum, set) =>
            sum + set.cards.reduce((cardSum, card) => cardSum + (card.studyCount || 0), 0), 0
        );

        return {
            totalCardSets: cardSets.length,
            totalCards,
            totalStudyCount
        };
    }
}