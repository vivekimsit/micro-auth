'use strict';

const { events, logger } = require('../../lib');
const models = require('../../models');

events.on('token.created', function(token) {
  logger.info('Token created');
});
