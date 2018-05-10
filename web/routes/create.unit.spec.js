'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const request = require('super-request');

const appModel = require('../../models/app');
const userModel = require('../../models/user');
const roleModel = require('../../models/role');
const server = require('../server');

describe('POST /account/create', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  xit('should create user with valid credentials', async () => {
    const payload = {
      appname: 'demo',
      email: 'foo@example.com',
      firstname: 'foo',
      lastname: 'bar',
      password: 'demo',
      username: 'demo',
    };
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

    const addUser = sandbox.stub(userModel, 'addUser').returns({
      uid: '1',
      appname: 'demo',
      email: 'foo@example.com',
      firstname: 'foo',
      lastname: 'bar',
      username: 'demo',
      phone: '',
      language: 'en-US',
      roles: [],
    });
    const getApps = sandbox.stub(appModel, 'getApps').returns(apps);
    const getUsers = sandbox.stub(userModel, 'getUsers').returns([]);
    const getRoles = sandbox.stub(roleModel, 'getRoles').returns(roles);
    const addUserRole = sandbox
      .stub(roleModel, 'addUserRole')
      .returns({ user_id: '1', role_id: '1' });

    let response;
    await request(server)
      .post('/account/create')
      .form(payload)
      .expect(201)
      .expect(function(res) {
        response = JSON.parse(res);
      })
      .end();

    expect(getUsers).to.be.calledOnce;
    expect(getRoles).to.be.calledOnce;
    expect(getApps).to.be.calledOnce;
    expect(addUser).to.be.calledOnce;
    expect(addUserRole).to.be.calledOnce;

    expect(response).to.have.property('email');
    expect(response).to.have.property('roles');
  });
});
