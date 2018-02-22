'use strict';

const joi = require('joi');
const bcrypt = require('bcrypt');
const Boom = require('Boom');

const user = require('../models/user');

const accountSchema = joi.object({
  username: joi.string().required(),
  password: joi.string().required(),
}).required();

async function run (req, res, next) {
  const login = joi.attempt(req.body, accountSchema);
  const result = await isUsernameTaken(login);
  if (result) {
    throw Boom.conflict('there was a conflict');
  }
  res.status(200).send(result);
}

async function isUsernameTaken ({ username }) {
  const users = await user.getUsers({ username });
  return users.length > 0;
}

module.exports = run;
