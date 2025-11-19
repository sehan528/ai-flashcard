import React, { useState, useRef, useEffect } from 'react';
import type { FlashCard } from '../../dtos/FlashCard';
import AnswerTypeSelector, { type AnswerType } from './AnswerTypeSelector';
import MultipleChoiceEditor from './MultipleChoiceEditor';

interface Choice {
    id: string;
    text: string;
}

interface CardFormProps {
    onSubmit: (card: Omit<FlashCard, 'id' | 'createdAt' | 'studyCount'>) => void;
    onCancel?: () => void;
    initialData?: Partial<FlashCard>;
}

const CardForm = ({ onSubmit, onCancel, initialData }: CardFormProps) => {
    // textarea refs
    const questionRef = useRef<HTMLTextAreaElement>(null);
    const essayAnswerRef = useRef<HTMLTextAreaElement>(null);

    // 폼 상태 관리
    const [formData, setFormData] = useState({
        question: initialData?.question || '',
        tags: initialData?.tags?.join(', ') || '',
        answerType: (initialData?.type || 'essay') as AnswerType,
        essayAnswer: typeof initialData?.answer === 'string' ? initialData.answer : '',
        choices: Array.isArray(initialData?.answer)
            ? initialData.answer.map((text, index) => ({
                id: `choice_${index}`,
                text
            }))
            : [
                { id: 'choice_0', text: '' },
                { id: 'choice_1', text: '' },
            ],
        correctIndex: initialData?.correctIndex || 0,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // textarea 자동 높이 조절
    const adjustTextareaHeight = (element: HTMLTextAreaElement | null) => {
        if (element) {
            element.style.height = 'auto';
            element.style.height = Math.max(element.scrollHeight, 60) + 'px';
        }
    };

    // 초기 로드 시 높이 조절
    useEffect(() => {
        adjustTextareaHeight(questionRef.current);
        adjustTextareaHeight(essayAnswerRef.current);
    }, []);

    // question 변경 시 높이 조절
    useEffect(() => {
        adjustTextareaHeight(questionRef.current);
    }, [formData.question]);

    // essayAnswer 변경 시 높이 조절
    useEffect(() => {
        adjustTextareaHeight(essayAnswerRef.current);
    }, [formData.essayAnswer]);

    // 입력 값 변경 핸들러
    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // 에러 클리어
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    // 답변 유형 변경 핸들러
    const handleAnswerTypeChange = (type: AnswerType) => {
        setFormData(prev => ({ ...prev, answerType: type }));
    };

    // 객관식 선택지 변경 핸들러
    const handleChoicesChange = (choices: Choice[]) => {
        setFormData(prev => ({ ...prev, choices }));
    };

    // 정답 인덱스 변경 핸들러
    const handleCorrectIndexChange = (index: number) => {
        setFormData(prev => ({ ...prev, correctIndex: index }));
    };

    // 폼 검증
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // 질문 검증
        if (!formData.question.trim()) {
            newErrors.question = '질문을 입력해주세요.';
        }

        // 답변 검증
        if (formData.answerType === 'essay') {
            if (!formData.essayAnswer.trim()) {
                newErrors.essayAnswer = '정답을 입력해주세요.';
            }
        } else {
            // 객관식 검증
            const validChoices = formData.choices.filter(choice => choice.text.trim());
            if (validChoices.length < 2) {
                newErrors.choices = '최소 2개의 선택지를 입력해주세요.';
            }
            if (formData.correctIndex >= validChoices.length) {
                newErrors.correctIndex = '정답을 선택해주세요.';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 폼 제출 핸들러
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // 태그 처리
        const tags = formData.tags
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

        // 카드 데이터 생성
        const cardData: Omit<FlashCard, 'id' | 'createdAt' | 'studyCount'> = {
            question: formData.question.trim(),
            answer: formData.answerType === 'essay'
                ? formData.essayAnswer.trim()
                : formData.choices
                    .filter(choice => choice.text.trim())
                    .map(choice => choice.text.trim()),
            type: formData.answerType,
            correctIndex: formData.answerType === 'multiple' ? formData.correctIndex : undefined,
            tags,
        };

        onSubmit(cardData);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    새 플래시카드 추가
                </h2>
                <p className="text-gray-600">
                    새로운 카드를 만들어 학습 컬렉션을 확장하세요
                </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                {/* 태그 입력 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        태그
                    </label>
                    <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => handleInputChange('tags', e.target.value)}
                        placeholder="예: JavaScript, React, Spring Boot (쉼표로 구분)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* 질문 입력 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        질문 *
                    </label>
                    <textarea
                        ref={questionRef}
                        value={formData.question}
                        onChange={(e) => handleInputChange('question', e.target.value)}
                        placeholder="학습하고 싶은 질문을 입력하세요..."
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none overflow-hidden ${
                            errors.question ? 'border-red-500' : 'border-gray-300'
                        }`}
                        style={{ minHeight: '60px' }}
                    />
                    {errors.question && (
                        <p className="mt-1 text-sm text-red-600">{errors.question}</p>
                    )}
                </div>

                {/* 답변 유형 선택 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        답변 유형 *
                    </label>
                    <AnswerTypeSelector
                        selectedType={formData.answerType}
                        onTypeChange={handleAnswerTypeChange}
                    />
                </div>

                {/* 서술형 답변 */}
                {formData.answerType === 'essay' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            정답 *
                        </label>
                        <textarea
                            ref={essayAnswerRef}
                            value={formData.essayAnswer}
                            onChange={(e) => handleInputChange('essayAnswer', e.target.value)}
                            placeholder="정확한 답변을 입력하세요..."
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none overflow-hidden ${
                                errors.essayAnswer ? 'border-red-500' : 'border-gray-300'
                            }`}
                            style={{ minHeight: '100px' }}
                        />
                        {errors.essayAnswer && (
                            <p className="mt-1 text-sm text-red-600">{errors.essayAnswer}</p>
                        )}
                    </div>
                )}

                {/* 객관식 선택지 */}
                {formData.answerType === 'multiple' && (
                    <div>
                        <MultipleChoiceEditor
                            choices={formData.choices}
                            correctIndex={formData.correctIndex}
                            onChoicesChange={handleChoicesChange}
                            onCorrectIndexChange={handleCorrectIndexChange}
                        />
                        {errors.choices && (
                            <p className="mt-1 text-sm text-red-600">{errors.choices}</p>
                        )}
                        {errors.correctIndex && (
                            <p className="mt-1 text-sm text-red-600">{errors.correctIndex}</p>
                        )}
                    </div>
                )}

                {/* 버튼들 */}
                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                        카드 저장하기
                    </button>

                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                        >
                            취소
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default CardForm;