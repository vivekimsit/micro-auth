'use strict';

const joi = require('joi');

const { connection } = require('../db');

const tableName = 'roles';

/*
const roleSchema = joi
  .object({
    uid: joi.string().required(),
    app_id: joi.string().required(),
    name: joi.string().required(),
    description: joi.string(),
  })
  .required();
*/

async function getUserRoles({ uid }) {
  let roles = await getUserRoleIds({ user_id: uid });
  roles = roles.map(r => r.role_id);
  return connection(tableName)
    .whereIn('uid', roles)
    .select();
}

async function getUserRoleIds(params) {
  return connection('user_role')
    .where(params)
    .select();
}

module.exports = {
  tableName,
  getUserRoles,
};
