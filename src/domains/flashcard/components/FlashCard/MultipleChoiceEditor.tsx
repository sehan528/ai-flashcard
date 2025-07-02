interface Choice {
    id: string;
    text: string;
}

interface MultipleChoiceEditorProps {
    choices: Choice[];
    correctIndex: number;
    onChoicesChange: (choices: Choice[]) => void;
    onCorrectIndexChange: (index: number) => void;
}

const MultipleChoiceEditor = ({
                                    choices,
                                    correctIndex,
                                    onChoicesChange,
                                    onCorrectIndexChange,
                                }: MultipleChoiceEditorProps) => {

    const generateChoiceId = () => `choice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const handleChoiceTextChange = (index: number, text: string) => {
        const updatedChoices = choices.map((choice, i) =>
            i === index ? { ...choice, text } : choice
        );
        onChoicesChange(updatedChoices);
    };

    const addChoice = () => {
        if (choices.length < 10) {
            const newChoice: Choice = {
                id: generateChoiceId(),
                text: '',
            };
            onChoicesChange([...choices, newChoice]);
        }
    };

    const removeChoice = (index: number) => {
        if (choices.length > 2) {
            const updatedChoices = choices.filter((_, i) => i !== index);
            onChoicesChange(updatedChoices);

            // 정답 인덱스 조정
            if (correctIndex >= updatedChoices.length) {
                onCorrectIndexChange(updatedChoices.length - 1);
            } else if (correctIndex > index) {
                onCorrectIndexChange(correctIndex - 1);
            }
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                    선택지 (2~10개)
                </label>
                <span className="text-xs text-gray-500">
                    {choices.length}/10개
                </span>
            </div>

            {choices.map((choice, index) => (
                <div key={choice.id} className="flex gap-3 items-center">
                    {/* 정답 라디오 버튼 */}
                    <input
                        type="radio"
                        name="correct-answer"
                        checked={correctIndex === index}
                        onChange={() => onCorrectIndexChange(index)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />

                    {/* 선택지 텍스트 입력 */}
                    <input
                        type="text"
                        value={choice.text}
                        onChange={(e) => handleChoiceTextChange(index, e.target.value)}
                        placeholder={`선택지 ${index + 1}${correctIndex === index ? ' (정답)' : ''}`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />

                    {/* 삭제 버튼 */}
                    {choices.length > 2 && (
                        <button
                            type="button"
                            onClick={() => removeChoice(index)}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                            삭제
                        </button>
                    )}
                </div>
            ))}

            {/* 선택지 추가 버튼 */}
            {choices.length < 10 && (
                <button
                    type="button"
                    onClick={addChoice}
                    className="w-full px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-md hover:border-gray-400 hover:text-gray-700 transition-colors"
                >
                    + 선택지 추가
                </button>
            )}

            <div className="text-xs text-gray-500">
                💡 정답으로 설정할 선택지 왼쪽의 버튼을 클릭하세요
            </div>
        </div>
    );
};

export default MultipleChoiceEditor;