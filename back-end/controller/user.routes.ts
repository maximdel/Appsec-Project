/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         firstName:
 *           type: string
 *           example: "John"
 *         lastName:
 *           type: string
 *           example: "Doe"
 *         email:
 *           type: string
 *           example: "john.doe@example.com"
 *         username:
 *           type: string
 *           example: "johndoe"
 *         password:
 *           type: string
 *           example: "securepassword123"
 *         description:
 *           type: string
 *           example: "An enthusiastic football player."
 *         role:
 *           type: string
 *           enum: [ADMIN, COACH, PLAYER, USER]
 *           example: "PLAYER"
 *         birthDate:
 *           type: string
 *           format: date-time
 *           example: "1990-01-01T00:00:00.000Z"
 *     Team:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Team A"
 *         description:
 *           type: string
 *           example: "A competitive football team."
 *         coach:
 *           $ref: '#/components/schemas/User'
 *         players:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *     AuthenticationRequest:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           example: "admin"
 *         password:
 *           type: string
 *           example: "secure12345"
 *     AuthenticationResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5c..."
 *         username:
 *           type: string
 *           example: "admin"
 *         fullname:
 *           type: string
 *           example: "Admin UCLL"
 *         role:
 *           type: string
 *           example: "ADMIN"
 *     Error:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "error"
 *         errorMessage:
 *           type: string
 *           example: "An error occurred while processing your request."
 */

import express, { NextFunction, Request, Response } from 'express';

import rateLimit from 'express-rate-limit';
import userService from '../service/user.service';
import { Role, UserInput } from '../types';

const userRouter = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a list of all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successfully retrieved a list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
userRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { role: Role } };
        const { role } = request.auth;
        const users = await userService.getAllUsers({ role });
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/players:
 *   get:
 *     summary: Retrieve a list of players
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successfully retrieved a list of players
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
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
 *                   example: "An error occurred while fetching players."
 */

userRouter.get('/players', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const players = await userService.getAllPlayers();
        res.status(200).json(players);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/{username}:
 *   get:
 *     summary: Retrieve a user by username
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique username of the user
 *     responses:
 *       200:
 *         description: Successfully retrieved user details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
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
 *                   example: "User not found."
 *       500:
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

userRouter.get('/:username', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const username = req.params.username;
        const user = await userService.getUserByUsername({ username });
        res.json(user);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user's information
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User information updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
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
 *                   example: "User not found."
 */

userRouter.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.params.id, 10);
        const editedUser = req.body;

        const updatedUser = await userService.updateUser(userId, editedUser);
        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
});

// Brute-force mitigation:
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: {
        status: 'error',
        message: 'Too many login attempts from this IP, please try again after 15 minutes',
    },
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Authenticate a user and return a JWT token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthenticationRequest'
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthenticationResponse'
 *       400:
 *         description: Invalid credentials or other error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

userRouter.post('/login', loginLimiter, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userInput = <UserInput>req.body;
        const response = await userService.authenticate(userInput);
        res.status(200).json({ message: 'Authentication successful', ...response });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error or other issue
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

userRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userInput = <UserInput>req.body;
        const user = await userService.createUser(userInput);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/role/{role}:
 *   get:
 *     summary: Retrieve a list of users by role
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *           enum: [ADMIN, COACH, PLAYER, USER]
 *         description: The role of the users to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved a list of users with the specified role
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request due to an invalid role parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
userRouter.get('/role/:role', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const role = req.params.role;
        const users = await userService.getUsersByRole(role as Role);
        res.json(users);
    } catch (error) {
        next(error);
    }
});

export default userRouter;
