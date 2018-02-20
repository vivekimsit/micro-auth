'use strict';

/**
 * Notice that when not calling "next" in an error-handling function,
 * you are responsible for writing (and ending) the response.
 * Otherwise those requests will "hang" and will not be eligible for garbage collection.
 */ 

function catchAsyncErrors (middleware) {
  return (req, res, next) => Promise.resolve(middleware(req, res, next)).catch(next);
}

function errorHandler (err, req, res, next) {
  if (err.isJoi) {
    const message = err.details.map(detail => detail.message).join(', ');
    res.status(400).send(`Invalid format: ${message}`);
  } else if (err.response.status === 403) {
    res.status(403).send('Investigate 403 causes here.')
  } else {
    res.status(500).send('Oops! Internal Server Error.')
  }
}

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

module.exports = {
  catchAsyncErrors,
  errorHandler,
  logErrors
}
