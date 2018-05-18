'use strict';

const bcrypt = require('bcrypt');
const boom = require('boom');
const joi = require('joi');
const pick = require('lodash/pick');

const { User } = require('../../models/user');

const loginSchema = joi
  .object({
    email: joi
      .string()
      .email()
      .required(),
    password: joi.string().required(),
  })
  .unknown()
  .required();

async function run(req, res, next) {
  const login = joi.attempt(req.body, loginSchema);
  const { isAuthorized, user } = await authorize(login);
  if (!user) {
    throw boom.notFound('User not found.');
  }
  if (!isAuthorized) {
    throw boom.unauthorized('Invalid email or password.');
  }
  return successResponse(user, res);
}

async function authorize({ email, password }) {
  let isAuthorized = false;
  const user = await User.findOne({ email, status: 'active' });
  if (user) {
    isAuthorized = await bcrypt.compare(password, user.get('password'));
  }
  return { isAuthorized, user };
}

async function successResponse(user, res) {
  res.json({ uid: user.get('uid') });
}

module.exports = run;
