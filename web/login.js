'use strict';

const joi = require('joi');
const bcrypt = require('bcrypt');

const user = require('../models/user');

const loginSchema = joi.object({
  username: joi.string().required(),
  password: joi.string().required(),
}).required();

async function run (req, res) {
  const login = joi.attempt(req.body, loginSchema);
  const result = await authorize(login);
  res.status(200).send(result);
}

async function authorize ({ username, password }) {
  const users = await user.getUsers({ username, is_active: true });

  let isAuthorized = false;
  let uid = null;
  if (users.length === 1) {
    isAuthorized = await bcrypt.compare(password, users[0].password);
    uid = users[0].uid;
  }
  return { isAuthorized, uid };
}

module.exports = { login: run };
