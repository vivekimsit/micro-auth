'use strict';

const { tableName } = require('../../../role');

// eslint-disable-next-line no-unused-vars
exports.seed = function seed(knex, Promise) {
  return knex(tableName).insert([
    {
      uid: '1',
      name: 'admin',
      description: 'Super User',
      created_at: '2018-02-22 00:00:00',
      updated_at: '2018-02-22 00:00:00',
    },
    {
      uid: '2',
      name: 'owner',
      description: 'Hotel Owner',
      created_at: '2018-02-22 00:00:00',
      updated_at: '2018-02-22 00:00:00',
    },
    {
      uid: '3',
      name: 'manager',
      description: 'Hotel Manager',
      created_at: '2018-02-22 00:00:00',
      updated_at: '2018-02-22 00:00:00',
    },
    {
      uid: '4',
      name: 'test',
      description: 'Test User',
      created_at: '2018-02-22 00:00:00',
      updated_at: '2018-02-22 00:00:00',
    },
  ]);
};

