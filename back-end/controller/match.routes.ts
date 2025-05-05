/**
 * @swagger
 * components:
 *   schemas:
 *     Match:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         date:
 *           type: string
 *           format: date-time
 *           example: "2024-12-01T15:00:00Z"
 *         location:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             country:
 *               type: string
 *               example: "Belgium"
 *             city:
 *               type: string
 *               example: "Brussels"
 *             streetName:
 *               type: string
 *               example: "Rue de la Loi"
 *             zipCode:
 *               type: string
 *               example: "1000"
 *             number:
 *               type: string
 *               example: "16"
 *         teams:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Team' # Ensure 'Team' schema exists
 *         goals:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Goal' # Ensure 'Goal' schema exists
 */

import express, { NextFunction, Request, Response } from 'express';
import matchService from '../service/match.service';

const matchRouter = express.Router();

/**
 * @swagger
 * /matches:
 *   get:
 *     summary: Retrieve a list of all matches
 *     tags: [Matches]
 *     responses:
 *       200:
 *         description: Successfully retrieved a list of matches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Match'
 *       400:
 *         description: Bad request due to an error
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
 *                   example: "An error occurred."
 */
matchRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const matches = await matchService.getAllMatches();
        res.status(200).json(matches);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /matches/latest:
 *   get:
 *     summary: Retrieve the latest matches with an optional limit
 *     tags: [Matches]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *         description: The number of matches to retrieve (default is 10)
 *     responses:
 *       200:
 *         description: Successfully retrieved the latest matches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Match'
 *       400:
 *         description: Invalid limit parameter
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
 *                   example: "Invalid request. Limit must be a positive number."
 *       500:
 *         description: Server error
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
 *                   example: "Failed to fetch latest matches."
 */
matchRouter.get('/latest', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { teamId, limit } = req.query;

        const matches = await matchService.getLatestMatches({
            teamId: teamId ? Number(teamId) : undefined,
            limit: limit ? Number(limit) : 5,
        });

        return res.status(200).json(matches);
    } catch (error) {
        next(error);
    }
});
/**
 * @swagger
 * /matches/{id}:
 *   get:
 *     summary: Retrieve a match by ID
 *     tags: [Matches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the match
 *     responses:
 *       200:
 *         description: Match data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Match'
 *       404:
 *         description: Match not found
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
 *                   example: "Match not found."
 *       400:
 *         description: Bad request due to an error
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
 *                   example: "An error occurred."
 */
matchRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const matchId = req.params.id as string;
        const match = await matchService.getMatchById(matchId);
        res.status(200).json(match);
    } catch (error) {
        next(error);
    }
});

// /**
//  * @swagger
//  * /matches:
//  *   post:
//  *     summary: Create a new match
//  *     tags: [Matches]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/Match'
//  *     responses:
//  *       201:
//  *         description: Match created successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Match'
//  *       400:
//  *         description: Error creating match
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 status:
//  *                   type: string
//  *                   example: "error"
//  *                 errorMessage:
//  *                   type: string
//  *                   example: "Invalid request data"
//  */
// matchRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
//     const newMatch = req.body;

//     const request = req as Request & { auth: { role: Role } };
//     const { role } = request.auth;

//     try {
//         const match = await matchService.createMatch(newMatch, { role });
//         res.status(201).json(match);
//     } catch (error) {
//         next(error);
//     }
// });

// /**
//  * @swagger
//  * /matches/{id}:
//  *   put:
//  *     summary: Update match information
//  *     tags: [Matches]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Match ID
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               date:
//  *                 type: string
//  *                 format: date-time
//  *                 example: "2024-12-01T15:00:00Z"
//  *               location:
//  *                 type: integer
//  *                 description: Location ID
//  *                 example: 1
//  *               homeTeam:
//  *                 type: integer
//  *                 description: Home team ID
//  *                 example: 2
//  *               awayTeam:
//  *                 type: integer
//  *                 description: Away team ID
//  *                 example: 3
//  *               goals:
//  *                 type: array
//  *                 description: List of goal IDs
//  *                 items:
//  *                   type: integer
//  *                   example: 101
//  *     responses:
//  *       200:
//  *         description: Match updated successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Match'
//  *       404:
//  *         description: Match not found
//  *       400:
//  *         description: Error updating match
//  */
// matchRouter.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { id } = req.params;
//         const matchData: Partial<MatchInput> = req.body;

//         const request = req as Request & { auth: { role: Role } };
//         const user = request.auth;

//         const updatedMatch = await matchService.updateMatch(Number(id), matchData, user);

//         res.status(200).json(updatedMatch);
//     } catch (error) {
//         next(error);
//     }
// });
export default matchRouter;
