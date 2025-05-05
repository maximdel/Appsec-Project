import { useTranslation } from 'next-i18next';
import React from 'react';

type UnauthorizedAccessModalProps = {
    onClose: () => void;
};

const UnauthorizedAccessModal: React.FC<UnauthorizedAccessModalProps> = ({ onClose }) => {
    const { t } = useTranslation();

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-red-600 mb-4">
                    {t('modal.unauthorizedAccessTitle', 'Access Denied')}
                </h2>
                <p className="text-gray-800 mb-4">
                    {t(
                        'modal.unauthorizedAccessMessage',
                        "You're not authorized to view this page. Only administrators can access these resources."
                    )}
                </p>
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                    {t('modal.goHome', 'Go to Homepage')}
                </button>
            </div>
        </div>
    );
};

export default UnauthorizedAccessModal;
