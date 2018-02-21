'use strict';

const path = require('path');
const joi = require('joi');

const schema = joi.object({
  DB_HOST: joi.string().required(),
  DB_PORT: joi.number().integer().required(),
  DB_USER: joi.string().required(),
  DB_NAME: joi.string().required(),
  DB_PASSWORD: joi.string().required(),
}).unknown().required();

const { error, value } = joi.validate(process.env, schema);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const migrations = {
  directory: path.join(__dirname, './migrations'),
};

module.exports = {
  client: 'mysql',
  connection: {
    host: value.DB_HOST || 'localhost',
    port: value.DB_PORT || 3306,
    user: value.DB_USER || 'root',
    password: value.DB_PASSWORD || '',
    database: value.DB_NAME || 'root',
    multipleStatements: true,
  },
  migrations,
  pool: { min: 1, max: 10 },
};
