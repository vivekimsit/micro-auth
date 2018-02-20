const joi = require('joi');

/*
const envVars = joi.attempt(
  process.env,
  joi.object({
    USER_API_URL: joi.string().uri({ scheme: 'https' }).required(),
    USER_API_TOKEN: joi.string().length(40).alphanum().required()
  }).unknown().required()
)*/

module.exports = {
  baseURL: envVars.USER_API_URL,
  headers: {
    Authorization: `token ${envVars.USER_API_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'Endava-Training'
  }
}
