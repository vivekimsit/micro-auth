'use strict';

const knex = require('knex');

const config = require('./config');

async function init () {
  await knex(config);
}

async function close () {
  await knex.destroy;
}

module.exports = {
  init,
  close,
};
