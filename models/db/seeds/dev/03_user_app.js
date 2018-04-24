'use strict';

const tableName = 'user_app';

// eslint-disable-next-line no-unused-vars
exports.seed = function seed(knex, Promise) {
  return knex(tableName).insert([
    {
      user_id: '1',
      app_id: '1',
    },
    {
      user_id: '2',
      app_id: '2',
    },
  ]);
};
