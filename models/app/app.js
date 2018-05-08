'use strict';

const joi = require('joi');
const uuidv4 = require('uuid/v4');

const Base = require('../base');
const { Permission } = require('../permission');
const { Role } = require('../role');
const { User } = require('../user');

const tableName = 'apps';

const appSchema = joi
  .object({
    uid: joi.string().required(),
    name: joi.string().required(),
    slug: joi.string().required(),
    logo: joi.string(),
    secret: joi.string().required(),
    status: joi.string().default('active'),
    type: joi.string().default('web'),
  })
  .unknown()
  .required();

let App, Apps;

App = Base.Model.extend({
  tableName,

  defaults: function defaults() {
    return {
      uid: uuidv4(),
      type: 'web',
    };
  },

  onCreating: function onCreating(newObj, attr, options) {
    Base.Model.prototype.onCreating.apply(this, arguments);
    joi.attempt(this.changed, appSchema);
  },

  roles: function() {
    return this.hasMany(Role);
  },

  permissions: function() {
    return this.hasMany(Permission);
  },

  users: function() {
    return this.belongsToMany(User);
  },
});

Apps = Base.Collection.extend({
  model: App,
});

module.exports = {
  tableName,
  App: Base.model('App', App),
  Apps: Base.collection('Apps', Apps),
};
