import Header from '@components/header/header';
import PlayerGrid from '@components/playerGrid/playerGrid';
import UserService from '@services/UserService';
import { User } from '@types';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import React from 'react';
import useSWR from 'swr';

const PlayersPage: React.FC = () => {
    const { t } = useTranslation();

    const fetchPlayers = async () => {
        const response = await UserService.getAllPlayers();
        if (!response.ok) {
            const errorMessage = response.status === 401 ? t('permissions.unauthorized') : '';
            throw new Error(errorMessage);
        }
        const players = await response.json();
        return players;
    };

    const {
        data: players,
        isLoading,
        error,
    } = useSWR<User[]>('fetchPlayers', fetchPlayers, {
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
            {isLoading ? (
                <p>{t('players.loading')}</p>
            ) : error ? (
                <div className="flex items-center justify-center h-96">
                    <p className="text-red-700 font-semibold">
                        {t('players.error', { message: error.message })}
                    </p>
                </div>
            ) : (
                <>{players && <PlayerGrid players={players} />}</>
            )}
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

export default PlayersPage;
