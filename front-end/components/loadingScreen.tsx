import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Header from '@components/header/header';

const LoadingScreen = () => {
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
            <p>{t('app.loading')}</p>
        </>
    );
};

export default LoadingScreen;
