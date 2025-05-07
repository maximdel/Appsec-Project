import { Match } from '@types';

const getAllMatches = async () => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/matches', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

const getMatchById = async (id: number) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/matches/${id}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(error.message || 'Failed to fetch match');
    }

    return await response;
};

const createMatch = async (matchData: Match): Promise<Match> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/matches`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(matchData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create match');
    }

    return await response.json();
};

const updateMatch = async (id: string, matchData: Partial<Match>): Promise<Match> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/matches/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(matchData),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(error.message || 'Failed to update match');
    }

    return await response.json();
};

const getLatestMatches = async (limit?: number, teamId?: number) => {
    const queryParams = new URLSearchParams();

    if (limit) queryParams.append('limit', limit.toString());
    if (teamId) queryParams.append('teamId', teamId.toString());

    return await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/matches/latest?${queryParams.toString()}`,
        {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        }
    );
};

const getLatestMatchesByTeamId = async (teamId: number, limit = 5) => {
    return await getLatestMatches(limit, teamId);
};

const MatchService = {
    getAllMatches,
    getMatchById,
    updateMatch,
    createMatch,
    getLatestMatches,
    getLatestMatchesByTeamId,
};

export default MatchService;
