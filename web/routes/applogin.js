'use strict';

const joi = require('joi');
const bcrypt = require('bcrypt');
const boom = require('Boom');
// sign with default (HMAC SHA256)
const jwt = require('jsonwebtoken');

const app = require('../../models/app');
const user = require('../../models/user');

const apploginSchema = joi.object({
  appname: joi.string().required(),
  username: joi.string().required(),
  password: joi.string().required(),
}).required();

async function run (req, res, next) {
  const { appname, username, password } = joi.attempt(req.body, apploginSchema);
  const { exists, secret } = await getApp(appname);
  if (!exists) {
    throw boom.badRequest(`Invalid app ${appname}.`);
  }
  const { isAuthorized, ...user } = await authorize({ username, password });
  if (!isAuthorized) {
    throw boom.conflict('Invalid username or password.');
  }
  successResponse(user, secret, res);
}

async function getApp(appname) {
  const apps = await app.getApps({ name: appname });
  let exists = false;
  let secret = null;
  if (apps.length === 1) {
    exists = true;
    secret = apps[0].secret;
  }
  return { exists, secret };
}

async function authorize ({ username, password }) {
  const users = await user.getUsers({ username, is_active: true });

  let isAuthorized = false;
  let uid = null;
  if (users.length === 1) {
    isAuthorized = await bcrypt.compare(password, users[0].password);
    uid = users[0].uid;
  }
  return { isAuthorized, uid, username };
}

const successResponse = ({ uid, username }, secret, res) => {
  const expiration = getExpirationTime();
  const payload = { uid, username, expiration };
  const token = jwt.sign(payload, secret);
  res.status(200).send({ expiration, token });
};

const getExpirationTime = () => {
  const currentTime = new Date();
  const timezoneOffsetInMilliSec = currentTime.getTimezoneOffset() * 60000;
  return Math.floor((currentTime.getTime() - timezoneOffsetInMilliSec) / 1000);
};

module.exports = run;
