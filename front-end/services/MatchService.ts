import { Match } from '@types';

const getAllMatches = async () => {
    const token = JSON.parse(localStorage.getItem('loggedInUser') || '{}')?.token;

    return fetch(process.env.NEXT_PUBLIC_API_URL + '/matches', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
};

const getMatchById = async (id: number) => {
    const token = JSON.parse(localStorage.getItem('loggedInUser') || '{}')?.token;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/matches/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(error.message || 'Failed to fetch match');
    }

    return await response;
};

const createMatch = async (matchData: Match): Promise<Match> => {
    const token = JSON.parse(localStorage.getItem('loggedInUser') || '{}')?.token;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/matches`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
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
    const token = JSON.parse(localStorage.getItem('loggedInUser') || '{}')?.token;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/matches/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
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
    const token = JSON.parse(localStorage.getItem('loggedInUser') || '{}')?.token;

    const queryParams = new URLSearchParams();

    if (limit) queryParams.append('limit', limit.toString());
    if (teamId) queryParams.append('teamId', teamId.toString());

    return await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/matches/latest?${queryParams.toString()}`,
        {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
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
