import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import Header from '@components/header/header';
import GoalService from '@services/GoalService';
import MatchService from '@services/MatchService';
import { Match, UserStorage } from '@types';
import LoadingScreen from '@components/loadingScreen';
import ErrorScreen from '@components/errorScreen';
import MatchContent from '@components/match/matchContent';

const MatchPage = () => {
    const router = useRouter();
    const { matchId } = router.query;
    const { t } = useTranslation();
    const [loggedInUser, setLoggedInUser] = useState<UserStorage | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('loggedInUser');
        if (storedUser) {
            setLoggedInUser(JSON.parse(storedUser));
        }
    }, []);

    const fetchMatch = async (matchId: number) => {
        const response = await MatchService.getMatchById(matchId);
        if (!response.ok) {
            const errorMessage =
                response.status === 401 ? t('permissions.unauthorized') : response.statusText;
            throw new Error(errorMessage);
        }
        return response.json();
    };

    const {
        data: match,
        isLoading,
        error,
        mutate,
    } = useSWR<Match>(matchId ? `fetchMatch-${matchId}` : null, () => fetchMatch(Number(matchId)), {
        refreshInterval: 10000,
    });

    const deleteGoal = async (goalId: number) => {
        try {
            await GoalService.deleteGoalById(goalId);
            mutate();
        } catch {
            alert(t('errors.deleteGoalFailed'));
        }
    };

    if (isLoading) return <LoadingScreen />;

    if (error) return <ErrorScreen userError={error} teamsError={null} />;

    return <MatchContent match={match} loggedInUser={loggedInUser} deleteGoal={deleteGoal} />;
};

export default MatchPage;

export const getServerSideProps = async (context: { locale: any }) => {
    const { locale } = context;

    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'en', ['common'])),
        },
    };
};
