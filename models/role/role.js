'use strict';

const joi = require('joi');
const uuidv4 = require('uuid/v4');

const Base = require('../base');

require('../app');
require('../permission');
require('../user');

const tableName = 'roles';

const roleSchema = joi
  .object({
    uid: joi.string().required(),
    app_id: joi.string().required(),
    name: joi.string().required(),
    description: joi.string(),
  })
  .unknown()
  .required();

const Role = Base.Model.extend({
  tableName,

  defaults: function defaults() {
    return {
      uid: uuidv4(),
    };
  },

  app: function() {
    return this.belongsTo('App');
  },

  permissions: function() {
    return this.belongsToMany('Permission');
  },

  users: function() {
    return this.belongsToMany('User');
  },
});

module.exports = {
  tableName,
  Role: Base.model('Role', Role),
};
