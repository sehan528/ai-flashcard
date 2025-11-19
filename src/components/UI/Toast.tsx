import { useFlashcardStore } from '../../stores/flashcardStore';

const Toast = () => {
    const { toast, isToastExiting } = useFlashcardStore();

    if (!toast) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className={`max-w-md mx-4 p-6 rounded-xl shadow-2xl whitespace-pre-line pointer-events-auto ${
                isToastExiting ? 'animate-fade-out' : 'animate-fade-in'
            } ${
                toast.type === 'success'
                    ? 'bg-green-50 text-green-800 border-2 border-green-300'
                    : toast.type === 'error'
                    ? 'bg-red-50 text-red-800 border-2 border-red-300'
                    : 'bg-blue-50 text-blue-800 border-2 border-blue-300'
            }`}>
                <div className="text-center">
                    {toast.text}
                </div>
            </div>
        </div>
    );
};

export default Toast;
