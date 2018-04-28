'use strict';

const { Router } = require('express');

const applogin = require('./applogin');
const create = require('./create');
const login = require('./login');
const role = require('./role');
const { catchAsyncErrors } = require('../lib/utils');

const router = new Router();

router.post('/login', catchAsyncErrors(login));
router.post('/create', catchAsyncErrors(create));
router.post('/applogin', catchAsyncErrors(applogin));
router.post('/roles', catchAsyncErrors(role));

module.exports = router;
