'use strict';

const { tableName } = require('../../activity');

function up(knex) {
  return knex.schema.createTable(tableName, table => {
    table.string('user_id').notNullable();
    table.string('type', 256).notNullable();
    table.string('device', 256);
    table.string('ip', 256);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

function down(knex) {
  return knex.schema.dropTableIfExists(tableName);
}

module.exports = {
  up,
  down,
};

