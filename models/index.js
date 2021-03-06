'use strict';

['app', 'role', 'user', 'permission', 'token'].forEach(name => {
  Object.assign(exports, require(`./${name}`));
});

exports.db = require('./db');

module.exports = exports;
