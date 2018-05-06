'use strict';

const joi = require('joi');

const Base = require('../base');
const Role = require('../role');
const tableName = 'apps';

const appSchema = joi
  .object({
    uid: joi.string().required(),
    name: joi.string().required(),
    secret: joi.string().required(),
  })
  .required();

let App, Apps;

App = Base.Model.extend({
  tableName,

  roles: function() {
    return this.hasMany(Role);
  }
});

async function addApp(app) {
  // eslint-disable-next-line no-param-reassign
  app = joi.attempt(app, appSchema);
  return connection(tableName)
    .insert(app)
    .returning('*');
}

async function getApps(params = {}) {
  return connection(tableName)
    .where(params)
    .select();
}

async function getByIds(ids = {}) {
  return connection(tableName)
    .whereIn('uid', ids)
    .select();
}

Apps = Base.Collection.extend({
  model: App
});

module.exports = {
  tableName,
  App: Base.model('App', App),
  Apps: Base.collection('Apps', Apps)
};
