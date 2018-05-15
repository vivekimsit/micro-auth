const joi = require('joi');

const schema = joi
  .object({
    NODE_ENV: joi
      .string()
      .allow(['development', 'production', 'test'])
      .default('development'),
    LOGGER_LEVEL: joi
      .string()
      .allow(['test', 'error', 'warn', 'info', 'verbose', 'debug', 'silly'])
      .when('NODE_ENV', {
        is: 'development',
        then: joi.default('silly'),
      })
      .when('NODE_ENV', {
        is: 'production',
        then: joi.default('info'),
      })
      .when('NODE_ENV', {
        is: 'test',
        then: joi.default('error'),
      }),
  })
  .unknown() // ignore unknown fields
  .required();

const envVars = joi.attempt(process.env, schema);

module.exports = {
  env: envVars.NODE_ENV,
  level: envVars.LOGGER_LEVEL,
};
