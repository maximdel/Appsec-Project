import goalDb from '../repository/goal.db';

const validateGoalIds = async (goalIds: number[]): Promise<void> => {
    const goals = await goalDb.getGoalsByIds(goalIds);

    if (goals.length !== goalIds.length) {
        throw new Error('One or more goal IDs do not exist.');
    }
};

const getGoalsWithDetails = async (matchId: number) => {
    const goals = await goalDb.getGoalsWithDetails(matchId);
    if (goals.length === 0) {
        throw new Error('No goals were found for given ID.');
    }
    return goals;
};

const deleteGoal = async (goalId: number) => {
    if (!goalId || isNaN(goalId)) {
        throw new Error('Invalid goal ID');
    }
    const goals = await goalDb.getGoalsByIds([goalId]);
    if (!goals.length) {
        throw new Error('Goal not found');
    }
    return await goalDb.deleteGoal(goalId);
};

export default {
    validateGoalIds,
    getGoalsWithDetails,
    deleteGoal,
};
