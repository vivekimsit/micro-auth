'use strict';

const KnexMigrator = require('knex-migrator');
const jwt = require('jsonwebtoken');
const request = require('super-request');
const sinon = require('sinon');
const { expect } = require('chai');

const server = require('../server');
const { apps, users, roles, permissions } = require('../../test/fixtures');

const knexMigrator = new KnexMigrator();

describe('POST /account/applogin', () => {
  let sandbox;

  beforeEach(async () => {
    await knexMigrator.init();

    sandbox = sinon.sandbox.create();
  });

  afterEach(async () => {
    await knexMigrator.reset({ force: true });

    sandbox.restore();
  });

  it('should authenticate', async () => {
    const payload = {
      email: users[0].email,
      password: users[0].password,
      appname: apps[0].name,
    };

    return await request(server)
      .post('/account/applogin')
      .json()
      .form(payload)
      .expect('Content-Type', /json/)
      .expect('Cache-Control', 'no-store') // turn off caching
      .expect(200)
      .end(async (err, res) => {
        if (err) {
          console.log(err);
        }
        const jsonResponse = JSON.parse(res.body);

        expect(jsonResponse).to.have.own.property('expiration');
        expect(jsonResponse).to.have.own.property('token');

        const token = jsonResponse.token;
        const result = await jwt.verify(token, apps[0].secret);
        expect(result).to.have.own.property('roles');
        expect(result).to.have.own.property('permissions');

        const { roles, permissions } = result;
        expect(roles.length).to.equal(1);
        expect(permissions.length).to.equal(3);
      });
  });

  it('should fail for unknown appname', async () => {
    const payload = {
      email: users[0].email,
      password: users[0].password,
      appname: 'invalid',
    };

    return await request(server)
      .post('/account/applogin')
      .json()
      .form(payload)
      .expect('Content-Type', /json/)
      .expect('Cache-Control', 'no-store') // turn off caching
      .expect(400)
      .end((err, res) => {});
  });

  it('should fail for unknown user', async () => {
    const payload = {
      email: 'invalid@example.com',
      password: users[0].password,
      appname: apps[0].name,
    };

    return await request(server)
      .post('/account/applogin')
      .json()
      .form(payload)
      .expect('Content-Type', /json/)
      .expect('Cache-Control', 'no-store') // turn off caching
      .expect(404)
      .end((err, res) => {});
  });

  it('should fail for invalid user password', async () => {
    const payload = {
      email: users[0].email,
      password: 'invalid',
      appname: apps[0].name,
    };

    return await request(server)
      .post('/account/applogin')
      .json()
      .form(payload)
      .expect('Content-Type', /json/)
      .expect('Cache-Control', 'no-store') // turn off caching
      .expect(401)
      .end((err, res) => {});
  });

  it('should fail for user having different app name', async () => {
    const payload = {
      email: users[0].email,
      password: users[0].password,
      appname: apps[1].name,
    };

    return await request(server)
      .post('/account/applogin')
      .json()
      .form(payload)
      .expect('Content-Type', /json/)
      .expect('Cache-Control', 'no-store') // turn off caching
      .expect(400)
      .end((err, res) => {});
  });
});
