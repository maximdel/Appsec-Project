import { Team } from '@types';

const getAllTeams = async () => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/teams', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

const getTeamById = async (teamId: number) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams/${teamId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

const updateTeam = async (team: Team) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams/update`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(team),
    });
};

const addPlayerToTeam = async (teamId: number, playerId: number) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams/${teamId}/addPlayer/${playerId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

const removePlayerFromTeam = async (teamId: number, playerId: number) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/teams/${teamId}/removePlayer/${playerId}`,
            {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.ok;
    } catch (error) {
        console.error('Error removing player from team:', error);
        return false;
    }
};

const switchCoach = async (teamId: number, coachId: number) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams/${teamId}/switchCoach/${coachId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export default {
    getAllTeams,
    getTeamById,
    updateTeam,
    addPlayerToTeam,
    removePlayerFromTeam,
    switchCoach,
};
