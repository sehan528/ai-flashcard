import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

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
    const [position, setPosition] = useState({ x, y });

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

    // 화면 경계 체크 및 위치 조정
    useEffect(() => {
        if (menuRef.current) {
            const rect = menuRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            let adjustedX = x;
            let adjustedY = y;

            // 오른쪽 경계 체크
            if (adjustedX + rect.width > viewportWidth) {
                adjustedX = viewportWidth - rect.width - 8; // 8px 여백
            }

            // 아래 경계 체크
            if (adjustedY + rect.height > viewportHeight) {
                adjustedY = viewportHeight - rect.height - 8; // 8px 여백
            }

            // 왼쪽 경계 체크
            if (adjustedX < 8) {
                adjustedX = 8;
            }

            // 위쪽 경계 체크
            if (adjustedY < 8) {
                adjustedY = 8;
            }

            setPosition({ x: adjustedX, y: adjustedY });
        }
    }, [x, y]);

    return createPortal(
        <div
            ref={menuRef}
            className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-[60] min-w-[140px]"
            style={{
                left: position.x,
                top: position.y,
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
        </div>,
        document.body
    );
};

export default ContextMenu;