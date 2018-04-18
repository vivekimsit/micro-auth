'use strict';

const joi = require('joi');

const { connection } = require('../db');

const tableName = 'users';

const userSchema = joi
  .object({
    uid: joi.string().required(),
    salt: joi.string().required(),
    email: joi.string().required(),
    phone: joi.string(),
    device: joi.string(),
    fullname: joi.string(),
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
  return connection(tableName)
    .where(params)
    .select();
}

module.exports = {
  tableName,
  addUser,
  getUsers,
};
