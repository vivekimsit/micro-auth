'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const request = require('super-request');
const KnexMigrator = require('knex-migrator');

const server = require('../server');
const { apps, users, roles, permissions } = require('../../test/fixtures');

const knexMigrator = new KnexMigrator();

describe('POST /account/applogin', () => {
  let sandbox;

  beforeEach(async () => {
    await knexMigrator.reset({ force: true });
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

    await request(server)
      .post('/account/applogin')
      .json()
      .form(payload)
      .expect('Content-Type', /json/)
      .expect('Cache-Control', 'no-store') // turn off caching
      .expect(200)
      .end((err, res) => {
        if (err) {
          return console.log(err);
        }
        const jsonResponse = JSON.parse(res.body);
        expect(jsonResponse).to.have.own.property('expiration');
        expect(jsonResponse).to.have.own.property('token');
        expect(jsonResponse).to.have.own.property('roles');
        expect(jsonResponse).to.have.own.property('permissions');

        expect(jsonResponse.roles).to.deep.equal([roles[0]]);
        expect(jsonResponse.permissions).to.deep.equal([
          permissions[0],
          permissions[1],
          permissions[2],
        ]);
      });
  });

  it('should fail for unknown appname', async () => {
    const payload = {
      email: users[0].email,
      password: users[0].password,
      appname: 'invalid',
    };

    await request(server)
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

    await request(server)
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

    await request(server)
      .post('/account/applogin')
      .json()
      .form(payload)
      .expect('Content-Type', /json/)
      .expect('Cache-Control', 'no-store') // turn off caching
      .expect(401)
      .end((err, res) => {});
  });
});
