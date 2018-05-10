'use strict';

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const http = require('http');

const { errorHandler, logErrors, logRequests } = require('./lib/utils');
const routes = require('./routes');

const app = express();

// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use((req, res, next) => {
  //const settings = 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0';
  const settings = 'no-store';
  res.set({ 'Cache-Control': settings });
  next();
});

app.use(logRequests);

app.use('/account', routes);
app.use(logErrors);
app.use(errorHandler);

module.exports = http.createServer(app);
