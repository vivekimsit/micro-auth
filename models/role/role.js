'use strict';

const joi = require('joi');

const base = require('../base');
const { App } = require('../app');
const { User } = require('../user');
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

const Role = base.Model.extend({
  tableName,

  app: function () {
    return this.belongsTo(App);
  },

  users: function () {
    return this.belongsToMany(User);
  }
});

module.exports = {
  tableName,
  Role,
};
