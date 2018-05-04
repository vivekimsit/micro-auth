'use strict';

const config = require('./models/db/config');
const packageInfo = require('./package.json');

module.exports = {
  database: config,
  migrationPath: process.cwd() + '/models/db/migrations',
  currentVersion: packageInfo.version,
};
