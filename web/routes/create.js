'use strict';

const bcrypt = require('bcrypt');
const boom = require('boom');
const joi = require('joi');
const uuidv4 = require('uuid/v4');

const userModel = require('../../models/user');
const logger = require('../logger');

const createSchema = joi
  .object({
    email: joi
      .string()
      .email()
      .required(),
    phone: joi.string(),
    username: joi.string().required(),
    firstname: joi.string().required(),
    lastname: joi.string().required(),
    password: joi.string().required(),
    language: joi.string().default('en-US'),
  })
  .required();

async function run(req, res, next) {
  const account = joi.attempt(req.body, createSchema);
  let result = await isEmailTaken(account);
  if (result) {
    throw boom.conflict('Email is already taken.');
  }
  result = await addAccount(account);
  res.status(200).send(result);
}

async function isEmailTaken({ email }) {
  const users = await userModel.getUsers({ email });
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
