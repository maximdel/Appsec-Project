import Header from '@components/header/header';
import UserRegisterForm from '@components/users/UserRegisterForm';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

const Login: React.FC = () => {
    const { t } = useTranslation();

    return (
        <>
            <Head>
                <title>{t('register.title')}</title>
            </Head>
            <Header />
            <main>
                <section className="p-6 min-h-screen flex flex-col items-center">
                    <UserRegisterForm />
                </section>
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

export default Login;
