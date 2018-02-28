'use strict';

const joi = require('joi');

const { connection } = require('../db');

const tableName = 'users';

const userSchema = joi
  .object({
    uid: joi.string().required(),
    username: joi
      .string()
      .alphanum()
      .required(),
    password: joi.string().required(),
    salt: joi.string().required(),
    is_active: joi.boolean().required(),
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
  return connection(tableName)
    .where(params)
    .select();
}

module.exports = {
  tableName,
  addUser,
  getUsers,
};
