'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const request = require('super-request');

const appModel = require('../../models/app');
const server = require('../server');

describe('POST /account/login', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  xit('should add role with valid request details', async () => {
    const appname = 'demo';
    const role_id = '1';
    const user_id = '1';
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmF0aW9uIjoiMTUyNDI2MjMxNiIsImlhdCI6MTUyNDI1ODcxNn0.qUzqMHW3cts5sxNm2t4fHcCbXOSbxOFa2uz6DtxiiJI';

    const apps = [
      {
        secret: 'demo',
        name: 'demo',
      },
    ];
    const getApps = sandbox.stub(appModel, 'getApps').returns(apps);

    await request(server)
      .post('/account/roles')
      .form({ appname, token, user_id, role_id })
      .expect(200)
      .end();

    expect(getApps).to.be.calledOnce;
  });
});
