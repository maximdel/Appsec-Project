import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import { expressjwt } from 'express-jwt';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import goalRouter from './controller/goal.routes';
import matchRouter from './controller/match.routes';
import teamRouter from './controller/team.routes';
import userRouter from './controller/user.routes';
import userService from './service/user.service';
import { logger } from './util/logger';

dotenv.config();

const app = express();
app.use(helmet());

// HSTS for 1 year with subdomains included
app.use(
    helmet.hsts({
        maxAge: 31536000,
        includeSubDomains: true,
    })
);

// CSP: Only allow own origin for scripts/styles/images
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'"],
            imgSrc: ["'self'"],
            connectSrc: ["'self'"],
            objectSrc: ["'none'"],
            // Added after ZAP-test
            frameAncestors: ["'self'"],
            formAction: ["'self'"],
        },
    })
);

// For storing tokens in secure cookies instead of localStorage:
app.use(cookieParser());

dotenv.config();
const port = process.env.APP_PORT || 3000;

app.use(cors({ origin: 'http://localhost:8080', credentials: true }));

app.use(express.json());
// app.use((req, res, next) => {
//     logger.info('Incoming request', {
//         method: req.method,
//         url: req.originalUrl,
//         user: (req as any).auth?.username, // undefined if anonymous
//     });
//     next();
// });

app.use(
    expressjwt({
        secret: process.env.JWT_SECRET || 'default_secret',
        algorithms: ['HS256'],
        maxAge: `${process.env.JWT_EXPIRES_HOURS}h`, // rejects tokens older than this *since iat*
        issuer: 'courses_app', // ← validate your `iss` claim
        getToken: (req) => {
            return req.cookies?.token; // read token from the HttpOnly cookie
        },
    }).unless({
        path: [
            '/api-docs',
            /^\/api-docs\/.*/,
            '/users/register',
            '/users/login',
            '/users/reset-password',
            '/users/forgot-password',
            '/status',
        ],
    })
);

// JWT Rotation
// (seconds)
const TTL = Number(process.env.JWT_EXPIRES_HOURS) * 3600;
// if less than 15min left, rotate
const THRESHOLD = 15 * 60;

// Auto-refresh middleware

app.use(
    async (
        req: Request & { auth?: { username: string; role: string; exp: number; iat: number } },
        res: Response,
        next: NextFunction
    ) => {
        const token = req.cookies?.token;
        if (!token || !req.auth) {
            return next();
        }

        const now = Math.floor(Date.now() / 1000);
        const timeLeft = req.auth.exp - now;
        if (timeLeft <= 0 || timeLeft >= THRESHOLD) {
            return next();
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('Missing JWT_SECRET');
        }

        // issue a fresh token
        const newToken = jwt.sign({ username: req.auth.username, role: req.auth.role }, secret, {
            expiresIn: `${process.env.JWT_EXPIRES_HOURS}h`,
            issuer: 'courses_app',
        });

        // look up the numeric ID for logging
        let userId: number | 'unknown' = 'unknown';
        try {
            userId = await userService.getUserIdByUsername({ username: req.auth.username });
        } catch {
            // swallow lookup errors—you'll still reset the cookie below
        }

        logger.info('Token rotated', {
            userId,
            expiresInSeconds: timeLeft,
            ip: req.ip,
        });

        // reset the cookie with the same options you use on login
        res.cookie('token', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: TTL * 1000,
            path: '/',
        });

        next();
    }
);

// Register routers
app.use('/users', userRouter);
app.use('/matches', matchRouter);
app.use('/teams', teamRouter);
app.use('/goals', goalRouter);
app.get('/status', (req, res) => {
    res.json({ message: 'Back-end is running...' });
});

const swaggerOpts = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Courses API',
            version: '1.0.0',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./controller/*.routes.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOpts);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    // if we already sent a response, delegate to the default Express handler
    if (res.headersSent) {
        return next(err);
    }

    if (err.name === 'UnauthorizedError') {
        if (req.originalUrl !== '/users/me') {
            logger.warn('Unauthorized access attempt', {
                path: req.originalUrl,
                ip: req.ip,
                // username will likely be undefined
                user: (req as any).auth?.username,
            });
        }

        return res.status(401).json({ status: 'unauthorized', message: err.message });
    }

    if (err.name === 'CoursesError') {
        logger.info('Domain error', {
            message: err.message,
            path: req.originalUrl,
            user: (req as any).auth?.username,
        });
        return res.status(400).json({ status: 'domain error', message: err.message });
    }

    logger.error('Unhandled exception', {
        message: err.message,
        stack: err.stack,
        path: req.originalUrl,
        user: (req as any).auth?.username,
    });
    return res.status(400).json({ status: 'application error', message: err.message });
});

app.listen(port || 3000, () => {
    console.log(`GoalPro API is running on port ${port}.`);
});

export default app;
