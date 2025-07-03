import React, { useState, useEffect } from 'react';
import type { CardSet } from '../../dtos/FlashCard';

interface CardSetEditModalProps {
    cardSet: CardSet;
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string, description: string) => void;
}

const CardSetEditModal = ({ cardSet, isOpen, onClose, onSave }: CardSetEditModalProps) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    // 모달이 열릴 때 기존 값으로 초기화
    useEffect(() => {
        if (isOpen) {
            setName(cardSet.name);
            setDescription(cardSet.description);
            setErrors({});
        }
    }, [isOpen, cardSet]);

    // 폼 검증
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!name.trim()) {
            newErrors.name = '카드셋 이름을 입력해주세요.';
        } else if (name.length > 30) {
            newErrors.name = '카드셋 이름은 30자 이하로 입력해주세요.';
        }

        if (description.length > 150) {
            newErrors.description = '설명은 150자 이하로 입력해주세요.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 저장 핸들러
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            onSave(name.trim(), description.trim());
            onClose();
        }
    };

    // 취소 핸들러
    const handleCancel = () => {
        setName(cardSet.name);
        setDescription(cardSet.description);
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        카드셋 편집
                    </h3>

                    <form onSubmit={handleSave} className="space-y-4">
                        {/* 카드셋 이름 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                카드셋 이름 *
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="카드셋 이름을 입력하세요"
                                maxLength={30}
                            />
                            <div className="flex justify-between items-center mt-1">
                                {errors.name ? (
                                    <p className="text-sm text-red-600">{errors.name}</p>
                                ) : (
                                    <div />
                                )}
                                <span className="text-xs text-gray-500">
                                    {name.length}/30
                                </span>
                            </div>
                        </div>

                        {/* 설명 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                설명
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                                    errors.description ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="카드셋에 대한 설명을 입력하세요"
                                rows={3}
                                maxLength={150}
                            />
                            <div className="flex justify-between items-center mt-1">
                                {errors.description ? (
                                    <p className="text-sm text-red-600">{errors.description}</p>
                                ) : (
                                    <div />
                                )}
                                <span className="text-xs text-gray-500">
                                    {description.length}/150
                                </span>
                            </div>
                        </div>

                        {/* 버튼들 */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                저장
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                취소
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CardSetEditModal;