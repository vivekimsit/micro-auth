'use strict';

const joi = require('joi');

const { connection } = require('../db');

const tableName = 'apps';

const appSchema = joi
  .object({
    name: joi.string().required(),
    secret: joi.string().required(),
  })
  .required();

async function addApp(app) {
  // eslint-disable-next-line no-param-reassign
  app = joi.attempt(app, appSchema);
  return connection(tableName)
    .insert(app)
    .returning('*');
}

async function getApps(params = {}) {
  return connection(tableName)
    .where(params)
    .select();
}

module.exports = {
  tableName,
  addApp,
  getApps,
};
