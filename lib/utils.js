'use strict';

const boom = require('boom');

const logger = require('./logger');
const debug = require('debug')('microauth:utils');

/**
 * Notice that when not calling "next" in an error-handling function,
 * you are responsible for writing (and ending) the response.
 * Otherwise those requests will "hang" and will not be eligible for
 * garbage collection.
 */
const catchAsyncErrors = middleware => (req, res, next) =>
  Promise.resolve(middleware(req, res, next)).catch(err => {
    // eslint-disable-line
    debug(err.stack)
    if (err.isJoi) {
      const message = err.details.map(detail => detail.message).join(', ');
      return next(boom.badRequest(message));
    }
    if (!err.isBoom) {
      return next(boom.badImplementation(err));
    }
    next(err);
  });

function errorHandler(err, req, res, next) {
  res.status(err.output.statusCode).json(err.output.payload);
}

function logErrors(err, req, res, next) {
  logger.error(err.stack); // eslint-disable-line
  next(err);
}

function logRequests(req, res, next) {
  const startTime = new Date();
  const payload = JSON.stringify(req.body);
  function log() {
    const responseTime = new Date() - startTime;
    logger.info(`Payload: ${payload}`);
    logger.info(`Response time: ${responseTime}ms`);
    res.removeListener('finish', log);
    res.removeListener('close', log);
  }
  res.on('finish', log);
  res.on('close', log);
  next();
}

module.exports = {
  catchAsyncErrors,
  errorHandler,
  logErrors,
  logRequests,
};
