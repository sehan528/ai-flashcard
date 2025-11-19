import { create } from 'zustand';
import type { CardSet, FlashCard, StudyHistory, DailyStats } from '../domains/flashcard/dtos/FlashCard';
import { FlashcardStorage } from '../domains/flashcard/utils/storage';

// Toast 메시지 타입
export interface ToastMessage {
    type: 'success' | 'error' | 'info';
    text: string;
}

// Import 결과 타입
interface ImportResult {
    success: boolean;
    totalImported?: number;
    totalCards?: number;
    categories?: string[];
    importedCount?: number;
    importedRecords?: number;
    errors?: Array<{ file: string; error: string }>;
    error?: string;
}

// 통계 타입
interface Statistics {
    totalCardSets: number;
    totalCards: number;
    totalStudyCount: number;
}

interface FlashcardStore {
    // ========== 상태 ==========
    cardSets: CardSet[];
    statistics: Statistics;
    isLoading: boolean;

    // Toast 상태
    toast: ToastMessage | null;
    isToastExiting: boolean;

    // ========== 초기화 ==========
    initialize: () => void;

    // ========== 카드셋 액션 ==========
    loadCardSets: () => void;
    addCardSet: (cardSet: CardSet) => void;
    updateCardSet: (id: string, updates: Partial<CardSet>) => void;
    deleteCardSet: (id: string) => void;
    duplicateCardSet: (cardSet: CardSet) => void;
    importMultipleFiles: (files: FileList) => Promise<ImportResult>;
    clearAllData: () => void;
    createSampleData: () => void;
    createInterviewTestData: () => Promise<ImportResult>;

    // ========== 카드 액션 ==========
    addCard: (cardSetId: string, card: FlashCard) => void;
    updateCard: (cardSetId: string, cardId: string, updates: Partial<FlashCard>) => void;
    deleteCard: (cardSetId: string, cardId: string) => void;

    // ========== 통계 액션 ==========
    loadStatistics: () => void;
    clearStudyHistory: () => void;
    importStudyHistory: (file: File) => Promise<ImportResult>;
    getStudyHistory: () => StudyHistory;
    getStudyStreak: () => number;
    getRecentStudyStats: (days: number) => DailyStats[];

    // ========== Toast 액션 ==========
    showToast: (type: ToastMessage['type'], text: string, duration?: number) => void;
    hideToast: () => void;
}

export const useFlashcardStore = create<FlashcardStore>((set, get) => ({
    // ========== 초기 상태 ==========
    cardSets: [],
    statistics: {
        totalCardSets: 0,
        totalCards: 0,
        totalStudyCount: 0,
    },
    isLoading: true,
    toast: null,
    isToastExiting: false,

    // ========== 초기화 ==========
    initialize: () => {
        const cardSets = FlashcardStorage.getCardSets();
        const statistics = FlashcardStorage.getStatistics();

        set({
            cardSets,
            statistics,
            isLoading: false,
        });
    },

    // ========== 카드셋 액션 ==========
    loadCardSets: () => {
        const cardSets = FlashcardStorage.getCardSets();
        const statistics = FlashcardStorage.getStatistics();

        set({ cardSets, statistics });
    },

    addCardSet: (cardSet: CardSet) => {
        FlashcardStorage.addCardSet(cardSet);
        get().loadCardSets();
    },

    updateCardSet: (id: string, updates: Partial<CardSet>) => {
        const cardSets = FlashcardStorage.getCardSets();
        const updatedSets = cardSets.map(set =>
            set.id === id ? { ...set, ...updates } : set
        );

        FlashcardStorage.saveCardSets(updatedSets);
        get().loadCardSets();
    },

    deleteCardSet: (id: string) => {
        const cardSets = FlashcardStorage.getCardSets();
        const filteredSets = cardSets.filter(set => set.id !== id);

        FlashcardStorage.saveCardSets(filteredSets);
        FlashcardStorage.removeStudyRecordsByCardSetId(id);
        get().loadCardSets();
    },

    duplicateCardSet: (cardSet: CardSet) => {
        const duplicatedSet: CardSet = {
            ...cardSet,
            id: FlashcardStorage.generateId(),
            name: `${cardSet.name} (복사본)`,
            createdAt: new Date(),
            cards: cardSet.cards.map(card => ({
                ...card,
                id: FlashcardStorage.generateId(),
                createdAt: new Date(),
                studyCount: 0,
            }))
        };

        FlashcardStorage.addCardSet(duplicatedSet);
        get().loadCardSets();
    },

    importMultipleFiles: async (files: FileList) => {
        const result = await FlashcardStorage.importMultipleFiles(files);
        get().loadCardSets();
        return result;
    },

    clearAllData: () => {
        FlashcardStorage.clearAllData();
        get().loadCardSets();
    },

    createSampleData: () => {
        FlashcardStorage.createSampleData();
        get().loadCardSets();
    },

    createInterviewTestData: async () => {
        const result = await FlashcardStorage.createInterviewTestData();
        get().loadCardSets();
        return result;
    },

    // ========== 카드 액션 ==========
    addCard: (cardSetId: string, card: FlashCard) => {
        FlashcardStorage.addCardToSet(cardSetId, card);
        get().loadCardSets();
    },

    updateCard: (cardSetId: string, cardId: string, updates: Partial<FlashCard>) => {
        const cardSets = FlashcardStorage.getCardSets();
        const updatedSets = cardSets.map(set => {
            if (set.id === cardSetId) {
                return {
                    ...set,
                    cards: set.cards.map(card =>
                        card.id === cardId ? { ...card, ...updates } : card
                    )
                };
            }
            return set;
        });

        FlashcardStorage.saveCardSets(updatedSets);
        get().loadCardSets();
    },

    deleteCard: (cardSetId: string, cardId: string) => {
        const cardSets = FlashcardStorage.getCardSets();
        const updatedSets = cardSets.map(set => {
            if (set.id === cardSetId) {
                return {
                    ...set,
                    cards: set.cards.filter(card => card.id !== cardId)
                };
            }
            return set;
        });

        FlashcardStorage.saveCardSets(updatedSets);
        FlashcardStorage.removeStudyRecordsByCardId(cardId);
        get().loadCardSets();
    },

    // ========== 통계 액션 ==========
    loadStatistics: () => {
        const statistics = FlashcardStorage.getStatistics();
        set({ statistics });
    },

    clearStudyHistory: () => {
        FlashcardStorage.clearStudyHistory();
        get().loadStatistics();
    },

    importStudyHistory: async (file: File) => {
        const result = await FlashcardStorage.importStudyHistoryFromFile(file);
        get().loadStatistics();
        return result;
    },

    getStudyHistory: () => {
        return FlashcardStorage.getStudyHistory();
    },

    getStudyStreak: () => {
        return FlashcardStorage.getStudyStreak();
    },

    getRecentStudyStats: (days: number) => {
        return FlashcardStorage.getRecentStudyStats(days);
    },

    // ========== Toast 액션 ==========
    showToast: (type: ToastMessage['type'], text: string, duration = 3000) => {
        set({ toast: { type, text }, isToastExiting: false });

        // duration 후에 fade-out 애니메이션 시작
        setTimeout(() => {
            set({ isToastExiting: true });

            // fade-out 애니메이션 완료 후 메시지 제거 (300ms)
            setTimeout(() => {
                set({ toast: null, isToastExiting: false });
            }, 300);
        }, duration);
    },

    hideToast: () => {
        set({ toast: null, isToastExiting: false });
    },
}));
