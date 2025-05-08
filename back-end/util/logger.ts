import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

const textFormat = format.combine(
    // human-friendly timestamp
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.colorize({ all: true }),
    format.printf(({ timestamp, level, message, ...meta }) => {
        // Print the additional data
        const metaStr = Object.keys(meta).length ? ' ' + JSON.stringify(meta) : '';
        return `${timestamp} ${level}: ${message}${metaStr}`;
    })
);

export const logger = createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: textFormat,
    transports: [
        // console with colors
        new transports.Console(),
        new transports.DailyRotateFile({
            dirname: 'logs',
            filename: 'app-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
            zippedArchive: true,
            format: textFormat,
        }),
    ],
    exitOnError: false,
});
