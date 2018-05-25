'use strict';
//
// sign with default (HMAC SHA256)
const jwt = require('jsonwebtoken');
const moment = require('moment');

const getExpirationTime = (time=1, unit='hours') =>
  // returns time in seconds
  moment()
    .utc()
    .add(time, unit)
    .unix()
    .toString();

class AccessToken {
  constructor(secret) {
    this.secret = secret;
  }

  create(payload) {
    const expiration = getExpirationTime();
    const token = jwt.sign(payload, this.secret);
    return { expiration, token };
  }
} 

module.exports = {
  AccessToken,
};
