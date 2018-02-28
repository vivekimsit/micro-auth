'use strict';

const boom = require('Boom');

const logger = require('./logger');

/**
 * Notice that when not calling "next" in an error-handling function,
 * you are responsible for writing (and ending) the response.
 * Otherwise those requests will "hang" and will not be eligible for
 * garbage collection.
 */
const catchAsyncErrors = middleware => (req, res, next) =>
  Promise.resolve(middleware(req, res, next)).catch(err => {
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

module.exports = {
  catchAsyncErrors,
  errorHandler,
  logErrors,
};
