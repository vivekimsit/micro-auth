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
  .unknown()
  .required();


module.exports = {
  tableName,
  addRole,
  getRoles,
  addUserRole,
  getUserRoles,
};
