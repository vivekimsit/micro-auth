'use strict';

const http = require('http');
const express = require('express');
const cors = require('cors');
const { logErrors } = require('./utils');

const routes = require('./routes');

const app = express();

app.use(cors());
app.use(routes);
app.use(logErrors);

module.exports = http.createServer(app);
