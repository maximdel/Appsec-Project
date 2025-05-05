import { User } from '@types';
import Link from 'next/link';
import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';

type Props = {
    Users: Array<User>;
};

const UserGrid: React.FC<Props> = ({ Users }: Props) => {
    const { t } = useTranslation();

    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = Array.isArray(Users)
        ? Users.filter(
              (User) =>
                  searchTerm === '' ||
                  `${User.firstName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  `${User.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : [];

    return (
        <>
            <section className="p-6">
                <div className="mb-6 flex items-center">
                    <input
                        type="text"
                        placeholder={t('users.searchPlaceholder')}
                        aria-label={t('users.search')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <Link
                                href={`/users/${user.username}`}
                                key={user.id}
                                className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
                            >
                                <p className="font-semibold text-lg text-gray-800">
                                    {user.firstName} {user.lastName}
                                </p>
                            </Link>
                        ))
                    ) : (
                        <p className="text-center col-span-full text-gray-500">
                            {t('users.noFound')}
                        </p>
                    )}
                </div>
            </section>
        </>
    );
};

export default UserGrid;
