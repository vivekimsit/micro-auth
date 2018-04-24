'use strict';

const bcrypt = require('bcrypt');
const boom = require('boom');
const joi = require('joi');
const pick = require('lodash/pick');

const logger = require('../logger');
const userModel = require('../../models/user');
const roleModel = require('../../models/role');

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
  const publicFields = [
    'uid',
    'username',
    'email',
    'firstname',
    'lastname',
    'language',
  ];
  res.status(200).send(pick(user, publicFields));
}

async function authorize({ email, password }) {
  const users = await userModel.getUsers({ email, is_active: true });

  let isAuthorized = false;
  let user = null;
  if (users.length === 1) {
    user = users[0];
    isAuthorized = await bcrypt.compare(password, user.password);
  }
  return { isAuthorized, user };
}

async function getUserRoles({ uid }) {
  const roles = await roleModel.getUserRoles({ user_id: uid });
  return roles;
}

module.exports = run;
