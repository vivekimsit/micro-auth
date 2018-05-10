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
    DB_DEBUG: joi.boolean().default(false),
    DB_CLIENT: joi
      .string()
      .allow(['mysql', 'sqlite3'])
      .when('NODE_ENV', {
        is: 'development',
        then: joi.default('mysql'),
      })
      .when('NODE_ENV', {
        is: 'production',
        then: joi.default('mysql'),
      })
      .when('NODE_ENV', {
        is: 'test',
        then: joi.default('sqlite3'),
      }),
  })
  .unknown()
  .required();

const { error, value } = joi.validate(process.env, schema);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

if (value.DB_CLIENT === 'sqlite3') {
  exports = {
    client: value.DB_CLIENT,
    connection: {
      filename: './microauth.db',
    },
    useNullAsDefault: true,
    debug: value.DEBUG,
  };
} else {
  exports = {
    client: value.DB_CLIENT,
    connection: {
      host: value.DB_HOST,
      port: value.DB_PORT,
      user: value.DB_USER,
      password: value.DB_PASSWORD,
      database: value.DB_NAME,
      multipleStatements: true,
    },
    pool: { min: 1, max: 10 },
    debug: value.DEBUG,
  };
}

module.exports = exports;
