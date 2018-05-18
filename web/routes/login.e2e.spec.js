'use strict';

const { expect } = require('chai');
const request = require('super-request');

const server = require('../server');
const { users } = require('../../test/fixtures');

describe('POST /account/login', () => {
  xit('should login users by email', async () => {
    const payload = {
      email: users[0].email,
      password: users[0].password,
    };

    const resp = await request(server)
      .post('/account/login')
      .form(payload)
      .json(true)
      .expect(200)
      .end();

    expect(resp.body).to.be.instanceof(Object);
  });
});
