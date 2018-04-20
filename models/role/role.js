'use strict';

const joi = require('joi');

const { connection } = require('../db');

const tableName = 'roles';

const roleSchema = joi
  .object({
    uid: joi.string().required(),
    app_id: joi.string().required(),
    name: joi.string().required(),
    description: joi.string(),
  })
  .required();

async function addApp(app) {
  // eslint-disable-next-line no-param-reassign
  role = joi.attempt(app, roleSchema);
  return connection(tableName)
    .insert(role)
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

