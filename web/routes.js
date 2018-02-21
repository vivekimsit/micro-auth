'use strict';

const { Router } = require('express');

const { catchAsyncErrors } = require('./utils');

const router = new Router();

router.get('/account/login', catchAsyncErrors(async (req, res) => {
  res.send('Hello World');
}));

router.get('/account/create', catchAsyncErrors(async (req, res) => {
  res.send('Hello World');
}));

module.exports = router;
