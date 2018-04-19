'use strict';

const { tableName } = require('../../user');

function up(knex) {
  return knex.schema.createTable(tableName, table => {
    table.string('uid').primary();
    table.boolean('is_active').defaultTo(true);
    table.string('device', 256);
    table.string('email', 256).notNullable();
    table.string('firstname', 256).notNullable();
    table.string('language', 16).notNullable();
    table.string('lastname', 256).notNullable();
    table.string('password', 128).notNullable();
    table.string('phone', 256);
    table.string('salt', 128).notNullable();
    table.string('username', 256).notNullable();
    table.timestamps(true, true);
  });
}

function down(knex) {
  return knex.schema.dropTableIfExists(tableName);
}

module.exports = {
  up,
  down,
};
