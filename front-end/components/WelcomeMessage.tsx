import React from 'react';
import { useTranslation } from 'next-i18next';

const WelcomeMessage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="flex-1 space-y-4 bg-gray-50 p-4 rounded shadow">
            <h2 className="text-lg font-bold">{t('home.welcome.text-1')}</h2>
            <p className="text-gray-600">{t('home.welcome.text-2')}</p>
            <p className="text-gray-600">{t('home.welcome.text-3')}</p>
        </div>
    );
};

export default WelcomeMessage;
