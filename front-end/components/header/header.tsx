import { UserStorage } from '@types';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Language from '../language/Language';
import OverviewDropdown from './overviewDropdown';
import UserDropdown from './userDropdown';
import BackButton from './backButton';

const Header: React.FC = () => {
    const [loggedInUser, setLoggedInUser] = useState<UserStorage | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        const storedUser = localStorage.getItem('loggedInUser');
        if (storedUser) {
            setLoggedInUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <nav className="bg-slate-800 text-white p-4">
            <div className="container mx-auto flex justify-between">
                <BackButton />
                <Link href="/" className="text-lg font-bold">
                    {t('app.title')}
                </Link>
                <div className="flex space-x-4">
                    <Link
                        className="px-2 text-white text-xl hover:bg-slate-600 rounded-lg"
                        href="/"
                    >
                        {t('header.nav.home')}
                    </Link>

                    {['COACH', 'PLAYER', 'ADMIN'].includes(loggedInUser?.role ?? '') && (
                        <>
                            {loggedInUser && <OverviewDropdown t={t} loggedInUser={loggedInUser} />}
                        </>
                    )}

                    {loggedInUser && ['USER'].includes(loggedInUser.role ?? '') && (
                        <>
                            <Link
                                className="px-2 text-white text-xl hover:bg-slate-600 rounded-lg"
                                href="/players"
                            >
                                {t('header.nav.players')}
                            </Link>
                            <Link
                                className="px-2 text-white text-xl hover:bg-slate-600 rounded-lg"
                                href="/teams"
                            >
                                {t('header.nav.teams')}
                            </Link>
                            <Link
                                className="px-2 text-white text-xl hover:bg-slate-600 rounded-lg"
                                href="/matches"
                            >
                                {t('header.nav.matches')}
                            </Link>
                        </>
                    )}

                    {loggedInUser && ['COACH', 'PLAYER'].includes(loggedInUser.role ?? '') && (
                        <>
                            <Link
                                className="px-2 text-white text-xl hover:bg-slate-600 rounded-lg"
                                href={`/teams/${loggedInUser.teamId}`}
                            >
                                {t('header.nav.myTeam')}
                            </Link>
                        </>
                    )}

                    {loggedInUser ? (
                        <>
                            <UserDropdown
                                t={t}
                                loggedInUser={loggedInUser}
                                setLoggedInUser={setLoggedInUser}
                            />
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="px-2 text-white text-xl hover:bg-slate-600 rounded-lg"
                            >
                                {t('header.nav.login')}
                            </Link>
                            <Link
                                href="/register"
                                className="px-2 text-white text-xl hover:bg-slate-600 rounded-lg"
                            >
                                {t('header.nav.register')}
                            </Link>
                        </>
                    )}
                    <Language />
                </div>
            </div>
        </nav>
    );
};

export default Header;
