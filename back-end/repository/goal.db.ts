import database from './database';

const getGoalsByIds = async (goalIds: number[]) => {
    return await database.goal.findMany({
        where: {
            id: { in: goalIds },
        },
    });
};

const getGoalsWithDetails = async (matchId: number) => {
    try {
        const goals = await database.goal.findMany({
            where: { matchId },
            include: {
                player: { select: { firstName: true, lastName: true } },
                team: { select: { id: true, name: true } },
            },
        });
        return goals;
    } catch (error) {
        console.error(error);
        throw new Error('Database error, See server log for details.');
    }
};

const deleteGoal = async (goalId: number) => {
    try {
        await database.goal.delete({
            where: { id: goalId },
        });
        return { message: 'Goal deleted successfully' };
    } catch (error) {
        console.error(error);
        throw new Error('Database error, See server log for details.');
    }
};

export default {
    getGoalsByIds,
    getGoalsWithDetails,
    deleteGoal,
};
