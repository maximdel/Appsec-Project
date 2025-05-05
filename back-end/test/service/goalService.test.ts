import goalDb from '../../repository/goal.db';
import goalService from '../../service/goal.service';

jest.mock('../../repository/goal.db');

describe('GoalService Tests', () => {
    let mockGetGoalsByIds: jest.Mock;
    let mockGetGoalsWithDetails: jest.Mock;
    let mockDeleteGoal: jest.Mock;

    beforeEach(() => {
        mockGetGoalsByIds = jest.fn();
        mockGetGoalsWithDetails = jest.fn();
        mockDeleteGoal = jest.fn();

        goalDb.getGoalsByIds = mockGetGoalsByIds;
        goalDb.getGoalsWithDetails = mockGetGoalsWithDetails;
        goalDb.deleteGoal = mockDeleteGoal;

        jest.clearAllMocks();
    });

    describe('validateGoalIds', () => {
        it('should validate successfully if all goal IDs exist', async () => {
            // given
            const goalIds = [1, 2, 3];
            const mockGoals = [
                { id: 1, time: 10 },
                { id: 2, time: 20 },
                { id: 3, time: 30 },
            ];
            mockGetGoalsByIds.mockResolvedValue(mockGoals);

            // when
            await goalService.validateGoalIds(goalIds);

            // then
            expect(mockGetGoalsByIds).toHaveBeenCalledWith(goalIds);
        });

        it('should throw an error if any goal ID does not exist', async () => {
            // given
            const goalIds = [1, 2, 3];
            const mockGoals = [
                { id: 1, time: 10 },
                { id: 2, time: 20 },
            ];
            mockGetGoalsByIds.mockResolvedValue(mockGoals);

            // when / then
            await expect(goalService.validateGoalIds(goalIds)).rejects.toThrow(
                'One or more goal IDs do not exist.'
            );
            expect(mockGetGoalsByIds).toHaveBeenCalledWith(goalIds);
        });
    });

    describe('getGoalsWithDetails', () => {
        it('should return goals if found for a match ID', async () => {
            // given
            const matchId = 1;
            const mockGoals = [
                { id: 1, time: 15, matchId: 1 },
                { id: 2, time: 45, matchId: 1 },
            ];
            mockGetGoalsWithDetails.mockResolvedValue(mockGoals);

            // when
            const result = await goalService.getGoalsWithDetails(matchId);

            // then
            expect(mockGetGoalsWithDetails).toHaveBeenCalledWith(matchId);
            expect(result).toEqual(mockGoals);
        });

        it('should throw an error if no goals are found for the match ID', async () => {
            // given
            const matchId = 1;
            mockGetGoalsWithDetails.mockResolvedValue([]);

            // when / then
            await expect(goalService.getGoalsWithDetails(matchId)).rejects.toThrow(
                'No goals were found for given ID.'
            );
            expect(mockGetGoalsWithDetails).toHaveBeenCalledWith(matchId);
        });
    });

    describe('deleteGoal', () => {
        it('should delete a goal if the goal ID is valid', async () => {
            // given
            const goalId = 1;
            const mockGoal = [{ id: 1, time: 15, matchId: 1 }];
            mockGetGoalsByIds.mockResolvedValue(mockGoal);
            mockDeleteGoal.mockResolvedValue(true);

            // when
            const result = await goalService.deleteGoal(goalId);

            // then
            expect(mockGetGoalsByIds).toHaveBeenCalledWith([goalId]);
            expect(mockDeleteGoal).toHaveBeenCalledWith(goalId);
            expect(result).toBe(true);
        });

        it('should throw an error if the goal ID is invalid (NaN)', async () => {
            // when / then
            await expect(goalService.deleteGoal(NaN)).rejects.toThrow('Invalid goal ID');
            expect(mockGetGoalsByIds).not.toHaveBeenCalled();
            expect(mockDeleteGoal).not.toHaveBeenCalled();
        });

        it('should throw an error if the goal is not found', async () => {
            // given
            const goalId = 999;
            mockGetGoalsByIds.mockResolvedValue([]);

            // when / then
            await expect(goalService.deleteGoal(goalId)).rejects.toThrow('Goal not found');
            expect(mockGetGoalsByIds).toHaveBeenCalledWith([goalId]);
            expect(mockDeleteGoal).not.toHaveBeenCalled();
        });
    });
});
