'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const request = require('super-request');
const KnexMigrator = require('knex-migrator');

const appModel = require('../../models/app');
const roleModel = require('../../models/role');
const userModel = require('../../models/user');
const server = require('../server');
const { users } = require('../../test/fixtures');

const knexMigrator = new KnexMigrator();

describe('POST /account/applogin', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should authenticate', async () => {
    const [user, ...rest] = users;

    const payload = {
      email: user.email,
      password: user.password,
      appname: 'demo',
    };

    await knexMigrator.reset({ force: true });
    await knexMigrator.init();

    await request(server)
      .post('/account/applogin')
      .json()
      .form(payload)
      .expect('Content-Type', /json/)
      .expect('Cache-Control', 'no-store') // turn off caching
      .expect(200)
      .end((err, res) => {});
  });

  xit('should fail for invalid appname', async () => {
    const payload = {
      email: 'demo@example.com',
      appname: 'example',
      password: 'demo',
    };

    await request(server)
      .post('/account/applogin')
      .set('Accept', 'application/json')
      .form(payload)
      .expect('Content-Type', /json/)
      .expect('Cache-Control', 'no-store') // turn off caching
      .expect(400)
      .end((err, res) => {});
  });

  xit('should fail for invalid app permissions', async () => {
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
        password:
          '$2a$10$IbfPoCGdLLHh1hyQ9b9UROuNJeyTzk5VMVDf5504mcTJsHfugyaJG',
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
      .end((err, res) => {});

    expect(getApps).to.be.calledOnce;
    expect(getByIds).to.be.calledOnce;
    expect(getUsers).to.be.calledOnce;
    expect(getUserRoles).to.be.calledOnce;
  });

  xit('should pass for valid app permissions', async () => {
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
        password:
          '$2a$10$IbfPoCGdLLHh1hyQ9b9UROuNJeyTzk5VMVDf5504mcTJsHfugyaJG',
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
