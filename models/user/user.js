'use strict';

const joi = require('joi');

const { connection } = require('../db');
const appModel = require('../app');
const roleModel = require('../role');

const tableName = 'users';

const userSchema = joi
  .object({
    uid: joi.string().required(),
    salt: joi.string().required(),
    email: joi.string().required(),
    phone: joi.string(),
    device: joi.string(),
    firstname: joi.string().required(),
    lastname: joi.string().required(),
    language: joi.string().default('en-US'),
    password: joi.string().required(),
    username: joi.string().required(),
    is_active: joi.boolean().default(true),
  })
  .required();

async function addUser(user) {
  // eslint-disable-next-line no-param-reassign
  user = joi.attempt(user, userSchema);
  return connection(tableName)
    .insert(user)
    .returning('*');
}

async function getUsers(params = {}) {
  const users = await getUserOnlyData(params);
  users.roles = [];
  users.apps = [];
  for (const user of users) {
    const { uid } = user;
    const roles = await roleModel.getUserRoles({ uid });
    const apps = await appModel.getUserApps({ uid });
    user.roles = [...roles.map(role => role.name)];
    user.apps = [...apps.map(app => app.name)];
  }
  return users;
}

async function getUserOnlyData(params) {
  return connection(tableName)
    .where(params)
    .select();
}

module.exports = {
  tableName,
  addUser,
  getUsers,
};
