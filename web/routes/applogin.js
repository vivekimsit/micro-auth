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
const roleModel = require('../../models/role');

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
  const roles = await getUserRoles(user);
  if (!roles.length) {
    return next(boom.unauthorized('User does not have permission.'));
  }
  const apps = await getUserApps(roles);
  if (!apps.length || !apps.includes(appname)) {
    return next(boom.unauthorized('User is not authorised for this app.'));
  }
  return successResponse(user, roles, secret, res);
}

async function getApp(name) {
  const apps = await appModel.getApps({ name });
  let exists = false;
  let secret = null;
  // eslint-disable-next-line no-unused-vars
  const [app, ...rest] = apps;
  if (app) {
    exists = true;
    ({ secret } = app);
  }
  return { exists, secret };
}

async function authorize({ email, password }) {
  const users = await userModel.getUsers({ email, is_active: true });

  let isAuthorized = false;
  // eslint-disable-next-line no-unused-vars
  const [user, ...rest] = users;
  if (user) {
    isAuthorized = await bcrypt.compare(password, user.password);
  }
  return { isAuthorized, user };
}

async function getUserRoles({ uid }) {
  return roleModel.getUserRoles({ uid });
}

async function getUserApps(roles) {
  const apps = await appModel.getByIds(roles.map(r => r.app_id));
  return apps.map(app => app.name);
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
  return res.status(200).json({ expiration, token, ...user, roles });
}

const getExpirationTime = () =>
  // returns time in seconds
  moment()
    .utc()
    .add(1, 'hours')
    .unix()
    .toString();

module.exports = run;
