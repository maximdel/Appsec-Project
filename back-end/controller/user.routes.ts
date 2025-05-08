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

import { UnauthorizedError } from 'express-jwt/dist/errors/UnauthorizedError';
import rateLimit from 'express-rate-limit';
import userService from '../service/user.service';
import { Role, UserInput } from '../types';
import { logger } from '../util/logger';

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
    windowMs: 15 * 60 * 1000,
    max: 5,
    handler: async (req, res, next) => {
        // pull the username the user just tried
        const username = (req.body as any)?.username as string | undefined;
        let userId: number | 'unknown' = 'unknown';

        if (username) {
            try {
                const user = await userService.getUserIdByUsername({ username });
                userId = user ?? 'unknown';
            } catch {}
        }

        logger.warn('Too many login attempts', {
            user: userId,
            ip: req.ip,
        });

        res.status(429).json({
            status: 'error',
            message: 'Too many login attempts, please try again later.',
        });
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
    const userInput = req.body as UserInput;
    const user = await userService.getUserByUsername({ username: userInput.username });
    const userId = user.id;

    try {
        const auth = await userService.authenticate(userInput);
        const isProd = process.env.NODE_ENV === 'production';

        if (user.role === 'ADMIN') {
            logger.info('ADMIN Login successful', { user: userId, ip: req.ip });
        } else {
            logger.info('Login successful', { user: userId, ip: req.ip });
        }
        return res
            .cookie('token', auth.token, {
                httpOnly: true,
                secure: isProd, // only send over HTTPS in production
                sameSite: isProd ? 'none' : 'lax', // none for cross-site fetches when secure, lax in dev
                maxAge: 1000 * 60 * 60 * Number(process.env.JWT_EXPIRES_HOURS),
                // ensure it’s sent on every route
                path: '/',
            })
            .status(200)
            .json({
                message: 'Authentication successful',
                username: auth.username,
                fullname: auth.fullname,
                role: auth.role,
                ...(auth.teamId && { teamId: auth.teamId }),
            });
    } catch (error: any) {
        if (user.role === 'ADMIN') {
            logger.warn('ADMIN Login failed', { user: userId, ip: req.ip, reason: error.message });
        }
        return res.status(401).json({ status: 'error', message: error.message });
    }
});

userRouter.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });
    res.json({ message: 'Logged out successfully.' });
});

// Reads JWT from cookie, looks up user and returns public user object
userRouter.get('/me', async (req: Request & { auth?: { username: string } }, res, next) => {
    // If express-jwt failed auth, it will skip you and go straight to the error handler.
    // So at this point, req.auth is always populated.
    try {
        if (!req.auth) {
            throw new UnauthorizedError('credentials_required', {
                message: 'Not authenticated',
            });
        }

        const user = await userService.getUserByUsername({ username: req.auth.username });
        // Only send one response:
        return res.json(user);
    } catch (err) {
        // And don’t send another response here—just forward to the error middleware:
        return next(err);
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

userRouter.post('/register', async (req, res, next) => {
    const userInput = req.body as UserInput;

    try {
        const newUser = await userService.createUser(userInput);

        logger.info('User registered', {
            userId: newUser.id,
            username: newUser.username,
            ip: req.ip,
        });

        // 201 is more correct for creation
        return res.status(201).json(newUser);
    } catch (err: any) {
        // log the *attempted* username, not the (nonexistent) newUser
        logger.info('User registration failed', {
            username: userInput.username,
            ip: req.ip,
            reason: err.message,
        });
        // if you want to convert this to a 409 conflict instead of a 400:
        if (err.message.includes('already registered')) {
            return res.status(409).json({ status: 'error', message: err.message });
        }
        return next(err);
    }
});

// Remove user addition for Application Security
userRouter.delete('/:username', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username } = req.params;

        // 1) lookup user to delete (so we can report its ID)
        const deletedUserId = await userService.getUserIdByUsername({ username });

        // 2) perform the delete
        const message = await userService.removeUser({ username });

        // 3) grab the admin’s username out of the JWT…
        const adminUsername = (req as Request & { auth?: { username: string } }).auth?.username;

        // …then look up their numeric ID the same way
        const adminId = adminUsername
            ? await userService.getUserIdByUsername({ username: adminUsername })
            : undefined;

        logger.info('User deleted', {
            admin: adminId,
            deletedUserId,
            ip: req.ip,
        });

        res.status(200).json({ message });
    } catch (err) {
        next(err);
    }
});

// 1) Kick off the flow (by username)
userRouter.post('/forgot-password', async (req, res, next) => {
    try {
        const { username } = req.body as { username: string };
        const msg = await userService.forgotPassword({ username });
        res.json({ message: msg });
    } catch (err) {
        next(err);
    }
});

// 2) Complete the flow
userRouter.post('/reset-password', async (req, res, next) => {
    const { token, newPassword } = req.body as {
        token: string;
        newPassword: string;
    };

    const { username } = await userService.findByResetToken({ token });
    const id = await userService.getUserIdByUsername({ username });
    try {
        const msg = await userService.resetPassword({ token, newPassword });

        if (id) {
            logger.info('Password reset completed', {
                user: id,
                ip: req.ip,
            });
        }
        res.json({ message: msg });
    } catch (err: any) {
        if (id) {
            logger.warn('Password reset failed', {
                user: id,
                ip: req.ip,
                reason: err.message,
            });
        }
        next(err);
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
