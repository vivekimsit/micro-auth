'use strict';

const joi = require('joi');
const pick = require('lodash/pick');

const base = require('../base');
const Role = require('../role');
const tableName = 'users';

const userSchema = joi
  .object({
    uid: joi.string().required(),
    salt: joi.string().required(),
    email: joi.string().required(),
    phone: joi.string(),
    device: joi.string(),
    firstname: joi.string().required(),
    lastname: joi.string().required(),
    language: joi.string().default('en-US'),
    password: joi.string().required(),
    username: joi.string().required(),
    is_active: joi.boolean().default(true),
  })
  .unknown()
  .required();

let User, Users;

User = base.Model.extend({
  tableName,

  roles: function() {
    return this.belongsToMany(Role, 'users_roles', 'user_id', 'role_id');
  },

  toJson: function() {
    const fields = [
      'uid',
      'username',
      'email',
      'firstname',
      'lastname',
      'language',
    ];
    return pick(this, fields);
  },
});

Users = base.Collection.extend({
  model: User,
});

module.exports = {
  tableName,
  User,
  Users,
};
