'use strict';

const http = require('http');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { errorHandler, logErrors } = require('./utils');

const routes = require('./routes');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(cors());
app.use(routes);
app.use(logErrors);
app.use(errorHandler);

module.exports = http.createServer(app);
