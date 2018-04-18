'use strict';

const { expect } = require('chai');
const request = require('super-request');
const server = require('../server');

describe('POST /account/create', () => {
  it('should not create user with existing username', async () => {
    const body = {
      email: 'foo@example.com',
      username: 'demo',
      password: 'demo',
    };
    const resp = await request(server)
      .post('/account/create')
      .form(body)
      .json(true)
      .expect(409)
      .end();

    expect(resp.body).to.be.instanceof(Object);
  })
});

