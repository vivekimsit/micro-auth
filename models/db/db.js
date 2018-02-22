'use strict';

const knex = require('knex');

const config = require('./config');

const connection = knex(config);

async function init () {
  Promise.resolve(knex);
}

async function close () {
  await connection.destroy();
}

module.exports = {
  connection,
  init,
  close,
};
