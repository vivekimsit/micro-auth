'use strict';

const joi = require('joi');
const pick = require('lodash/pick');
const uuidv4 = require('uuid/v4');

const Base = require('../base');
const { App } = require('../app');
const { Role } = require('../role');
const tableName = 'users';

const userSchema = joi
  .object({
    uid: joi.string().required(),
    email: joi.string().required(),
    firstname: joi.string().required(),
    lastname: joi.string().required(),
    locale: joi.string().default('en-US'),
    password: joi.string().required(),
    phone: joi.string(),
    status: joi.string().default('active'),
  })
  .unknown()
  .required();

let User, Users;

User = Base.Model.extend({
  tableName,

  defaults: function defaults() {
    return {
      uid: uuidv4(),
    };
  },

  apps: function() {
    return this.belongsToMany(App);
  },

  roles: function() {
    return this.belongsToMany(Role);
  },

  toJson: function() {
    const fields = ['uid', 'email', 'firstname', 'lastname', 'locale'];
    return pick(this, fields);
  },
});

Users = Base.Collection.extend({
  model: User,
});

module.exports = {
  tableName,
  User: Base.model('User', User),
  Users: Base.collection('Users', Users),
};
