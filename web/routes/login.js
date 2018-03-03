'use strict';

const bcrypt = require('bcrypt');
const boom = require('Boom');
const joi = require('joi');

const userModel = require('../../models/user');

const loginSchema = joi
  .object({
    username: joi.string().required(),
    password: joi.string().required(),
  })
  .required();

async function run(req, res, next) {
  const login = joi.attempt(req.body, loginSchema);
  const result = await authorize(login);
  if (!result.isAuthorized) {
    return next(boom.unauthorized('Invalid username or password.'));
  }
  const { uid } = result;
  res.status(200).send({ uid });
}

async function authorize({ username, password }) {
  const users = await userModel.getUsers({ username, is_active: true });

  let isAuthorized = false;
  let uid = null;
  if (users.length === 1) {
    const [user] = users;
    isAuthorized = await bcrypt.compare(password, user.password);
    ({ uid } = user);
  }
  return { isAuthorized, uid };
}

module.exports = run;
