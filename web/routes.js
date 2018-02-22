'use strict';

const { Router } = require('express');

const { login } = require('./login');
const { catchAsyncErrors } = require('./utils');

const router = new Router();

router.post('/account/login', catchAsyncErrors(login));

module.exports = router;
