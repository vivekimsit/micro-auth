'use strict';

const joi = require('joi');
const uuidv4 = require('uuid/v4');

const Base = require('../base');
const { App } = require('../app');
const { Role } = require('../role');

const tableName = 'permissions';

const permissionSchema = joi
  .object({
    uid: joi.string().required(),
    app_id: joi.string().required(),
    name: joi.string().required(),
    object: joi.string().required(),
    action: joi.string().required(),
  })
  .unknown()
  .required();

const Permission = Base.Model.extend({
  tableName: 'permissions',

  defaults: function defaults() {
    return {
      uid: uuidv4(),
    };
  },

  app: function() {
    return this.belongsTo(App);
  },

  roles: function() {
    return this.belongsToMany(Role);
  },
});

module.exports = {
  Permission: Base.model('Permission', Permission),
};
