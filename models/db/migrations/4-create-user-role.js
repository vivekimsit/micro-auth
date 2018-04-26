'use strict';

const tableName = 'user_role';

function up(knex) {
  return knex.schema.createTable(tableName, table => {
    table.string('user_id').references('uid').inTable('users').notNull().onDelete('cascade');
    table.string('role_id').references('uid').inTable('roles').notNull().onDelete('cascade');
    table.unique(['user_id', 'role_id']);
  });
}

function down(knex) {
  return knex.schema.dropTableIfExists(tableName);
}

module.exports = {
  up,
  down,
};

