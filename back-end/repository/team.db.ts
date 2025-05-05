import { Team } from '../model/team';
import database from './database';

const getAllTeams = async (): Promise<Team[]> => {
    try {
        const teamsPrisma = await database.team.findMany({
            include: {
                coach: true,
                players: true,
            },
        });
        return teamsPrisma.map((teamPrisma) => Team.from(teamPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error, See server log for details.');
    }
};

const getTeamById = async (id: number): Promise<Team | null> => {
    if (!id || typeof id !== 'number') {
        throw new Error('Invalid team ID provided.');
    }

    try {
        const teamPrisma = await database.team.findUnique({
            where: {
                id: id,
            },
            include: {
                coach: true,
                players: true,
            },
        });

        return teamPrisma ? Team.from(teamPrisma) : null;
    } catch (error) {
        console.error('Error in getTeamById:', error);
        throw new Error('Database error, see server log for details.');
    }
};

const addTeam = async (team: Team): Promise<Team> => {
    try {
        const teamPrisma = await database.team.create({
            data: {
                name: team.getName(),
                coach: team.getCoach() ? { connect: { id: team.getCoach()?.getId() } } : undefined,
                players: {
                    connect: team.getPlayers().map((player) => ({ id: player.getId() })),
                },
                description: team.getDescription(),
            },
            include: {
                coach: true,
                players: true,
            },
        });
        return Team.from(teamPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const updateTeam = async (updateTeam: Team): Promise<Team> => {
    try {
        const updateData: any = {
            name: updateTeam.getName(),
            description: updateTeam.getDescription(),
        };

        const teamPrisma = await database.team.update({
            where: {
                id: updateTeam.getId(), 
            },
            data: updateData, 
            include: {
                coach: true,
                players: true, 
            },
        });

        return Team.from(teamPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};


const addPlayerToTeam = async (teamId: number, playerId: number): Promise<boolean> => {
    try {
        await database.team.update({
            where: {
                id: teamId,
            },
            data: {
                players: {
                    connect: {
                        id: playerId,
                    },
                },
            },
        });

        await database.user.update({
            where: {
                id: playerId,
            },
            data: {
                role: 'PLAYER',
            },
        });
        return true;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const removePlayerFromTeam = async (teamId: number, playerId: number): Promise<boolean> => {
    try {
        await database.team.update({
            where: {
                id: teamId,
            },
            data: {
                players: {
                    disconnect: {
                        id: playerId,
                    },
                },
            },
        });

        await database.user.update({
            where: {
                id: playerId,
            },
            data: {
                role: 'USER',
            },
        });

        return true;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getTeamsByName = async (name: string): Promise<Team[]> => {
    try {
        const teamsPrisma = await database.team.findMany({
            where: {
                name: name,
            },
            include: {
                coach: true,
                players: true,
            },
        });
        return teamsPrisma.map((teamPrisma) => Team.from(teamPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const removeTeam = async (id: number): Promise<void> => {
    try {
        await database.team.delete({
            where: {
                id: id,
            },
        });
    } catch (error) {
        console.error(error);
        throw new Error('Database error, See server log for details.');
    }
};

const switchCoach = async (teamId: number, coachId: number) => {
    try {
        const team = await database.team.findUnique({
            where: { id: teamId },
            include: { coach: true },
        });

        if (!team) {
            throw new Error('Team not found.');
        }

        const currentCoachId = team.coach?.id;

        if (currentCoachId) {
            await database.user.update({
                where: { id: currentCoachId },
                data: { role: 'USER' },
            });
        }

        await database.team.update({
            where: { id: teamId },
            data: {
                coach: {
                    connect: { id: coachId },
                },
            },
        });

        await database.user.update({
            where: { id: coachId },
            data: { role: 'COACH' },
        });

        return true;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export default {
    getAllTeams,
    getTeamById,
    addTeam,
    updateTeam,
    getTeamsByName,
    removeTeam,
    addPlayerToTeam,
    removePlayerFromTeam,
    switchCoach,
};
