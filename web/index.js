'use strict';

const { promisify } = require('es6-promisify');

const server = require('./server');
const config = require('./config');
const { db } = require('../models');

process.on('SIGTERM', async () => {
  const exitCode = await stop(); // eslint-disable-line
  process.exit(exitCode);
});

process.on('SIGINT', async () => {
  // eslint-disable-next-line no-console
  console.log('\n Caught interrupt signal \n');
  const exitCode = await stop(); // eslint-disable-line
  process.exit(exitCode);
});

// do not init the process if a crucial component can not start up
const initDb = db.init;
const initServer = promisify(server.listen.bind(server));
async function init () {
  try {
    await initDb();
    // eslint-disable-next-line no-console
    console.log('Connected to database');
    await initServer(config.port);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Couldn't init thess app: ${err}`);
    // exit code for fatal exception
    process.exit(1);
  }
  // eslint-disable-next-line no-console
  console.log(`App is listening on port ${config.port}`);
}

const closeDb = db.close;
const closeServer = promisify(server.close.bind(server));
async function stop () {
  // start with a normal exit code
  let exitCode = 0;
  try {
    await closeServer();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`Failed to close the app: ${err.message}`);
    exitCode = 1;
  }

  try {
    await closeDb();
    // eslint-disable-next-line no-console
    console.log('Closed database connection');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`Failed to close database: ${err.message}`);
    exitCode = 1;
  }
  return exitCode;
}

module.exports = {
  init,
  stop,
};
