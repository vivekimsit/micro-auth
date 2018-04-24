'use strict';

const tableName = 'user_app';

function up(knex) {
  return knex.schema.createTable(tableName, table => {
    table.string('user_id').references('uid').inTable('users').notNull().onDelete('cascade');
    table.string('app_id').references('uid').inTable('apps').notNull().onDelete('cascade');
  });
}

function down(knex) {
  return knex.schema.dropTableIfExists(tableName);
}

module.exports = {
  up,
  down,
};
