'use strict';

const joi = require('joi');

const base = require('../base');
const { App } = require('../app');
const { User } = require('../user');
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

let Role, Roles;

Role = base.Model.extend({
  tableName,

  app: function () {
    return this.belongsTo(App);
  },

  users: function () {
    return this.belongsToMany(User);
  }
});

async function addRole(role) {
  // eslint-disable-next-line no-param-reassign
  role = joi.attempt(role, roleSchema);
  return connection(tableName)
    .insert(role)
    .returning('*');
}

async function getRoles(params = {}) {
  return connection(tableName)
    .where(params)
    .select();
}

async function getUserRoles({ uid }) {
  const roles = await getUserRoleIds({ user_id: uid });
  const ids = roles.map(r => r.role_id);
  return connection(tableName)
    .whereIn('uid', ids)
    .select();
}

async function addUserRole(userId, roleId) {
  return connection('user_role')
    .insert({ user_id: userId, role_id: roleId })
    .returning('*');
}

async function getUserRoleIds(params) {
  return connection('user_role')
    .where(params)
    .select();
}

module.exports = {
  tableName,
  addRole,
  getRoles,
  addUserRole,
  getUserRoles,
};
