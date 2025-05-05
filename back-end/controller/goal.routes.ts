import express, { NextFunction, Request, Response } from 'express';

import GoalService from '../service/goal.service';
import { Role } from '../types';

const goalRouter = express.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     Goal:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 260
 *         time:
 *           type: integer
 *           description: The minute the goal was scored
 *           example: 45
 *         matchId:
 *           type: integer
 *           description: ID of the match where the goal was scored
 *           example: 2
 *         teamId:
 *           type: integer
 *           description: ID of the team that scored the goal
 *           example: 1
 *         playerId:
 *           type: integer
 *           description: ID of the player who scored the goal
 *           example: 3
 *         player:
 *           $ref: '#/components/schemas/User'
 *         team:
 *           $ref: '#/components/schemas/Team'
 */

/**
 * @swagger
 * /goals/match/{matchId}:
 *   get:
 *     summary: Retrieve all goals for a specific match
 *     tags: [Goals]
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the match
 *     responses:
 *       200:
 *         description: A list of goals for the specified match
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Goal'
 *       400:
 *         description: Invalid match ID supplied
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 errorMessage:
 *                   type: string
 *                   example: "Invalid match ID"
 *       500:
 *         description: Server error occurred while fetching goals
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch goal details"
 */
goalRouter.get('/match/:matchId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { matchId } = req.params;
        const goals = await GoalService.getGoalsWithDetails(Number(matchId));
        res.json(goals);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /goals/{goalId}:
 *   delete:
 *     summary: Delete a goal by ID
 *     tags: [Goals]
 *     parameters:
 *       - in: path
 *         name: goalId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the goal to delete
 *     responses:
 *       200:
 *         description: Goal successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 time:
 *                   type: integer
 *                   example: 45
 *                 matchId:
 *                   type: integer
 *                   example: 2
 *                 teamId:
 *                   type: integer
 *                   example: 1
 *                 playerId:
 *                   type: integer
 *                   example: 3
 *       400:
 *         description: Invalid goal ID supplied
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 errorMessage:
 *                   type: string
 *                   example: "Invalid goal ID"
 *       500:
 *         description: Server error occurred while deleting the goal
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to delete goal"
 */
goalRouter.delete('/:goalId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { goalId } = req.params;
        const deletedGoal = await GoalService.deleteGoal(Number(goalId));
        return res.status(200).json(deletedGoal);
    } catch (error) {
        next(error);
    }
});

export default goalRouter;