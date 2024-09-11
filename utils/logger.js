const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

// Define custom log format
const customFormat = format.printf(({ level, message, timestamp, stack }) =>
{
    return `${timestamp} ${level}: ${stack || message}`;
});

// Create a logger instance
const logger = createLogger({
    level: 'info', // Default log level
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Timestamp format
        format.errors({ stack: true }), // Include stack trace
        format.splat(),
        customFormat
    ),
    transports: [
        new transports.Console(), // Log to console
        new transports.DailyRotateFile({ // Log to daily rotated file
            filename: 'logs/application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '30d', // Keep logs for 30 days
            level: 'info'
        }),
        new transports.DailyRotateFile({ // Separate file for errors
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '30d',
            level: 'error'
        })
    ]
});

// In production, log only warnings and errors to the console
if (process.env.NODE_ENV === 'production')
{
    logger.add(new transports.Console({
        format: format.combine(
            format.colorize(), // Colorize output for readability
            customFormat
        ),
        level: 'warn'
    }));
}

module.exports = logger;
