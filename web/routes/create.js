'use strict';

const bcrypt = require('bcrypt');
const boom = require('boom');
const joi = require('joi');
const pick = require('lodash/pick');

const models = require('../../models');
const { App, Apps, User } = models;

const createSchema = joi
  .object({
    email: joi
      .string()
      .email()
      .required(),
    phone: joi.string(),
    appname: joi.string().required(),
    firstname: joi.string().required(),
    lastname: joi.string().required(),
    password: joi.string().required(),
    locale: joi.string().default('en-US'),
    status: joi.string().default('active'),
  })
  .unknown()
  .required();

async function run(req, res, next) {
  const { appname, ...account } = joi.attempt(req.body, createSchema);
  const emailTaken = await isEmailTaken(account);
  if (emailTaken) {
    throw boom.conflict('Email is already taken.');
  }
  const app = await getApp(appname);
  if (!app) {
    throw boom.badRequest(`Invalid app name ${appname}.`);
  }
  const user = await addAccount(account, app);
  return successResponse(user.get('email'), res);
}

async function isEmailTaken({ email }) {
  const user = await User.findOne({ email });
  return !!user;
}

async function getApp(name) {
  return await App.findOne({ name }, { withRelated: ['roles'] });
}

async function addAccount(account, app) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(account.password, salt);

  const role = app.related('roles').findWhere({ name: 'Employee' });
  const newUser = await app.related('users').create(account);
  await newUser.related('roles').attach([role]);
  return newUser;
}

async function successResponse(email, res) {
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
      return role.permissions.map(permission => pick(permission, permissionFields));
    });
  }

  res.status(201).json({ ...result });
}

module.exports = run;
