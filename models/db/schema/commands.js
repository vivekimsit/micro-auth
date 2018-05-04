'use strict';

const _ = require('lodash');

const { connection } = require('../db');
const schema = require('./schema');

function addTableColumn(tableName, table, columnName) {
  let column;
  const columnSpec = schema[tableName][columnName];

  // creation distinguishes between text with fieldtype, string with maxlength and all others
  if (columnSpec.type === 'text' && columnSpec.hasOwnProperty('fieldtype')) {
    column = table[columnSpec.type](columnName, columnSpec.fieldtype);
  } else if (columnSpec.type === 'string') {
    if (columnSpec.hasOwnProperty('maxlength')) {
      column = table[columnSpec.type](columnName, columnSpec.maxlength);
    } else {
      column = table[columnSpec.type](columnName, 191);
    }
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
  if (columnSpec.hasOwnProperty('unsigned') && columnSpec.unsigned) {
    column.unsigned();
  }
  if (columnSpec.hasOwnProperty('references')) {
    column.references(columnSpec.references);
  }
  if (columnSpec.hasOwnProperty('defaultTo')) {
    column.defaultTo(columnSpec.defaultTo);
  }
}

async function createTable(table, transaction) {
  const connection = transaction || connection;
  const exists = connection.schema.hasTable(table);
  if (!exists) {
    return null;
  }
  return connection.schema.createTable(table, function (t) {
    const columnKeys = _.keys(schema[table]);
    _.each(columnKeys, function (column) {
      return addTableColumn(table, t, column);
    });
  });
}

async function deleteTable(table, transaction) {
  return (transaction || connection).schema.dropTableIfExists(table);
}

module.exports = {
  createTable,
  deleteTable
};
