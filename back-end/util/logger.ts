import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

const textFormat = format.combine(
    // human-friendly timestamp
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    // colorize the level name in console only:
    format.colorize({ all: true }),
    // this builds a single string per log
    format.printf(({ timestamp, level, message, ...meta }) => {
        // if there’s extra metadata, stringify it
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
        // file transport stays JSON or you can also use textFormat
        new transports.DailyRotateFile({
            dirname: 'logs',
            filename: 'app-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
            zippedArchive: true,
            format: textFormat, // ← switch to readable text files too
        }),
    ],
    exitOnError: false,
});
