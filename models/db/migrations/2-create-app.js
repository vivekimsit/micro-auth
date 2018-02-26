'use strict';

const { tableName } = require('../../app');

function up (knex) {
  return knex.schema.createTable(tableName, (table) => {
    table.string('name', 256).notNullable();
    table.string('secret', 128).notNullable();
    table.timestamps(true, true);
  });
}

function down (knex) {
  return knex.schema.dropTableIfExists(tableName);
}

module.exports = {
  up,
  down,
};
