'use strict';

const { tableName } = require('../../../user');

exports.seed = function (knex, Promise) {
  return knex(tableName).insert([
    {
      uid: '1',
      username: 'demo',
      password: '$2a$10$IbfPoCGdLLHh1hyQ9b9UROuNJeyTzk5VMVDf5504mcTJsHfugyaJG',
      salt: '$2a$10$IbfPoCGdLLHh1hyQ9b9URO',
      is_active: true,
      created_at: "2018-02-22 00:00:00",
      updated_at: "2018-02-22 00:00:00",
    },
  ]);
};
