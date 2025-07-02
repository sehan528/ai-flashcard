export type AppTab = 'home' | 'add-card' | 'settings';

interface HeaderProps {
    currentTab: AppTab;
    onTabChange: (tab: AppTab) => void;
}

const Header = ({ currentTab, onTabChange }: HeaderProps) => {
    const navItems = [
        { id: 'home' as AppTab, label: '홈' },
        { id: 'add-card' as AppTab, label: '카드 추가' },
        { id: 'settings' as AppTab, label: '설정' },
    ];

    return (
        <header className="bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg">
            <div className="container mx-auto px-4 py-6">
                <div className="text-center mb-4">
                    <h1 className="text-3xl font-bold mb-2">
                        🧠 AI Flashcard
                    </h1>
                    <p className="text-blue-100 text-lg">
                        스마트한 학습, AI가 도와드립니다
                    </p>
                </div>

                <div className="flex justify-center gap-4">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${currentTab === item.id
                                ? 'bg-white/30 text-white'
                                : 'bg-white/10 text-blue-100 hover:bg-white/20 hover:text-white'
                            }
              `}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
        </header>
    );
};

export default Header;