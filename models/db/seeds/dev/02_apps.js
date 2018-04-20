'use strict';

const { tableName } = require('../../../app');

// eslint-disable-next-line no-unused-vars
exports.seed = function seed(knex, Promise) {
  return knex(tableName).insert([
    {
      uid: '1',
      name: 'demo',
      secret: 'demo',
      created_at: '2018-02-22 00:00:00',
      updated_at: '2018-02-22 00:00:00',
    },
    {
      uid: '2',
      name: 'bar',
      secret: 'bar',
      created_at: '2018-02-22 00:00:00',
      updated_at: '2018-02-22 00:00:00',
    },
  ]);
};
