import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { expressjwt } from 'express-jwt';
import helmet from 'helmet';
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
