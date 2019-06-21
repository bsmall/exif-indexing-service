import {format, transports} from 'winston';
import mkdirp from 'mkdirp';
import * as path from 'path';
import config from '../config';
import * as winston from "winston";

// If log folder doesn't exist, create it.
mkdirp(config.get('logs.logDirectory'), (err: any) => {
    if (err) {
        console.log('Problem creating log directory!');
        console.log(err);
    }
});

const logger = winston.createLogger({
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.File({
            level: config.get('logs.serverLog.logLevel'),
            filename: path.join(config.get('logs.logDirectory'), config.get('logs.serverLog.filename')),
            handleExceptions: true,
            maxsize: config.get('logs.serverLog.maxSizeBytes'),
            maxFiles: config.get('logs.serverLog.maxFiles')
        }),
        new transports.File({
            level: config.get('logs.serverErrorLog.logLevel'),
            filename: path.join(config.get('logs.logDirectory'), config.get('logs.serverErrorLog.filename')),
            handleExceptions: true,
            maxsize: config.get('logs.serverErrorLog.maxSizeBytes'),
            maxFiles: config.get('logs.serverErrorLog.maxFiles')
        })
    ]
});

// Output to console if not in production mode.
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        level: config.get('logs.serverConsoleLog.logLevel'),
        silent: config.get('logs.serverConsoleLog.silent'),
        handleExceptions: true,
        format: format.combine(
            format.colorize({all: true}),
            format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            format.printf(info => `${info.timestamp}  ${info.level}:  ${info.message}`)
        )
    }));
}


logger.debug('logger initialized.');

export default logger;
