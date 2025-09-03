import { createLogger, format, transports } from 'winston';

const isProd = process.env.NODE_ENV === 'production';

const logger = createLogger({
    level: isProd ? 'info' : 'debug',
    format: isProd
        ? format.combine(
            format.timestamp(),
            format.json()
        )
        : format.combine(
            format.colorize(),
            format.simple()
        ),
    transports: [
        new transports.Console()
    ]
});

export default logger;
