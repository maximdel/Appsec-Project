// pages/users/index.tsx
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import useSWR from 'swr';
import UserService from '@services/UserService';
import { User } from '@types';
import LoadingScreen from '@components/loadingScreen';
import ErrorScreen from '@components/errorScreen';
import UserGrid from '@components/users/userGrid';
import Header from '@components/header/header';
import Head from 'next/head';

const UsersPage: React.FC = () => {
    const { t } = useTranslation();
    const router = useRouter();

    const fetchUsers = async (): Promise<User[]> => {
        const response = await UserService.getAllUsers();
        if (!response.ok) {
            const errorMessage = response.status === 401 ? t('permissions.unauthorized') : '';
            throw new Error(errorMessage);
        }
        const users = await response.json();
        return users;
    };

    const {
        data: users,
        isLoading,
        error,
    } = useSWR<User[]>('fetchUsers', fetchUsers, {
        refreshInterval: 500,
    });

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return <ErrorScreen userError={error} teamsError={null} />;
    }

    return (
        <>
            <Head>
                <title>{t('app.title')}</title>
                <meta name="description" content={t('app.title')} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <UserGrid Users={users || []} />
        </>
    );
};

export default UsersPage;

export const getServerSideProps = async (context: { locale: any }) => {
    const { locale } = context;

    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'en', ['common'])),
        },
    };
};
