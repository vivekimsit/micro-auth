'use strict';

const { createLogger, format, transports } = require('winston');
const config = require('../config');

const { combine, colorize, timestamp, label, printf } = format;

const customFormat = printf(info => {
  const { timestamp, label, level, message } = info;
  const ts = timestamp.slice(0, 19).replace('T', ' ');
  return `${ts} [${label}] ${level}: ${message}`;
});

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
if (config.env !== 'production') {
  logger.add(
    new transports.Console({
      format: combine(
        colorize(),
        customFormat
        // prettyPrint(),
      ),
    })
  );
}

logger.level = config.logger.level;

module.exports = logger;
