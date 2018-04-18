'use strict';

const bcrypt = require('bcrypt');
const boom = require('boom');
const joi = require('joi');
const uuidv4 = require('uuid/v4');

const userModel = require('../../models/user');
const logger = require('../logger');

const createSchema = joi
  .object({
    email: joi.string().email().required(),
    phone: joi.string(),
    username: joi.string().required(),
    fullname: joi.string(),
    password: joi.string().required(),
    language: joi.string(),
  })
  .required();

async function run(req, res, next) {
  const account = joi.attempt(req.body, createSchema);
  let result = await isUsernameTaken(account);
  if (result) {
    throw boom.conflict('Username is already taken.');
  }
  result = await addAccount(account);
  res.status(200).send(result);
}

async function isUsernameTaken({ username }) {
  const users = await userModel.getUsers({ username });
  return users.length > 0;
}

async function addAccount(account) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(account.password, salt);

  account.uid = uuidv4();
  account.salt = salt;
  account.password = hash;
  return await userModel.addUser(account);
}

module.exports = run;
