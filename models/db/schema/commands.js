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

function createTable(table, transaction) {
  return (transaction || connection).schema
    .hasTable(table)
    .then(function(exists) {
      if (exists) {
        return;
      }

      return (transaction || connection).schema.createTable(table, function(t) {
        var columnKeys = _.keys(schema[table]);
        _.each(columnKeys, function(column) {
          return addTableColumn(table, t, column);
        });
      });
    });
}

function deleteTable(table, transaction) {
  return (transaction || connection).schema.dropTableIfExists(table);
}

module.exports = {
  createTable,
  deleteTable,
};
