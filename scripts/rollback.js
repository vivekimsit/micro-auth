'use strict';

require('dotenv').config();
const path = require('path');

const config = path.join(path.resolve(process.cwd()));

const KnexMigrator = require('knex-migrator');
const knexMigrator = new KnexMigrator({
  knexMigratorFilePath: config,
});

// check your database health
knexMigrator.isDatabaseOK()
  .then(function() {
    console.log('Database is OK');
  })
  .catch(function(err) {
    console.log(err);
    knexMigrator.rollback();
  });

