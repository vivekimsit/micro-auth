'use strict';

require('dotenv').config();
const { connection } = require('../models/db');

connection.seed.run()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Populated seed data!');
    process.exit(0);
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  });
