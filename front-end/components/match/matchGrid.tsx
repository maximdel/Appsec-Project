import { Match } from '@types';
import Link from 'next/link';
import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';

type Props = {
    matches: Array<Match>;
};

const MatchGrid: React.FC<Props> = ({ matches }: Props) => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredMatches = (Array.isArray(matches) ? matches : []).filter((match) =>
        `${match.id}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            {matches && (
                <section className="p-6">
                    <div className="mb-6 flex items-center">
                        <input
                            type="text"
                            placeholder={t('matches.searchPlaceholder')}
                            aria-label={t('matches.search')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredMatches.length > 0 ? (
                            filteredMatches.map((match) => {
                                const team1Score = match.teams[0]?.goals.length || 0;
                                const team2Score = match.teams[1]?.goals.length || 0;

                                const team1Color =
                                    team1Score > team2Score
                                        ? 'text-green-500'
                                        : team1Score < team2Score
                                        ? 'text-red-500'
                                        : 'text-red-500';
                                const team2Color =
                                    team2Score > team1Score
                                        ? 'text-green-500'
                                        : team2Score < team1Score
                                        ? 'text-red-500'
                                        : 'text-red-500';

                                return (
                                    <Link
                                        href={`matches/${match.id}`}
                                        key={match.id}
                                        className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center"
                                    >
                                        <div className="flex justify-between w-full text-gray-800 font-semibold text-lg">
                                            <span className="flex-1 text-right pr-4">
                                                {match.teams[0].team.name}
                                            </span>
                                            <span className="text-gray-500 font-normal text-base">
                                                vs{' '}
                                            </span>
                                            <span className="flex-1 text-left pl-4">
                                                {match.teams[1].team.name}
                                            </span>
                                        </div>

                                        <div className="text-gray-700 font-bold text-xl mt-2">
                                            <span className={team1Color}>{team1Score}</span> -{' '}
                                            <span className={team2Color}>{team2Score}</span>
                                        </div>
                                    </Link>
                                );
                            })
                        ) : (
                            <p className="text-center col-span-full text-gray-500">
                                {t('matches.noFound')}
                            </p>
                        )}
                    </div>
                </section>
            )}
        </>
    );
};

export default MatchGrid;
