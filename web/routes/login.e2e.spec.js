'use strict';

const { expect } = require('chai');
const request = require('super-request');
const server = require('../server');

describe('POST /account/login', () => {
  it('should login users by email', async () => {
    const email = 'demo@example.com';
    const password = 'demo';
    const resp = await request(server)
      .post('/account/login')
      .form({ email, password })
      .json(true)
      .expect(200)
      .end();

    expect(resp.body).to.be.instanceof(Object);
  });
});
