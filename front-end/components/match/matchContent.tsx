import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Header from '@components/header/header';
import Link from 'next/link';
import { TrashIcon } from 'lucide-react';
import { Match, UserStorage } from '@types';

const MatchContent = ({
    match,
    loggedInUser,
    deleteGoal,
}: {
    match: Match | undefined;
    loggedInUser: UserStorage | null;
    deleteGoal: (goalId: number) => void;
}) => {
    const { t } = useTranslation();

    const getTeamColor = (teamIndex: number) => {
        if (!match) return 'bg-gray-100';

        const team1Goals = match.teams[0]?.goals.length || 0;
        const team2Goals = match.teams[1]?.goals.length || 0;

        if (teamIndex === 0 && team1Goals > team2Goals) return 'bg-green-200';
        if (teamIndex === 1 && team2Goals > team1Goals) return 'bg-green-200';

        return 'bg-gray-100';
    };

    return (
        <>
            <Head>
                <title>{t('app.title')}</title>
                <meta name="description" content={t('app.title')} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />

            <div className="flex flex-col items-center p-8 bg-gray-50 min-h-screen">
                <h1 className="text-2xl font-bold text-gray-800">{t('match.details')}</h1>

                <div className="flex flex-col lg:flex-row max-w-6xl w-full gap-8 mt-6">
                    <div className="flex flex-col lg:w-2/3 gap-6">
                        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-2 text-gray-800">
                                {t('match.matchId')}
                            </h2>
                            <p className="text-gray-600">{match?.id}</p>
                        </div>

                        <div className="flex gap-4">
                            {match?.teams.map((teamData, index) => (
                                <Link
                                    key={index}
                                    href={`/teams/${teamData.team.id}`}
                                    className={`flex-1 rounded-lg shadow-md p-4 hover:bg-green-300 transition duration-200 ${getTeamColor(
                                        index
                                    )}`}
                                >
                                    <div className="text-center">
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {teamData.team.name}
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-2 text-gray-800">
                                {t('match.score')}
                            </h2>
                            <p className="text-gray-600">
                                {match?.teams[0].goals.length} - {match?.teams[1].goals.length}
                            </p>
                        </div>

                        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-2 text-gray-800">
                                {t('match.location')}
                            </h2>
                            <p className="text-gray-600">{match?.location.city}</p>
                        </div>
                    </div>

                    <div className="lg:w-1/3">
                        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-2 text-gray-800">
                                {t('match.dateTime')}
                            </h2>
                            <p className="text-gray-600">
                                {new Date(match?.date ?? '').toLocaleString()}
                            </p>
                        </div>
                        <ul className="p-5">
                            {match?.goals.map((goal) => (
                                <li key={goal.id} className="flex items-center justify-between">
                                    <Link
                                        href={`/users/${goal.player.username}`}
                                        className="hover:font-bold text-blue-600 hover:underline"
                                    >
                                        {goal.time}' -{' '}
                                        {goal.player?.firstName || t('match.unknown')}{' '}
                                        {goal.player?.lastName || ''} (
                                        {goal.team?.name || t('match.unknownTeam')})
                                    </Link>
                                    {loggedInUser?.role === 'ADMIN' && (
                                        <button
                                            onClick={() => deleteGoal(goal.id)}
                                            className="text-red-600 hover:underline flex items-center"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MatchContent;
