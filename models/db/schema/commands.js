'use strict';

const _ = require('lodash');

const { connection } = require('../db');
const schema = require('./schema');

function addTableColumn(tableName, table, columnName) {
  let column;
  const columnSpec = schema[tableName][columnName];

  if (columnSpec.type === 'string') {
    const length =
      (columnSpec.hasOwnProperty('primary') && columnSpec.maxlength) || 191;
    column = table[columnSpec.type](columnName, length);
  } else {
    column = table[columnSpec.type](columnName);
  }

  if (columnSpec.hasOwnProperty('nullable') && columnSpec.nullable === true) {
    column.nullable();
  } else {
    column.nullable(false);
  }

  if (columnSpec.hasOwnProperty('primary') && columnSpec.primary === true) {
    column.primary();
  }
  if (columnSpec.hasOwnProperty('unique') && columnSpec.unique) {
    column.unique();
  }
}

async function createTable(table, transaction) {
  const connection = transaction || connection;
  const exists = connection.schema.hasTable(table);
  if (exists) {
    return null;
  }
  return connection.schema.createTable(table, function(t) {
    const columnKeys = _.keys(schema[table]);
    _.each(columnKeys, function(column) {
      return addTableColumn(table, t, column);
    });
  });
}

async function deleteTable(table, transaction) {
  return (transaction || connection).schema.dropTableIfExists(table);
}

module.exports = {
  createTable,
  deleteTable,
};
