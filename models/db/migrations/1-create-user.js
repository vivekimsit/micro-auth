'use strict';

const tableName = 'auth_users';

function up (knex) {
  return knex.schema.createTable(tableName, (table) => {
    table.string('uid').primary();
    table.string('username', 256).notNullable();
    table.string('password', 128).notNullable();
    table.string('salt', 128).notNullable();
    table.boolean('is_active').defaultTo(true);
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
