'use strict';

const joi = require('joi');

const db = require('../db');

const tableName = 'users';

const userSchema = joi.object({
  uid: joi.string().required(),
  username: joi.string().alphanum().required(),
  password: joi.string().required(),
  salt: joi.string().required(),
  is_active: joi.boolean().required(),
}).required();

async function addUser (user) {
  user = joi.attempt(user, userSchema);
  return db(tableName).insert().returning('*');
}

async function getUsers (params = {}) {
  return db(tableName).where(params).select();
}

module.exports = {
  addUser,
  getUsers,
};
