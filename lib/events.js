'use strict';

const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.setMaxListeners(100);

module.exports = emitter;
