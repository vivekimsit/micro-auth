'use strict';

['app', 'role', 'user', 'db'].forEach(name => {
  Object.assign(exports, require(`./${name}`));
});
