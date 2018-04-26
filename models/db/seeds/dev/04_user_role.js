'use strict';

const tableName = 'user_role';

// eslint-disable-next-line no-unused-vars
exports.seed = function seed(knex, Promise) {
  return knex(tableName).insert([
    {
      user_id: '1',
      role_id: '1',
    },
    {
      user_id: '1',
      role_id: '4',
    },
    {
      user_id: '2',
      role_id: '1',
    },
  ]);
};
