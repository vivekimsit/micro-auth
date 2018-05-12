'use strict';

const joi = require('joi');

const schema = joi
  .object({
    SERVER_PORT: joi
      .number()
      .integer()
      .min(0)
      .max(65535),
    NODE_ENV: joi
      .string()
      .allow(['development', 'production', 'test'])
      .default('development'),
  })
  .unknown() // ignore unknown fields
  .required();

const envVars = joi.attempt(process.env, schema);

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.SERVER_PORT,
};
