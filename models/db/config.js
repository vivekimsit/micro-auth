'use strict';

const path = require('path');
const joi = require('joi');

const schema = joi
  .object({
    DB_HOST: joi.string().required(),
    DB_PORT: joi
      .number()
      .integer()
      .required(),
    DB_USER: joi.string().required(),
    DB_NAME: joi.string().required(),
    DB_PASSWORD: joi.string().allow(''),
  })
  .unknown()
  .required();

const { error, value } = joi.validate(process.env, schema);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const migrations = {
  directory: path.join(__dirname, './migrations'),
};

const seeds = {
  directory: path.join(__dirname, './seeds/dev'),
};

module.exports = {
  client: 'mysql',
  connection: {
    host: value.DB_HOST,
    port: value.DB_PORT,
    user: value.DB_USER,
    password: value.DB_PASSWORD,
    database: value.DB_NAME,
    multipleStatements: true,
  },
  migrations,
  seeds,
  pool: { min: 1, max: 10 },
};
