'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const request = require('super-request');

const appModel = require('../../models/app');
const userModel = require('../../models/user');
const server = require('../server');

describe('POST /account/applogin', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should login user with valid credentials', async () => {
    const payload = {
      email: 'demo@example.com',
      appname: 'demo',
      password: 'demo',
    };

    const expected = {
      uid: '1',
      email: 'demo@example.com',
      firstname: 'foo',
      lastname: 'bar',
      language: 'en-US',
      roles: ['admin', 'test'],
      token: '',
    };
    const users = [
      {
        uid: '1',
        username: 'demo',
        firstname: 'foo',
        lastname: 'bar',
        email: 'demo@example.com',
        language: 'en-US',
        password:
          '$2a$10$IbfPoCGdLLHh1hyQ9b9UROuNJeyTzk5VMVDf5504mcTJsHfugyaJG',
        roles: ['admin', 'test'],
      },
    ];
    const apps = [
      {
        uid: '1',
        name: 'demo',
        secret: 'demo',
      },
    ];

    const getApps = sandbox.stub(appModel, 'getApps').returns(apps);
    const getUsers = sandbox.stub(userModel, 'getUsers').returns(users);

    let response;
    await request(server)
      .post('/account/applogin')
      .form(payload)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(function(res) {
        response = JSON.parse(res);
      })
      .end();

    expect(getUsers).to.be.calledOnce;
    expect(getApps).to.be.calledOnce;

    expect(response).to.have.property('email');
    expect(response).to.have.property('token');
    expect(response).to.have.property('expiration');
    expect(response).to.have.property('roles');
  });
});
