import type {CardSet, FlashCard} from '../dtos/FlashCard';

const STORAGE_KEY = 'ai-flashcard-sets';
const INIT_FLAG_KEY = 'ai-flashcard-initialized';

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


    // 개발용: 면접 대비 테스트 데이터 생성 (JSON 파일에서 로드)
    // index.json을 읽어서 data/dataset 폴더의 모든 데이터셋을 자동으로 로드
    static async createInterviewTestData(): Promise<{ success: boolean; importedCount: number; totalCards: number; categories: string[] }> {
        try {
            // 이미 초기화되었는지 확인 (중복 실행 방지)
            const isInitialized = localStorage.getItem(INIT_FLAG_KEY);
            if (isInitialized === 'true') {
                console.log('테스트 데이터가 이미 초기화되었습니다.');
                const stats = this.getStatistics();
                return { success: true, importedCount: 0, totalCards: stats.totalCards, categories: [] };
            }

            // ⚠️ 중요: 비동기 함수 진입 시점에 즉시 플래그 설정 (동시 호출 방지)
            localStorage.setItem(INIT_FLAG_KEY, 'true');

            // 기존 카드셋 목록 가져오기
            const existingCardSets = this.getCardSets();
            const existingNames = new Set(existingCardSets.map(set => set.name));

            // index.json에서 데이터셋 목록 읽기 (자동 스캔)
            let testDataFiles: string[] = [];
            let categories: string[] = [];

            try {
                const indexResponse = await fetch('/data/dataset/index.json');
                if (indexResponse.ok) {
                    const indexData = await indexResponse.json();
                    testDataFiles = indexData.datasets.map((ds: any) => ds.path);
                    categories = Object.keys(indexData.categories);
                    console.log(`📚 Found ${testDataFiles.length} datasets across ${categories.length} categories`);
                    console.log(`Categories: ${categories.join(', ')}`);
                } else {
                    console.warn('index.json not found. Please run: npm run generate:index');
                    localStorage.removeItem(INIT_FLAG_KEY);
                    return { success: false, importedCount: 0, totalCards: 0, categories: [] };
                }
            } catch (error) {
                console.error('Failed to load dataset index:', error);
                localStorage.removeItem(INIT_FLAG_KEY);
                return { success: false, importedCount: 0, totalCards: 0, categories: [] };
            }

            let importedCount = 0;
            let skippedCount = 0;
            let totalCards = 0;

            // 각 JSON 파일을 불러와서 카드셋 생성
            for (const filePath of testDataFiles) {
                try {
                    const response = await fetch(filePath);
                    if (!response.ok) {
                        console.error(`파일을 불러올 수 없습니다: ${filePath}`);
                        continue;
                    }

                    const testData = await response.json();

                    // 중복 체크: 같은 이름의 카드셋이 이미 있으면 건너뛰기
                    if (existingNames.has(testData.name)) {
                        console.log(`"${testData.name}" 카드셋이 이미 존재하여 건너뜁니다.`);
                        skippedCount++;
                        continue;
                    }

                    // 카드셋 생성
                    const cardSet: CardSet = {
                        id: this.generateId(),
                        name: testData.name,
                        description: testData.description,
                        createdAt: new Date(),
                        cards: testData.cards.map((card: any) => ({
                            id: this.generateId(),
                            question: card.question,
                            answer: card.answer,
                            type: card.type,
                            correctIndex: card.correctIndex,
                            tags: card.tags || [],
                            createdAt: new Date(),
                            studyCount: 0
                        }))
                    };

                    this.addCardSet(cardSet);
                    existingNames.add(testData.name); // 중복 방지를 위해 Set에 추가
                    totalCards += cardSet.cards.length;
                    importedCount++;
                } catch (error) {
                    console.error(`${filePath} 로드 실패:`, error);
                }
            }

            console.log(`데이터셋 불러오기 완료! (생성: ${importedCount}개, 건너뜀: ${skippedCount}개, 총 ${totalCards}개 카드)`);

            // 데이터 생성 실패 시 플래그 제거 (재시도 가능하도록)
            if (importedCount === 0) {
                localStorage.removeItem(INIT_FLAG_KEY);
                console.warn('데이터셋 불러오기 실패: 생성된 카드셋이 없습니다.');
                return { success: false, importedCount: 0, totalCards: 0, categories };
            }

            return { success: true, importedCount, totalCards, categories };
        } catch (error) {
            console.error('데이터셋 불러오기 실패:', error);
            // 에러 발생 시 플래그 제거 (재시도 가능하도록)
            localStorage.removeItem(INIT_FLAG_KEY);
            return { success: false, importedCount: 0, totalCards: 0, categories: [] };
        }
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
        // 기본 타입 체크
        if (typeof set !== 'object' || set === null) {
            return { valid: false, error: '올바른 플래시카드 형식이 아닙니다.' };
        }

        // 필수 필드 존재 여부 및 타입 체크
        if (typeof set.id !== 'string' || !set.id) {
            return { valid: false, error: '카드셋 ID가 올바르지 않습니다.' };
        }

        if (typeof set.name !== 'string' || !set.name) {
            return { valid: false, error: '카드셋 이름이 올바르지 않습니다.' };
        }

        if (!Array.isArray(set.cards)) {
            return { valid: false, error: '카드 목록이 배열 형태가 아닙니다.' };
        }

        // cards 배열이 비어있어도 허용 (빈 카드셋 가능)
        for (const card of set.cards) {
            // 카드 기본 타입 체크
            if (typeof card !== 'object' || card === null) {
                return { valid: false, error: '카드 데이터가 올바르지 않습니다.' };
            }

            // 필수 필드 타입 체크
            if (typeof card.id !== 'string' || !card.id) {
                return { valid: false, error: '카드 ID가 올바르지 않습니다.' };
            }

            if (typeof card.question !== 'string' || !card.question) {
                return { valid: false, error: '질문이 올바르지 않습니다.' };
            }

            if (!card.answer) {
                return { valid: false, error: '답변이 올바르지 않습니다.' };
            }

            if (typeof card.type !== 'string') {
                return { valid: false, error: '카드 타입이 올바르지 않습니다.' };
            }

            // 카드 타입 검증
            if (card.type !== 'essay' && card.type !== 'multiple') {
                return { valid: false, error: '카드 타입은 "essay" 또는 "multiple"이어야 합니다.' };
            }

            // 서술형 카드 검증
            if (card.type === 'essay' && typeof card.answer !== 'string') {
                return { valid: false, error: '서술형 카드의 답변은 문자열이어야 합니다.' };
            }

            // 객관식 카드 검증
            if (card.type === 'multiple') {
                if (!Array.isArray(card.answer)) {
                    return { valid: false, error: '객관식 카드의 답변은 배열이어야 합니다.' };
                }

                if (typeof card.correctIndex !== 'number') {
                    return { valid: false, error: '객관식 카드는 정답 인덱스가 필요합니다.' };
                }

                if (card.correctIndex < 0 || card.correctIndex >= card.answer.length) {
                    return { valid: false, error: '정답 인덱스가 유효하지 않습니다.' };
                }
            }

            // tags 필드 검증 (선택적)
            if (card.tags !== undefined && !Array.isArray(card.tags)) {
                return { valid: false, error: '태그는 배열 형태여야 합니다.' };
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

            // JSON 파일인지 확인
            if (!file.name.toLowerCase().endsWith('.json')) {
                errors.push(`${file.name}: JSON 파일이 아닙니다.`);
                continue;
            }

            try {
                const content = await file.text();

                // JSON 파싱 가능 여부 먼저 확인
                try {
                    JSON.parse(content);
                } catch (parseError) {
                    errors.push(`${file.name}: 올바른 JSON 형식이 아닙니다.`);
                    continue;
                }

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
        localStorage.removeItem(INIT_FLAG_KEY); // 초기화 플래그도 함께 삭제
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