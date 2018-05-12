'use strict';

const { createLogger, format, transports } = require('winston');
const { env, level } = require('./config');

const { printf } = format;

const customFormat = printf(({ timestamp, label, level, message }) => {
  const ts = timestamp.slice(0, 19).replace('T', ' ');
  return `${ts} [${label}] ${level}: ${message}`;
});

const { combine, colorize, timestamp, label } = format;
const logger = createLogger({
  format: combine(label({ label: 'auth' }), timestamp(), customFormat),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' }),
  ],
});

// If we're not in production then log to the `console`
if (env === 'development' || env === 'test') {
  logger.add(
    new transports.Console({
      format: combine(colorize(), customFormat),
    })
  );
}

logger.level = level;

module.exports = logger;
