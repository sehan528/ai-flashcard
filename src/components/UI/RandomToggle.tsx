interface RandomToggleProps {
    isRandom: boolean;
    onToggle: (isRandom: boolean) => void;
}

const RandomToggle = ({isRandom, onToggle} : RandomToggleProps) => {
    return (
        <div className="flex items-center justify-center gap-3 mb-6">
            <span className={`text-sm font-medium ${!isRandom ? 'text-gray-900' : 'text-gray-500'}`}>
            순서대로
            </span>

            <button
            onClick={() => onToggle(!isRandom)}
            className={`
            relative inline-flex w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 
            focus:ring-blue-500 focus:ring-offset-2
            ${isRandom ? 'bg-blue-500' : 'bg-gray-300'}
            `}
            >
                <div
                    className={`
                    absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200
                    ${isRandom ? 'translate-x-6' : 'translate-x-0.5'}
                    `}
                />
            </button>

            <span className={`text-sm font-medium ${isRandom ? 'text-gray-900' : 'text-gray-500'}`}>
                랜덤
            </span>
        </div>
    );
};

export default RandomToggle;