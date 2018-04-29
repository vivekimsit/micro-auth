'use strict';

const joi = require('joi');

const { connection } = require('../db');

const tableName = 'activity';

const schema = joi
  .object({
    user_id: joi.string().required(),
    type: joi.string().required(),
    device: joi.string(),
    ip: joi.string(),
  })
  .unknown()
  .required();

async function addActivity(activity) {
  // eslint-disable-next-line no-param-reassign
  activity = joi.attempt(activity, schema);
  return connection(tableName)
    .insert(activity)
    .returning('*');
}

module.exports = {
  tableName,
  addActivity,
};
