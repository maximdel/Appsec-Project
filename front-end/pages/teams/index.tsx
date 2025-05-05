import ErrorScreen from '@components/errorScreen';
import Header from '@components/header/header';
import TeamGrid from '@components/teamGrid/teamGrid';
import TeamService from '@services/TeamService';
import { Team } from '@types';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import React from 'react';
import useSWR from 'swr';

const TeamsPage: React.FC = () => {
    const { t } = useTranslation();

    const fetchTeams = async () => {
        const response = await TeamService.getAllTeams();
        if (!response.ok) {
            const errorMessage = response.status === 401 ? t('permissions.unauthorized') : '';
            throw new Error(errorMessage);
        }
        const teams = await response.json();
        return teams;
    };

    const {
        data: teams,
        isLoading,
        error,
    } = useSWR<Team[]>('fetchTeams', fetchTeams, {
        refreshInterval: 10000,
    });

    return (
        <>
            <div>
                {isLoading ? (
                    <p>{t('teams.loading')}</p>
                ) : error ? (
                    <ErrorScreen userError={null} teamsError={error} />
                ) : (
                    <>
                        <Head>
                            <title>{t('app.title')}</title>
                            <meta name="description" content={t('app.title')} />
                            <meta name="viewport" content="width=device-width, initial-scale=1" />
                            <link rel="icon" href="/favicon.ico" />
                        </Head>
                        <Header />
                        <TeamGrid teams={teams || []} />
                    </>
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

export default TeamsPage;
