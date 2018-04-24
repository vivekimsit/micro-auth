'use strict';

const bcrypt = require('bcrypt');
const boom = require('boom');
const joi = require('joi');
const moment = require('moment');
// sign with default (HMAC SHA256)
const jwt = require('jsonwebtoken');
const pick = require('lodash/pick');

const appModel = require('../../models/app');
const userModel = require('../../models/user');

const loginSchema = joi
  .object({
    appname: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required(),
  })
  .required();

async function run(req, res, next) {
  const { appname, email, password } = joi.attempt(req.body, loginSchema);
  const { exists, secret } = await getApp(appname);
  if (!exists) {
    throw boom.badRequest(`Invalid app name ${appname}.`);
  }
  const { isAuthorized, user } = await authorize({ email, password });
  if (!isAuthorized) {
    return next(boom.unauthorized('Invalid email or password.'));
  }
  successResponse(user, secret, res);
}

async function getApp(name) {
  const apps = await appModel.getApps({ name });
  let exists = false;
  let secret = null;
  if (apps.length === 1) {
    exists = true;
    const [app] = apps;
    ({ secret } = app);
  }
  return { exists, secret };
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

const successResponse = (user, secret, res) => {
  const expiration = getExpirationTime();
  const payload = { user, expiration };
  const token = jwt.sign(payload, secret);

  const publicFields = [
    'uid',
    'email',
    'username',
    'firstname',
    'lastname',
    'language',
    'roles',
  ];
  user = pick(user, publicFields);
  res.status(200).send({ expiration, token, ...user });
};

const getExpirationTime = () =>
  // returns time in seconds
  moment()
    .utc()
    .add(1, 'hours')
    .unix()
    .toString();

module.exports = run;
