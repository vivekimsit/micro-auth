'use strict';

const bcrypt = require('bcrypt');
const boom = require('boom');
const joi = require('joi');
const uuidv4 = require('uuid/v4');
const pick = require('lodash/pick');

const appModel = require('../../models/app');
const roleModel = require('../../models/role');
const userModel = require('../../models/user');

const createSchema = joi
  .object({
    email: joi
      .string()
      .email()
      .required(),
    phone: joi.string(),
    appname: joi.string().required(),
    username: joi.string().required(),
    firstname: joi.string().required(),
    lastname: joi.string().required(),
    password: joi.string().required(),
    language: joi.string().default('en-US'),
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
  const role = await getDefaultRoleForApp(app);
  if (!role) {
    throw boom.badRequest(`No default role found for app ${appname}.`);
  }
  const user = await addAccount(account);
  await addRole(user, role);
  return successResponse(user, role, res);
}

async function isEmailTaken({ email }) {
  const users = await userModel.getUsers({ email });
  return users.length > 0;
}

async function getDefaultRoleForApp({ uid }) {
  // eslint-disable-next-line no-unused-vars
  const [role, ...rest] = await roleModel.getRoles({
    app_id: uid,
    name: 'user',
  });
  return role;
}

async function getApp(name) {
  const apps = await appModel.getApps({ name });
  // eslint-disable-next-line no-unused-vars
  const [app, ...rest] = apps;
  return app;
}

async function addRole(user, role) {
  await roleModel.addUserRole(user.uid, role.uid);
}

async function addAccount(account) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(account.password, salt);

  // eslint-disable-next-line no-param-reassign
  account.uid = uuidv4();
  // eslint-disable-next-line no-param-reassign
  account.salt = salt;
  // eslint-disable-next-line no-param-reassign
  account.password = hash;
  const user = await userModel.addUser(account);
  return user;
}

async function successResponse(user, role, res) {
  const userFields = [
    'device',
    'email',
    'firstname',
    'language',
    'lastname',
    'phone',
    'uid',
    'username',
  ];
  const roleFields = ['name', 'description'];
  // eslint-disable-next-line no-param-reassign
  user = pick(user, userFields);
  // eslint-disable-next-line no-param-reassign
  role = pick(role, roleFields);
  res.status(201).json({ ...user, roles: [role] });
}

module.exports = run;
