'use strict';

const bcrypt = require('bcrypt');
const boom = require('boom');
const joi = require('joi');
const pick = require('lodash/pick');

const userModel = require('../../models/user');

const loginSchema = joi
  .object({
    email: joi
      .string()
      .email()
      .required(),
    password: joi.string().required(),
  })
  .required();

async function run(req, res, next) {
  const login = joi.attempt(req.body, loginSchema);
  const { isAuthorized, user } = await authorize(login);
  if (!isAuthorized) {
    throw boom.unauthorized('Invalid email or password.');
  }
  return successResponse(user, res);
}

async function authorize({ email, password }) {
  const users = await userModel.getUsers({ email, is_active: true });

  let isAuthorized = false;
  const [user, ...rest] = users;
  if (user) {
    isAuthorized = await bcrypt.compare(password, user.password);
  }
  return { isAuthorized, user };
}

async function successResponse(user, res) {
  const publicFields = [
    'uid',
    'username',
    'email',
    'firstname',
    'lastname',
    'language',
  ];
  // eslint-disable-next-line no-param-reassign
  user = pick(user, publicFields);
  res.status(200).send(pick(user, publicFields));
}

module.exports = run;
