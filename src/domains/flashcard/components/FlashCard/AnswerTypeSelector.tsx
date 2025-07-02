export type AnswerType = 'essay' | 'multiple';

interface AnswerTypeSelectorProps {
    selectedType: AnswerType;
    onTypeChange: (type: AnswerType) => void;
}

const AnswerTypeSelector  = ({ selectedType , onTypeChange } : AnswerTypeSelectorProps) => {
    const answerTypes = [
        {
            id: 'essay' as AnswerType,
            title: '📝 서술형',
            description: 'AI가 답변을 평가합니다',
        },
        {
            id: 'multiple' as AnswerType,
            title: '✅ 객관식',
            description: '선택지를 제공합니다',
        },
    ];

    return (
        <div>
            {answerTypes.map((type)=>(
                <button
                    key={type.id}
                    type="button"
                    onClick={()=>onTypeChange(type.id)}
                    className={`
                        p-4 border-2 rounded-lg text-center transition-all duration-200
                        ${ selectedType === type.id
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                        }
                    `}
                >
                    <div className="font-semibold text-lg mb-1">
                        {type.title}
                    </div>

                    <div className="text-sm opacity-75">
                        {type.description}
                    </div>
                </button>
            ))}
        </div>

    );
};

export default AnswerTypeSelector;