'use strict';

const { tableName } = require('../../../user');

// eslint-disable-next-line no-unused-vars
exports.seed = function seed(knex, Promise) {
  return knex(tableName).insert([
    {
      uid: '1',
      username: 'demo',
      email: 'demo@example.com',
      language: 'en-US',
      password: '$2a$10$IbfPoCGdLLHh1hyQ9b9UROuNJeyTzk5VMVDf5504mcTJsHfugyaJG',
      salt: '$2a$10$IbfPoCGdLLHh1hyQ9b9URO',
      is_active: true,
      created_at: '2018-02-22 00:00:00',
      updated_at: '2018-02-22 00:00:00',
    },
  ]);
};
