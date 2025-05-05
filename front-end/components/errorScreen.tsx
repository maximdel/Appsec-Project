import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Header from '@components/header/header';

const ErrorScreen = ({ userError, teamsError }: { userError: any; teamsError: any }) => {
    const { t } = useTranslation();
    return (
        <>
            <Head>
                <title>{t('app.title')}</title>
                <meta name="description" content={t('app.title')} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <div className="flex items-center justify-center h-96">
                <p className="text-red-700 font-semibold">
                    {userError ? `${t('users.errorFetchingUser')}: ${userError.message}` : ''}
                    {teamsError ? `${t('teams.errorFetchingTeams')}: ${teamsError.message}` : ''}
                </p>
            </div>
        </>
    );
};

export default ErrorScreen;
