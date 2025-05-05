import { Match } from '@types';
import router from 'next/router';
import React from 'react';

type MatchTileProps = {
    match: Match;
    teamId: number;
};

const MatchTile: React.FC<MatchTileProps> = ({ match, teamId }) => {
    const team1Score = match?.teams[0]?.goals.length || 0;
    const team2Score = match?.teams[1]?.goals.length || 0;

    const team1Color =
        team1Score > team2Score
            ? 'text-green-500'
            : team1Score < team2Score
            ? 'text-red-500'
            : 'text-gray-500';
    const team2Color =
        team2Score > team1Score
            ? 'text-green-500'
            : team2Score < team1Score
            ? 'text-red-500'
            : 'text-gray-500';

    return (
        <div
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center justify-between text-center border border-gray-200 w-full h-full"
            onClick={() => router.push(`/matches/${match.id}`)}
        >
            <div className="text-center">
                <p className="text-sm font-semibold text-gray-800">{match?.teams[0]?.team.name}</p>
                <p className={`text-2xl font-bold mt-2 ${team1Color}`}>{team1Score}</p>
            </div>

            <div className="text-gray-600 text-lg font-semibold">vs</div>

            <div className="text-center">
                <p className="text-sm font-semibold text-gray-800">{match?.teams[1]?.team.name}</p>
                <p className={`text-2xl font-bold mt-2 ${team2Color}`}>{team2Score}</p>
            </div>

            <p className="text-xs text-gray-500 mt-4">
                {new Date(match?.date).toLocaleDateString()}
            </p>
        </div>
    );
};

export default MatchTile;
