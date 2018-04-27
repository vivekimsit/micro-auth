'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const request = require('super-request');

const appModel = require('../../models/app');
const roleModel = require('../../models/role');
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

  it('should fail for invalid appname', async () => {
    const payload = {
      email: 'demo@example.com',
      appname: 'example',
      password: 'demo',
    };
    const getApps = sandbox.stub(appModel, 'getApps').returns([]);

    await request(server)
      .post('/account/applogin')
      .form(payload)
      .expect('Content-Type', /json/)
      .expect(400)
      .end();

    expect(getApps).to.be.calledOnce;
  });

  it('should fail for invalid app permissions', async () => {
    const payload = {
      email: 'demo@example.com',
      appname: 'demo',
      password: 'demo',
    };
    const users = [
      {
        uid: '1',
        username: 'demo',
        firstname: 'foo',
        lastname: 'bar',
        email: 'demo@example.com',
        language: 'en-US',
        password: '$2a$10$IbfPoCGdLLHh1hyQ9b9UROuNJeyTzk5VMVDf5504mcTJsHfugyaJG',
      },
    ];
    const apps = [
      {
        uid: '2',
        name: 'bar',
        secret: 'bar',
      },
    ];
    const roles = [
      {
        uid: '1',
        app_id: '2',
        name: 'user',
        description: 'App User',
      },
    ];
    const getApps = sandbox.stub(appModel, 'getApps').returns(apps);
    const getByIds = sandbox.stub(appModel, 'getByIds').returns(apps);
    const getUsers = sandbox.stub(userModel, 'getUsers').returns(users);
    const getUserRoles = sandbox.stub(roleModel, 'getUserRoles').returns(roles);

    await request(server)
      .post('/account/applogin')
      .form(payload)
      .expect('Content-Type', /json/)
      .expect(401)
      .end();

    expect(getApps).to.be.calledOnce;
    expect(getByIds).to.be.calledOnce;
    expect(getUsers).to.be.calledOnce;
    expect(getUserRoles).to.be.calledOnce;
  });

  it('should pass for valid app permissions', async () => {
    const payload = {
      email: 'demo@example.com',
      appname: 'demo',
      password: 'demo',
    };
    const users = [
      {
        uid: '1',
        username: 'demo',
        firstname: 'foo',
        lastname: 'bar',
        email: 'demo@example.com',
        language: 'en-US',
        password: '$2a$10$IbfPoCGdLLHh1hyQ9b9UROuNJeyTzk5VMVDf5504mcTJsHfugyaJG',
      },
    ];
    const apps = [
      {
        uid: '1',
        name: 'demo',
        secret: 'demo',
      },
    ];
    const roles = [
      {
        uid: '1',
        app_id: '1',
        name: 'user',
        description: 'App User',
      },
    ];
    const getApps = sandbox.stub(appModel, 'getApps').returns(apps);
    const getByIds = sandbox.stub(appModel, 'getByIds').returns(apps);
    const getUsers = sandbox.stub(userModel, 'getUsers').returns(users);
    const getUserRoles = sandbox.stub(roleModel, 'getUserRoles').returns(roles);

    await request(server)
      .post('/account/applogin')
      .form(payload)
      .expect('Content-Type', /json/)
      .expect(200)
      .end();

    expect(getApps).to.be.calledOnce;
    expect(getByIds).to.be.calledOnce;
    expect(getUsers).to.be.calledOnce;
    expect(getUserRoles).to.be.calledOnce;
  });
});
