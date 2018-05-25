'use strict';

const joi = require('joi');
const pick = require('lodash/pick');
const uuidv4 = require('uuid/v4');

const Base = require('../base');

require('../app');
require('../role');

const Status = {
  Active: 'active',
  InActive: 'inactive',
  Locked: 'locked',
};

const createSchema = joi
  .object({
    uid: joi.string().required(),
    email: joi.string().required(),
    firstname: joi.string().required(),
    lastname: joi.string().required(),
    locale: joi.string().default('en_US'),
    password: joi.string().required(),
    phone: joi.string(),
    status: joi.string().default('active'),
  })
  .unknown()
  .required();

let User, Users;

User = Base.Model.extend({
  tableName: 'users',

  defaults: function defaults() {
    return {
      uid: uuidv4(),
      created_by: '1',
    };
  },

  onCreating: function onCreating(newObj, attr, options) {
    Base.Model.prototype.onCreating.apply(this, arguments);
    joi.attempt(this.changed, createSchema);
  },

  apps: function() {
    return this.belongsToMany('App');
  },

  roles: function() {
    return this.belongsToMany('Role');
  },

  isActive: function isActive() {
    return this.get('status') === Status.Active;
  },

  isInActive: function isActive() {
    return this.get('status') === Status.InActive;
  },

  isLocked: function isActive() {
    return this.get('status') === Status.Locked;
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
  User: Base.model('User', User),
  Users: Base.collection('Users', Users),
};
