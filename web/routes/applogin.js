'use strict';

const bcrypt = require('bcrypt');
const boom = require('boom');
const joi = require('joi');
// sign with default (HMAC SHA256)
const jwt = require('jsonwebtoken');
const moment = require('moment');
const flatten = require('lodash/flatten');
const pick = require('lodash/pick');

const models = require('../../models');
const { App, User } = models;

const debug = require('debug')('microauth:test');

const loginSchema = joi
  .object({
    appname: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required(),
  })
  .required();

async function run(req, res, next) {
  const { appname, email, password } = joi.attempt(req.body, loginSchema);

  const { exists, app } = await getApp(appname);
  debug(`${appname} exists? ${exists}`);
  if (!exists) {
    throw boom.badRequest(`Invalid app name: ${appname}.`);
  }
  if (app.isInactive()) {
    throw boom.badRequest('App is not active.');
  }

  const { isAuthorized, user } = await authorize({ email, password });
  if (!user) {
    throw boom.notFound('User not found.');
  }
  debug(`User ${user.get('email')} is authorised? ${isAuthorized}`);
  if (!isAuthorized) {
    throw boom.unauthorized('Invalid email or password.');
  }

  const { result } = await isUserBelongsToApp(user, app.get('name'));
  if (!result) {
    throw boom.badRequest(`User is not authorised to access app.`);
  }

  return successResponse(user.get('email'), app.get('secret'), res);
}

async function getApp(name) {
  const app = await App.findOne({ name });

  let exists = false;
  if (app) {
    exists = true;
  }
  return { exists, app };
}

async function authorize({ email, password }) {
  const user = await User.findOne(
    { email, status: 'active' },
    { withRelated: ['apps', 'roles.permissions'] }
  );

  let isAuthorized = false;
  if (user) {
    isAuthorized = await bcrypt.compare(password, user.get('password'));
  }
  return { isAuthorized, user };
}

async function isUserBelongsToApp(user, appname) {
  let result = false;
  let app = null;
  app = user.related('apps').findWhere({ name: appname });
  if (app) {
    result = true;
  }
  return { result, app };
}

async function successResponse(email, secret, res) {
  const userFields = [
    'device',
    'email',
    'firstname',
    'language',
    'lastname',
    'phone',
    'uid',
  ];
  const roleFields = ['name', 'description'];
  const permissionFields = ['name', 'object', 'action'];

  let user = await User.findOne(
    {
      email: email,
    },
    {
      withRelated: ['roles.permissions'],
    }
  );
  user = user.toJSON();
  const result = Object.assign({}, { ...user });
  result.roles = [];
  result.permissions = [];

  if (user.roles) {
    result.roles = user.roles.map(role => pick(role, roleFields));
    result.permissions = user.roles.map(role => {
      return role.permissions.map(permission =>
        pick(permission, permissionFields)
      );
    });
  }
  result.permissions = flatten(result.permissions);

  const expiration = getExpirationTime();
  const token = jwt.sign(result, secret);

  res.json({ token, expiration });
}

const getExpirationTime = () =>
  // returns time in seconds
  moment()
    .utc()
    .add(1, 'hours')
    .unix()
    .toString();

module.exports = run;
