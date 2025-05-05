import { Match } from '../model/match';
import database from './database';

const getAllMatches = async (): Promise<Match[]> => {
    try {
        const matchesPrisma = await database.match.findMany({
            include: {
                location: true,
                goals: {
                    include: {
                        player: true,
                        team: true,
                    },
                },
                teams: {
                    include: {
                        team: true,
                        goals: {
                            include: {
                                player: true,
                                team: true,
                            },
                        },
                    },
                },
            },
        });

        return matchesPrisma.map((matchPrisma) => Match.from(matchPrisma));
    } catch (error) {
        console.error('Error fetching matches:', error);
        throw new Error('Database error, See server log for details.');
    }
};

const getMatchById = async (id: number) => {
    try {
        const matchPrisma = await database.match.findUnique({
            where: { id },
            include: {
                location: true,
                goals: {
                    include: {
                        player: true,
                        team: true,
                    },
                },
                teams: {
                    include: {
                        team: true,
                        goals: {
                            include: {
                                player: true,
                                team: true,
                            },
                        },
                    },
                },
            },
        });

        if (!matchPrisma) return null;

        return Match.from(matchPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Error retrieving match from the database.');
    }
};

const getLatestMatchesByTeamId = async (teamId: number) => {
    try {
        const matches = await database.match.findMany({
            where: {
                teams: {
                    some: {
                        teamId: teamId,
                    },
                },
            },
            include: {
                location: true,
                teams: {
                    include: {
                        team: true,
                    },
                },
            },
            orderBy: {
                date: 'desc',
            },
            take: 5,
        });

        return matches;
    } catch (error) {
        console.error('Error fetching matches:', error);
        throw new Error('Database error, See server log for details.');
    }
};

const createMatch = async ({
    date,
    locationId,
    teams,
    goals,
}: {
    date: Date;
    locationId: number;
    teams: { teamId: number }[];
    goals: number[];
}) => {
    try {
        return await database.match.create({
            data: {
                date,
                location: {
                    connect: {
                        id: locationId,
                    },
                },
                teams: {
                    create: teams.map((team) => ({
                        team: {
                            connect: {
                                id: team.teamId,
                            },
                        },
                    })),
                },
                goals: {
                    connect: goals.map((goalId) => ({ id: goalId })),
                },
            },
            include: {
                location: true,
                goals: true,
                teams: {
                    include: {
                        team: true,
                    },
                },
            },
        });
    } catch (error) {
        console.error('Error creating match in database:', error);
        throw new Error('Database error. See server logs for details.');
    }
};

const updateMatch = async (
    id: number,
    matchData: {
        date?: Date;
        locationId?: number;
        teams?: { teamId: number; isHome: boolean }[];
        goals?: { id: number }[];
    }
) => {
    const updatedMatch = await database.match.update({
        where: { id },
        data: {
            date: matchData.date,
            location: matchData.locationId ? { connect: { id: matchData.locationId } } : undefined,
            teams: matchData.teams
                ? {
                      deleteMany: {}, // Clear existing teams
                      create: matchData.teams.map((team) => ({
                          team: { connect: { id: team.teamId } },
                          isHome: team.isHome,
                      })),
                  }
                : undefined,
            goals: matchData.goals
                ? {
                      connect: matchData.goals,
                  }
                : undefined,
        },
        include: {
            location: true,
            goals: true,
            teams: { include: { team: true } },
        },
    });

    return updatedMatch;
};

type MatchFilter = {
    teamId?: number;
    limit: number;
};

const getLatestMatches = async ({ teamId, limit }: MatchFilter) => {
    try {
        const matches = await database.match.findMany({
            where: teamId
                ? { teams: { some: { teamId: teamId } } }
                : {}, // Fetch all matches if no teamId is provided
            orderBy: { date: 'desc' },
            take: limit, // Apply limit
            include: {
                location: true,
                goals: {
                    include: {
                        player: { select: { firstName: true, lastName: true } },
                        team: { select: { id: true, name: true } },
                    },
                },
                teams: {
                    include: {
                        team: {
                            select: { id: true, name: true, description: true },
                        },
                        goals: true,
                    },
                },
            },
        });

        return matches;
    } catch (error) {
        console.error('Error querying matches:', error);
        throw new Error('Failed to retrieve matches from database.');
    }
};


export default {
    getAllMatches,
    getMatchById,
    createMatch,
    updateMatch,
    getLatestMatches,
    getLatestMatchesByTeamId,
};
