import React, { useState } from 'react';
import type { FlashCard } from '../../dtos/FlashCard';

interface MultipleStudyCardProps {
    card: FlashCard;
}

type AnswerState = 'unanswered' | 'answered' | 'revealed';

const MultipleStudyCard = ({ card }: MultipleStudyCardProps) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [answerState, setAnswerState] = useState<AnswerState>('unanswered');

    // 카드가 변경되면 상태 초기화
    React.useEffect(() => {
        setSelectedIndex(null);
        setAnswerState('unanswered');
    }, [card.id]);

    // 답변 선택
    const handleSelectChoice = (index: number) => {
        if (answerState === 'unanswered') {
            setSelectedIndex(index);
        }
    };

    // 정답 확인
    const handleCheckAnswer = () => {
        if (selectedIndex !== null) {
            setAnswerState('answered');
        } else {
            alert('답을 선택해주세요!');
        }
    };

    // 정답 보기
    const handleShowAnswer = () => {
        setAnswerState('revealed');
    };

    // 초기화
    const handleReset = () => {
        setSelectedIndex(null);
        setAnswerState('unanswered');
    };

    // 선택지 스타일 결정
    const getChoiceStyle = (index: number) => {
        const baseStyle = "w-full p-4 text-left border-2 rounded-lg transition-all cursor-pointer";

        if (answerState === 'unanswered') {
            return `${baseStyle} ${
                selectedIndex === index
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
            }`;
        }

        if (answerState === 'answered' || answerState === 'revealed') {
            const isCorrect = index === card.correctIndex;
            const isSelected = index === selectedIndex;

            if (isCorrect && isSelected) {
                // 정답을 맞춘 경우
                return `${baseStyle} border-green-500 bg-green-50 text-green-700`;
            } else if (isCorrect) {
                // 정답이지만 선택하지 않은 경우
                return `${baseStyle} border-orange-400 bg-orange-50 text-orange-700`;
            } else if (isSelected) {
                // 틀린 답을 선택한 경우
                return `${baseStyle} border-red-500 bg-red-50 text-red-700`;
            } else {
                // 선택하지 않은 오답
                return `${baseStyle} border-gray-300 bg-gray-50 text-gray-600`;
            }
        }

        return baseStyle;
    };

    // 선택지 아이콘 결정
    const getChoiceIcon = (index: number) => {
        if (answerState === 'unanswered') {
            return selectedIndex === index ? '🔘' : '⚪';
        }

        if (answerState === 'answered' || answerState === 'revealed') {
            const isCorrect = index === card.correctIndex;
            const isSelected = index === selectedIndex;

            if (isCorrect && isSelected) return '✅'; // 정답 맞춤
            if (isCorrect) return '💡'; // 정답 (선택 안함)
            if (isSelected) return '❌'; // 오답 선택
            return '⚪'; // 일반
        }

        return '⚪';
    };

    const choices = Array.isArray(card.answer) ? card.answer : [];
    const isCorrect = selectedIndex === card.correctIndex;

    // 키보드 단축키 (숫자 키로 선택, Enter로 확인)
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // 입력 필드에 포커스 있으면 무시
            const target = e.target as HTMLElement;
            if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
                return;
            }

            // 숫자 키로 선택 (1-9는 0-8번 인덱스, 0은 9번 인덱스)
            if (answerState === 'unanswered') {
                if (e.key >= '1' && e.key <= '9') {
                    const index = parseInt(e.key) - 1;
                    if (index < choices.length) {
                        e.preventDefault();
                        handleSelectChoice(index);
                    }
                } else if (e.key === '0') {
                    // 0번 키는 10번째 선택지 (인덱스 9)
                    if (choices.length >= 10) {
                        e.preventDefault();
                        handleSelectChoice(9);
                    }
                }
            }

            // Enter로 정답 확인 또는 다시 풀기
            if (e.key === 'Enter') {
                e.preventDefault();
                if (answerState === 'unanswered') {
                    handleCheckAnswer();
                } else if (answerState === 'answered' || answerState === 'revealed') {
                    handleReset();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [answerState, selectedIndex, choices.length]);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 min-h-[400px] flex flex-col">
            {/* 질문 영역 */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded">
                        ✅ 객관식
                    </span>
                    {card.tags.length > 0 && (
                        <div className="flex gap-1">
                            {card.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <h2 className="text-xl font-semibold text-gray-800 leading-relaxed">
                    {card.question}
                </h2>
            </div>

            {/* 선택지 영역 */}
            <div className="flex-1 mb-6 space-y-3">
                {choices.map((choice, index) => (
                    <button
                        key={index}
                        onClick={() => handleSelectChoice(index)}
                        className={getChoiceStyle(index)}
                        disabled={answerState !== 'unanswered'}
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-lg">{getChoiceIcon(index)}</span>
                            <span className="flex-1">
                                <strong>{index + 1}. </strong>
                                {choice}
                            </span>
                        </div>
                    </button>
                ))}
            </div>

            {/* 결과 메시지 */}
            {answerState === 'answered' && (
                <div className={`mb-4 p-3 rounded-lg border ${
                    isCorrect
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                    <div className="flex items-center gap-2">
                        <span className="text-lg">
                            {isCorrect ? '🎉' : '😅'}
                        </span>
                        <span className="font-medium">
                            {isCorrect ? '정답입니다!' : '틀렸습니다.'}
                        </span>
                    </div>
                    {!isCorrect && (
                        <p className="text-sm mt-1">
                            정답: {choices[card.correctIndex || 0]}
                        </p>
                    )}
                </div>
            )}

            {/* 버튼 영역 */}
            <div className="flex flex-wrap gap-3">
                {answerState === 'unanswered' && (
                    <>
                        <button
                            onClick={handleCheckAnswer}
                            disabled={selectedIndex === null}
                            className={`flex-1 min-w-[120px] py-2 px-4 rounded-md font-medium transition-colors ${
                                selectedIndex === null
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                            정답 확인
                        </button>

                        <button
                            onClick={handleShowAnswer}
                            className="flex-1 min-w-[120px] py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            정답 보기
                        </button>
                    </>
                )}

                {(answerState === 'answered' || answerState === 'revealed') && (
                    <button
                        onClick={handleReset}
                        className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        🔄 다시 풀기
                    </button>
                )}
            </div>

            {/* 도움말 */}
            <div className="mt-4 space-y-2">
                <div className="text-xs text-gray-500 text-center">
                    💡 선택지를 클릭하여 답을 선택한 후 정답을 확인해보세요.
                </div>
                <div className="text-xs text-gray-400 text-center border-t border-gray-100 pt-2">
                    ⌨️ 단축키: <strong>1-0</strong> 선택 | <strong>Enter</strong> 정답 확인 | <strong>← →</strong> 이전/다음 카드
                </div>
            </div>
        </div>
    );
};

export default MultipleStudyCard;