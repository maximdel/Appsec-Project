import { useTranslation } from 'next-i18next';
import React from 'react';

const EditButtons = ({
    isEditing,
    handleEditToggle,
    handleSave,
}: {
    isEditing: boolean;
    handleEditToggle: () => void;
    handleSave: () => void;
}) => {
    const { t } = useTranslation();
    return (
        <div className="flex gap-4 mt-6">
            {isEditing ? (
                <>
                    <button
                        onClick={handleSave}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        {t('buttons.save')}
                    </button>
                    <button
                        onClick={handleEditToggle}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        {t('buttons.cancel')}
                    </button>
                </>
            ) : (
                <button onClick={handleEditToggle} className="bg-gray-200 rounded-full p-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15.232 5.232l3.536 3.536M9 11l3.536-3.536a1.5 1.5 0 012.121 0l3.536 3.536a1.5 1.5 0 010 2.121L11 21H6v-5L15.232 5.232z"
                        />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default EditButtons;
