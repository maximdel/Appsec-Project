import MatchService from '@services/MatchService';
import { Match } from '@types';
import Link from 'next/link';
import React from 'react';
import useSWR from 'swr';
import { useTranslation } from 'next-i18next';

type LatestMatchesProps = {
    teamId: number;
};

const LatestMatches: React.FC<LatestMatchesProps> = ({ teamId }) => {
    const { t } = useTranslation();

    const fetchLatestMatches = async () => {
        const response = await MatchService.getLatestMatchesByTeamId(teamId);
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
    } = useSWR<Match[]>(`fetchLatestMatches-team-${teamId}`, fetchLatestMatches, {
        refreshInterval: 5000,
    });

    if (error) return <p className="text-red-500">{error.message}</p>;

    return (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('matches.latest')}</h2>
            {matches && matches.length > 0 ? (
                <ul className="space-y-2">
                    {matches.map((match) => {
                        const team1 = match.teams[0];
                        const team2 = match.teams[1];
                        const team1Score = team1?.goals.length || 0;
                        const team2Score = team2?.goals.length || 0;
                        const currentTeam = team1.team.id === teamId ? team1 : team2;
                        const isCurrentTeamWinning =
                            team1.team.id === teamId
                                ? team1Score >= team2Score
                                : team2Score >= team1Score;
                        const currentTeamColor = isCurrentTeamWinning
                            ? 'text-green-500'
                            : 'text-red-500';

                        return (
                            <li key={match.id} className="p-2 border-b border-gray-200">
                                <Link
                                    href={`/matches/${match.id}`}
                                    className="flex justify-between"
                                >
                                    <span className="text-gray-700">
                                        <span
                                            className={
                                                team1.team.id === teamId ? currentTeamColor : ''
                                            }
                                        >
                                            {team1.team.name}
                                        </span>{' '}
                                        vs{' '}
                                        <span
                                            className={
                                                team2.team.id === teamId ? currentTeamColor : ''
                                            }
                                        >
                                            {team2.team.name}
                                        </span>
                                    </span>
                                    <span className="ml-3">
                                        <span
                                            className={
                                                team1.team.id === teamId ? currentTeamColor : ''
                                            }
                                        >
                                            {team1Score}
                                        </span>{' '}
                                        -{' '}
                                        <span
                                            className={
                                                team2.team.id === teamId ? currentTeamColor : ''
                                            }
                                        >
                                            {team2Score}
                                        </span>
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className="text-gray-500">{t('matches.noRecent')}</p>
            )}
        </div>
    );
};

export default LatestMatches;
