'use strict';

const { tableName } = require('../../../role');

// eslint-disable-next-line no-unused-vars
exports.seed = function seed(knex, Promise) {
  return knex(tableName).insert([
    {
      uid: '1',
      app_id: '1',
      name: 'user',
      description: 'App User',
      created_at: '2018-02-22 00:00:00',
      updated_at: '2018-02-22 00:00:00',
    },
    {
      uid: '2',
      app_id: '1',
      name: 'admin',
      description: 'Super User',
      created_at: '2018-02-22 00:00:00',
      updated_at: '2018-02-22 00:00:00',
    },
    {
      uid: '3',
      app_id: '1',
      name: 'owner',
      description: 'Hotel Owner',
      created_at: '2018-02-22 00:00:00',
      updated_at: '2018-02-22 00:00:00',
    },
    {
      uid: '4',
      app_id: '1',
      name: 'manager',
      description: 'Hotel Manager',
      created_at: '2018-02-22 00:00:00',
      updated_at: '2018-02-22 00:00:00',
    },
    {
      uid: '5',
      app_id: '2',
      name: 'user',
      description: 'Test User',
      created_at: '2018-02-22 00:00:00',
      updated_at: '2018-02-22 00:00:00',
    },
  ]);
};

