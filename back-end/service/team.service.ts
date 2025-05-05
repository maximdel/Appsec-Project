import teamDb from '../repository/team.db';
import userDb from '../repository/user.db';
import { Team } from '../model/team';
import { TeamInput } from '../types';
import { Role } from '@prisma/client';

const getAllTeams = async (): Promise<Team[]> => {
    return await teamDb.getAllTeams();
};

const getTeamsByName = async (name: string): Promise<Team[]> => {
    const teams = await teamDb.getTeamsByName(name);

    if (!teams) {
        throw new Error('Could not find any teams with that name');
    }

    return teams;
};

const getTeamById = async (id: string | number): Promise<Team> => {
    if (!id) {
        throw new Error('Team ID is required.');
    }

    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

    if (isNaN(numericId)) {
        throw new Error('Invalid Team ID. It must be a number.');
    }

    const team = await teamDb.getTeamById(numericId);

    if (!team) {
        throw new Error(`Team with ID ${numericId} not found.`);
    }

    return team;
};

const getTeamNameById = async (id: number): Promise<string | null> => {
    const team: Team | null = await teamDb.getTeamById(id);
    return team ? team.getName() : null;
};

const updateTeam = async (updateTeam: TeamInput): Promise<Team> => {
    const validNewData = new Team(updateTeam);

    const teamId = validNewData.getId();

    if (teamId === undefined) {
        throw new Error('Team ID is required.');
    }

    const team = await teamDb.getTeamById(teamId);

    if (!team) {
        throw new Error('Team not found');
    }

    const updatedTeam = await teamDb.updateTeam(validNewData);
    return updatedTeam;
};

const addPlayerToTeam = async (teamId: number, playerId: number): Promise<boolean> => {
    const team = await teamDb.getTeamById(teamId);
    const player = await userDb.getUserById(playerId);

    if (!team) {
        throw new Error('Team not found.');
    }
    if (!player) {
        throw new Error('Player not found.');
    }

    // Check if the player is already part of the team
    const isPlayerInTeam = team.getPlayers().some((p) => p.getId() === playerId);
    if (isPlayerInTeam) {
        throw new Error('Player is already in the team.');
    }

    await teamDb.addPlayerToTeam(teamId, playerId);

    return true;
};

const removePlayerFromTeam = async (teamId: number, playerId: number) => {
    const team = await teamDb.getTeamById(teamId);

    if (!team) {
        throw new Error('Team not found');
    }

    const player = await userDb.getUserById(playerId);

    if (!player) {
        throw new Error('Player not found');
    }

    return teamDb.removePlayerFromTeam(teamId, playerId);
};

const switchCoach = async (teamId: number, coachId: number): Promise<Team> => {
    const team = await getTeamById(teamId);
    if (!team) {
        throw new Error('Team not found.');
    }

    const user = await userDb.getUserById(coachId);
    if (!user) {
        throw new Error('User not found.');
    }

    await teamDb.switchCoach(teamId, coachId);

    return team;
};

export default {
    getTeamNameById,
    getTeamById,
    getAllTeams,
    updateTeam,
    addPlayerToTeam,
    removePlayerFromTeam,
    switchCoach,
};
