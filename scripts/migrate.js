'use strict';

require('dotenv').config();

const KnexMigrator = require('knex-migrator');
const knexMigrator = new KnexMigrator();

// check your database health
knexMigrator.isDatabaseOK()
  .then(function() {
    console.log('Database is OK');
  })
  .catch(async (err) => {
    if (err.code === 'DB_NOT_INITIALISED' || err.code === 'MIGRATION_TABLE_IS_MISSING') {
      // database is not initialised?
      await knexMigrator.init();
      process.exit();
    } else {
      // database is not migrated?
      knexMigrator.migrate();
    }
  });
