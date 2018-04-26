'use strict';

const { tableName } = require('../../role');

function up(knex) {
  return knex.schema.createTable(tableName, table => {
    table.string('uid').primary();
    table.string('app_id', 256).notNullable();
    table.string('name', 256).notNullable();
    table.string('description', 256).notNullable();
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

