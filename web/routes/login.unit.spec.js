'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const request = require('super-request');

const userModel = require('../../models/user');
const server = require('../server');

describe('POST /account/login', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should login user with valid credentials', async () => {
    const email = 'demo@example.com';
    const password = 'demo';

    const expected = {
      uid: '1',
      username: 'demo',
      email: 'demo@example.com',
      firstname: 'foo',
      lastname: 'bar',
      language: 'en-US',
    };
    const users = [{
      uid: '1',
      username: 'demo',
      firstname: 'foo',
      lastname: 'bar',
      email: 'demo@example.com',
      language: 'en-US',
      password: '$2a$10$IbfPoCGdLLHh1hyQ9b9UROuNJeyTzk5VMVDf5504mcTJsHfugyaJG',
    }];

    const getUsers = sandbox.stub(userModel, 'getUsers').returns(users);
    await request(server)
      .post('/account/login')
      .form({ email, password })
      .expect(200)
      .expect(expected)
      .end();

    expect(getUsers).to.be.calledOnce;
  });

  it('should not allow login user with invalid password', async () => {
    const users = [{
      password: '$2a$10$IbfPoCGdLLHh1hyQ9b9UROuNJeyTzk5VMVDf5504mcTJsHfugyaJG',
      uid: 1,
    }];
    const email = 'demo@example.com';
    const password = 'd';

    const getUsers = sandbox.stub(userModel, 'getUsers').returns(users);
    await request(server)
      .post('/account/login')
      .form({ email, password })
      .expect(401)
      .end();

    expect(getUsers).to.be.calledOnce;
  });

  it('should not allow login user with invalid email', async () => {
    const email = 'd@example.com';
    const password = 'demo';
    const getUsers = sandbox.stub(userModel, 'getUsers').returns([]);
    await request(server)
      .post('/account/login')
      .form({ email, password })
      .expect(401)
      .end();

    expect(getUsers).to.be.calledOnce;
  });
});
