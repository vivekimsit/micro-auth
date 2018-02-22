'use strict';

const { Router } = require('express');

const create = require('./create');
const login = require('./login');
const { catchAsyncErrors } = require('./utils');

const router = new Router();

router.post('/account/login', catchAsyncErrors(login));
router.post('/account/create', catchAsyncErrors(create));

module.exports = router;
