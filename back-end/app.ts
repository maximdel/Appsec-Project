import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { expressjwt } from 'express-jwt';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import goalRouter from './controller/goal.routes';
import matchRouter from './controller/match.routes';
import teamRouter from './controller/team.routes';
import userRouter from './controller/user.routes';

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
        },
    })
);

// For storing tokens in secure cookies instead of localStorage:
app.use(cookieParser());

dotenv.config();
const port = process.env.APP_PORT || 3000;

app.use(cors({ origin: 'http://localhost:8080', credentials: true }));

app.use(express.json());

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
    (
        req: Request & { auth?: { username: string; role: string; exp: number; iat: number } },
        res: Response,
        next: NextFunction
    ) => {
        const token = req.cookies.token;
        if (!token || !req.auth) {
            return next();
        }

        const now = Math.floor(Date.now() / 1000);
        const timeLeft = req.auth.exp - now;

        const SECRET = process.env.JWT_SECRET;
        if (!SECRET) {
            throw new Error('Missing JWT_SECRET environment variable');
        }
        // only rotate if there’s still some life left, but under the threshold
        if (timeLeft > 0 && timeLeft < THRESHOLD) {
            // re-issue a fresh token with same payload
            const newToken = jwt.sign(
                { username: req.auth.username, role: req.auth.role },
                SECRET,
                { expiresIn: `${process.env.JWT_EXPIRES_HOURS}h`, issuer: 'courses_app' }
            );
            // reset the cookie (same flags you use on login)
            res.cookie('token', newToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: TTL * 1000,
                path: '/',
            });
        }

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
        res.status(401).json({ status: 'unauthorized', message: err.message });
    } else if (err.name === 'CoursesError') {
        res.status(400).json({ status: 'domain error', message: err.message });
    } else {
        res.status(400).json({ status: 'application error', message: err.message });
    }
});

app.listen(port || 3000, () => {
    console.log(`GoalPro API is running on port ${port}.`);
});

export default app;
