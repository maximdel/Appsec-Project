import { Team } from '@types';

const getAllTeams = async () => {
    const token = JSON.parse(localStorage.getItem('loggedInUser') || '{}')?.token;

    return fetch(process.env.NEXT_PUBLIC_API_URL + '/teams', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
};

const getTeamById = async (teamId: number) => {
    const token = JSON.parse(localStorage.getItem('loggedInUser') || '{}')?.token;

    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams/${teamId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
};

const updateTeam = async (team: Team) => {
    const token = JSON.parse(localStorage.getItem('loggedInUser') || '{}')?.token;

    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams/update`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(team),
    });
};

const addPlayerToTeam = async (teamId: number, playerId: number) => {
    const token = JSON.parse(localStorage.getItem('loggedInUser') || '{}')?.token;

    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams/${teamId}/addPlayer/${playerId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
};

const removePlayerFromTeam = async (teamId: number, playerId: number) => {
    const token = JSON.parse(localStorage.getItem('loggedInUser') || '{}')?.token;

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/teams/${teamId}/removePlayer/${playerId}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
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
    const token = JSON.parse(localStorage.getItem('loggedInUser') || '{}')?.token;

    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams/${teamId}/switchCoach/${coachId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
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
