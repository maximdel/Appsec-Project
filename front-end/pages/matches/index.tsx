import Header from '@components/header/header';
import MatchGrid from '@components/match/matchGrid';
import MatchService from '@services/MatchService';
import { Match } from '@types';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import React from 'react';
import useSWR from 'swr';

const MatchesPage: React.FC = () => {
    const { t } = useTranslation();

    const fetchMatches = async () => {
        const response = await MatchService.getAllMatches();
        if (!response.ok) {
            const errorMessage =
                response.status === 401 ? t('permissions.unauthorized') : response.statusText;
            throw new Error(errorMessage);
        }
        const matches = await response.json();
        return matches;
    };

    const {
        data: matches,
        isLoading,
        error,
    } = useSWR<Match[]>('fetchMatches', fetchMatches, {
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
            <div>
                {isLoading ? (
                    <p>{t('matches.loading')}</p>
                ) : error ? (
                    <div className="flex items-center justify-center h-96">
                        <p className="text-red-700 font-semibold">
                            {t('matches.error', { message: error.message })}
                        </p>
                    </div>
                ) : (
                    <MatchGrid matches={matches || []} />
                )}
            </div>
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

export default MatchesPage;
