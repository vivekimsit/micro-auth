'use strict';

const bcrypt = require('bcrypt');
const boom = require('boom');
const joi = require('joi');
const moment = require('moment');
// sign with default (HMAC SHA256)
const jwt = require('jsonwebtoken');
const pick = require('lodash/pick');

const models = require('../../models');
const { App, Apps, User } = models;

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
    throw boom.badRequest(`Invalid app name: ${appname}.`);
  }

  const { isAuthorized, user } = await authorize({ email, password });
  if (!user) {
    return next(boom.notFound('User not found.'));
  }
  if (!isAuthorized) {
    return next(boom.unauthorized('Invalid email or password.'));
  }

  const roles = await getUserRoles(user);
  if (!roles.length) {
    return next(boom.unauthorized('User does not have permission.'));
  }
  const apps = await getUserApps(user);
  if (!apps.length) {
    return next(boom.unauthorized('User is not authorised for this app.'));
  }
  return successResponse(user, roles.toJSON(), secret, res);
}

async function getApp(name) {
  let exists = false;
  let secret = null;
  const app = await App.findOne({ name });
  if (app) {
    exists = true;
    secret = app.get('secret');
  }
  return { exists, secret };
}

async function authorize({ email, password }) {
  const user = await User.findOne({ email, status: 'active' });

  let isAuthorized = false;
  if (user) {
    isAuthorized = await bcrypt.compare(password, user.get('password'));
  }
  return { isAuthorized, user };
}

async function getUserRoles(user) {
  return user.roles().fetch();
}

async function getUserApps(user) {
  return user.apps().fetch();
}

async function successResponse(user, roles, secret, res) {
  const expiration = getExpirationTime();
  const payload = { user, expiration };
  const token = jwt.sign(payload, secret);

  const userFields = [
    'uid',
    'email',
    'username',
    'firstname',
    'lastname',
    'language',
  ];
  const roleFields = ['name', 'description'];
  // eslint-disable-next-line no-param-reassign
  user = pick(user, userFields);
  // eslint-disable-next-line no-param-reassign
  roles = roles.map(role => pick(role, roleFields));
  return res.json({ expiration, token, ...user, roles });
}

const getExpirationTime = () =>
  // returns time in seconds
  moment()
    .utc()
    .add(1, 'hours')
    .unix()
    .toString();

module.exports = run;
