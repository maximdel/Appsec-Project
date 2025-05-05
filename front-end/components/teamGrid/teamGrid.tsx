import { Team } from '@types';
import Link from 'next/link';
import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';

type Props = {
    teams: Array<Team>;
};

const TeamGrid: React.FC<Props> = ({ teams }: Props) => {
    const [searchTerm, setSearchTerm] = useState('');
    const { t } = useTranslation();

    const filteredTeams = (Array.isArray(teams) ? teams : []).filter((team) =>
        `${team.name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            {teams && (
                <section className="p-6">
                    <div className="mb-6 flex items-center">
                        <input
                            type="text"
                            placeholder={t('teams.searchPlaceholder')}
                            aria-label={t('teams.search')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredTeams.length > 0 ? (
                            filteredTeams.map((team) => (
                                <Link
                                    href={`/teams/${team.id}`}
                                    key={team.id}
                                    className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
                                >
                                    <p className="font-semibold text-lg text-gray-800">
                                        {team.name}
                                    </p>
                                </Link>
                            ))
                        ) : (
                            <p className="text-center col-span-full text-gray-500">
                                {t('teams.noFound')}
                            </p>
                        )}
                    </div>
                </section>
            )}
        </>
    );
};

export default TeamGrid;
