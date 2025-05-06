import UserService from '@services/UserService';
import { User } from '@types';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

type Props = {
    Users: User[];
};

const UserGrid: React.FC<Props> = ({ Users }) => {
    const { t } = useTranslation();

    // Local state so we can remove cards without refetching
    const [users, setUsers] = useState<User[]>(Users);
    const [searchTerm, setSearch] = useState('');

    // Keep local state in sync if parent prop changes
    useEffect(() => {
        setUsers(Users);
    }, [Users]);

    const handleDelete = async (username: string) => {
        if (!confirm(t('users.confirmDelete', { username }))) return;
        try {
            const res = await UserService.removeUser(username);
            if (res.ok) {
                // filter out the deleted user
                setUsers((u) => u.filter((x) => x.username !== username));
            } else {
                const { message } = await res.json();
                alert(message || t('general.error'));
            }
        } catch (err: any) {
            alert(err.message || t('general.error'));
        }
    };

    const filtered = users.filter((u) => {
        const name = `${u.firstName} ${u.lastName}`.toLowerCase();
        return !searchTerm || name.includes(searchTerm.toLowerCase());
    });

    return (
        <section className="p-6">
            <div className="mb-6 flex items-center">
                <input
                    type="text"
                    placeholder={t('users.searchPlaceholder')}
                    aria-label={t('users.search')}
                    value={searchTerm}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.length > 0 ? (
                    filtered.map((user) => (
                        <div
                            key={user.id}
                            className="relative bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                        >
                            {/* Delete button */}
                            <button
                                onClick={() => handleDelete(user.username!)}
                                className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                                aria-label={t('users.delete')}
                            >
                                &times;
                            </button>

                            {/* User link */}
                            <Link
                                className="block text-center font-semibold text-lg text-gray-800"
                                href={`/users/${user.username}`}
                            >
                                {user.firstName} {user.lastName}
                            </Link>
                        </div>
                    ))
                ) : (
                    <p className="text-center col-span-full text-gray-500">{t('users.noFound')}</p>
                )}
            </div>
        </section>
    );
};

export default UserGrid;
