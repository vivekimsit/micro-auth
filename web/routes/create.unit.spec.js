'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const request = require('super-request');
const KnexMigrator = require('knex-migrator');

const server = require('../server');
const { apps, users, roles, permissions } = require('../../test/fixtures');

const knexMigrator = new KnexMigrator();

describe('POST /account/create', () => {
  let sandbox;

  beforeEach(async () => {
    await knexMigrator.init();

    sandbox = sinon.sandbox.create();
  });

  afterEach(async () => {
    await knexMigrator.reset({ force: true });

    sandbox.restore();
  });

  it('should create user with valid app name', async () => {
    const payload = {
      email: 'email@example.com',
      password: 'pass',
      appname: apps[0].name,
      firstname: 'firstname',
      lastname: 'lastname',
    };

    return await request(server)
      .post('/account/create')
      .form(payload)
      .expect('Content-Type', /json/)
      .expect('Cache-Control', 'no-store') // turn off caching
      .expect(201)
      .end((err, res) => {
        if (err) {
          console.log('Error', err);
        }
        const jsonResponse = JSON.parse(res.body);
        expect(jsonResponse).to.have.own.property('email');
        expect(jsonResponse).to.have.own.property('firstname');
        expect(jsonResponse).to.have.own.property('lastname');
        expect(jsonResponse).to.have.own.property('roles');
        expect(jsonResponse).to.have.own.property('permissions');
      });
  });

  it('should fail for invalid app name', async () => {
    const payload = {
      email: 'email@example.com',
      password: 'pass',
      appname: 'invalid',
      firstname: 'firstname',
      lastname: 'lastname',
    };

    return await request(server)
      .post('/account/create')
      .form(payload)
      .expect('Content-Type', /json/)
      .expect('Cache-Control', 'no-store') // turn off caching
      .expect(400)
      .end((err, res) => {
        if (err) {
          console.log('Error', err);
        }
      });
  });

  it('should fail for incomplete data', async () => {
    const payload = {
      email: 'email@example.com',
    };

    return await request(server)
      .post('/account/create')
      .form(payload)
      .expect('Content-Type', /json/)
      .expect('Cache-Control', 'no-store') // turn off caching
      .expect(400)
      .end((err, res) => {
        if (err) {
          console.log('Error', err);
        }
        const jsonResponse = JSON.parse(res.body);
        expect(jsonResponse).to.have.own.property('message');
      });
  });
});
