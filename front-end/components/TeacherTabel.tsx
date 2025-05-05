import React from 'react';
import { useTranslation } from 'next-i18next';

const TeacherTabel: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="flex-1 bg-gray-300">
            <table className="table-auto w-full">
                <thead>
                    <tr>
                        <th className="px-4 py-2">{t('home.username')}</th>
                        <th className="px-4 py-2">{t('home.password')}</th>
                        <th className="px-4 py-2">{t('home.role')}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border px-4 py-2">admin</td>
                        <td className="border px-4 py-2">secure12345</td>
                        <td className="border px-4 py-2">Admin</td>
                    </tr>
                    <tr>
                        <td className="border px-4 py-2">jurgenk</td>
                        <td className="border px-4 py-2">123</td>
                        <td className="border px-4 py-2">Coach</td>
                    </tr>
                    <tr>
                        <td className="border px-4 py-2">manueln</td>
                        <td className="border px-4 py-2">123</td>
                        <td className="border px-4 py-2">Player</td>
                    </tr>
                    <tr>
                        <td className="border px-4 py-2">user1</td>
                        <td className="border px-4 py-2">123</td>
                        <td className="border px-4 py-2">User</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default TeacherTabel;
