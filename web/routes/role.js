'use strict';

const boom = require('boom');
const joi = require('joi');
const jwt = require('jsonwebtoken');

const appModel = require('../../models/app');

const requestSchema = joi
  .object({
    appname: joi.string().required(),
    role_id: joi.string().required(),
    token: joi.string().required(),
    user_id: joi.string().required(),
  })
  .required();

async function run(req, res, next) {
  const { appname, token } = joi.attempt(
    req.body,
    requestSchema
  );
  const { exists, secret } = await getApp(appname);
  if (!exists) {
    throw boom.badRequest(`Invalid app name ${appname}.`);
  }
  const { isAuthorized } = await authorize({ token, secret });
  if (!isAuthorized) {
    throw boom.unauthorized('Invalid email or password.');
  }
  res.sendStatus(200);
}

async function getApp(appname) {
  const apps = await appModel.getApps({ name: appname });
  let exists = false;
  let secret = null;
  if (apps.length === 1) {
    exists = true;
    const [app] = apps;
    ({ secret } = app);
  }
  return { exists, secret };
}

async function authorize({ token, secret }) {
  let isAuthorized = false;
  try {
    jwt.verify(token, secret);
    isAuthorized = true;
  } catch (err) {
    return { isAuthorized };
  }
  return { isAuthorized };
}

module.exports = run;
