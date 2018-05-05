'use strict';

const Promise = require('bluebird');

const { commands, schema } = require('../../schema');
const logger = require('../../../../web/lib/logger');
const schemaTables = Object.keys(schema);

module.exports.up = function createTables({ connection }) {
  return Promise.mapSeries(schemaTables, function createTable(table) {
    logger.info(`Creating table: ${table}`);
    return commands.createTable(table, connection).catch(err => console.log(err));
  });
};

module.exports.down = function dropTables({ connection }) {
  schemaTables.reverse();
  return Promise.mapSeries(schemaTables, function dropTable(table) {
    logger.info(`Dropping table: ${table}`);
    return commands.deleteTable(table, connection);
  });
};
