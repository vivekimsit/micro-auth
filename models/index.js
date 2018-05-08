'use strict';

['app', 'role', 'user', 'permission', 'db'].forEach(name => {
  Object.assign(exports, require(`./${name}`));
});
