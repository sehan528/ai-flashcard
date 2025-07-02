import { useEffect, useRef } from 'react';

interface ContextMenuItem {
    label: string;
    icon: string;
    onClick: () => void;
    danger?: boolean;
}

interface ContextMenuProps {
    x: number;
    y: number;
    items: ContextMenuItem[];
    onClose: () => void;
}

const ContextMenu = ({ x, y, items, onClose } : ContextMenuProps) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscapeKey);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [onClose]);

    return (
        <div
            ref={menuRef}
            className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-[140px]"
            style={{
                left: x,
                top: y,
            }}
        >
            {items.map((item, index) => (
                <button
                    key={index}
                    onClick={() => {
                        item.onClick();
                        onClose();
                    }}
                    className={`
                    w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2
                    ${item.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'}
                    `}
                >
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                </button>
            ))}
        </div>
    );
};

export default ContextMenu;