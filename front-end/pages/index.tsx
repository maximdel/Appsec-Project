import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '@components/header/header';
import MatchTile from '@components/match/matchTile';
import MatchService from '@services/MatchService';
import { Match, UserStorage } from '@types';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import useSWR from 'swr';
import PlaceholderTable from '@components/TeacherTabel';
import WelcomeMessage from '@components/WelcomeMessage';

const HomePage: React.FC = () => {
    const [loggedInUser, setLoggedInUser] = useState<UserStorage | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        const storedUser = localStorage.getItem('loggedInUser');
        if (storedUser) {
            setLoggedInUser(JSON.parse(storedUser));
        }
    }, []);

    const fetchLatestMatches = async () => {
        const response = await MatchService.getLatestMatches(10);

        if (!response.ok) {
            const errorMessage =
                response.status === 401 ? t('permissions.unauthorized') : response.statusText;
            throw new Error(errorMessage);
        }

        const matches = await response.json();
        return matches;
    };

    const { data: matches } = useSWR('fetchLatestMatches', fetchLatestMatches, {
        refreshInterval: 10000,
    });

    return (
        <>
            <Head>
                <title>{t('app.title')}</title>
                <meta name="description" content={t('app.title')} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="flex space-x-8">
                    <PlaceholderTable />
                    <WelcomeMessage />
                </div>
                <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                    {loggedInUser ? (
                        matches?.map((match: Match) => (
                            <MatchTile key={match.id} match={match} teamId={0} />
                        ))
                    ) : (
                        <p className="text-center col-span-full text-gray-500">
                            {t('home.needLogin')}
                        </p>
                    )}
                </div>
            </main>
        </>
    );
};

export const getServerSideProps = async (context: { locale: any }) => {
    const { locale } = context;

    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'en', ['common'])),
        },
    };
};

export default HomePage;
