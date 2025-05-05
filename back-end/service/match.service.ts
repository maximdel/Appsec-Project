import { Match } from '../model/match';
import matchDb from '../repository/match.db';

const getAllMatches = async (): Promise<Match[]> => {
    return await matchDb.getAllMatches();
};

const getMatchById = async (id: string): Promise<Match> => {
    const match = await matchDb.getMatchById(Number(id));
    if (!match) {
        throw new Error(`Match with id: ${id} does not exist.`);
    }
    return match;
};

// const createMatch = async (matchData: MatchInput, user: { role: Role }): Promise<Match> => {
//     if (user.role !== 'ADMIN' && user.role !== 'COACH') {
//         throw new Error('Unauthorized access');
//     }

//     // Ensure exactly two teams are provided
//     if (!matchData.teams || matchData.teams.length !== 2) {
//         throw new Error('Exactly two teams must be provided.');
//     }

//     // Validate each team ID
//     await Promise.all(
//         matchData.teams.map(async (team) => {
//             const teamExists = await teamService.getTeamById(team.teamId);
//             if (!teamExists) {
//                 throw new Error(`Team with ID ${team.teamId} does not exist.`);
//             }
//         })
//     );

//     // Validate goal IDs
//     await goalService.validateGoalIds(matchData.goals);

//     const match = {
//         date: matchData.date,
//         locationId: matchData.location,
//         teams: matchData.teams,
//         goals: matchData.goals,
//     };

//     const createdMatch = await matchDb.createMatch(match);
//     return Match.from(createdMatch);
// };

// const updateMatch = async (
//     id: number,
//     matchData: Partial<MatchInput>,
//     user: { role: Role }
// ): Promise<Match> => {
//     if (user.role !== 'ADMIN' && user.role !== 'COACH') {
//         throw new Error('Unauthorized access');
//     }

//     // Validate and prepare teams if provided
//     let teams;
//     if (matchData.teams) {
//         if (matchData.teams.length !== 2) {
//             throw new Error('A match must have exactly two teams.');
//         }

//         const teamIds = matchData.teams.map((team) => team.teamId);

//         const [team1, team2] = await Promise.all(teamIds.map((id) => teamService.getTeamById(id)));

//         if (!team1 || !team2) {
//             throw new Error('One or both team IDs do not exist.');
//         }

//         teams = [
//             { teamId: teamIds[0], isHome: true },
//             { teamId: teamIds[1], isHome: false },
//         ];
//     }

//     // Validate goal IDs if provided
//     if (matchData.goals) {
//         await goalService.validateGoalIds(matchData.goals);
//     }

//     // Prepare the data for the database update
//     const dbMatchData = {
//         date: matchData.date,
//         locationId: matchData.location,
//         teams,
//         goals: matchData.goals ? matchData.goals.map((goalId) => ({ id: goalId })) : undefined,
//     };

//     // Update the match in the database
//     const updatedMatch = await matchDb.updateMatch(id, dbMatchData);

//     return Match.from(updatedMatch);
// };

type MatchFilter = {
    teamId?: number;
    limit?: number;
};

const getLatestMatches = async ({ teamId, limit }: MatchFilter) => {
    if (limit !== undefined && limit <= 0) {
        throw new Error('Limit must be a positive number');
    }
    try {
        const matches = await matchDb.getLatestMatches({
            teamId: teamId,
            limit: limit || 5,
        });

        return matches;
    } catch (error) {
        console.error('Error fetching latest matches:', error);
        throw new Error('Failed to fetch latest matches.');
    }
};

export default {
    getAllMatches,
    getMatchById,
    // createMatch,
    // updateMatch,
    getLatestMatches,
};
