'use strict';

const KnexMigrator = require('knex-migrator');
const { expect } = require('chai');
const sinon = require('sinon');
const request = require('super-request');

const server = require('../server');
const { users } = require('../../test/fixtures');

const knexMigrator = new KnexMigrator();

describe('POST /account/login', () => {
  let sandbox;

  beforeEach(async () => {
    await knexMigrator.init();

    sandbox = sinon.sandbox.create();
  });

  afterEach(async () => {
    await knexMigrator.reset({ force: true });

    sandbox.restore();
  });

  it('should login user with valid credentials', async () => {
    const payload = {
      email: users[0].email,
      password: users[0].password,
    };

    return await request(server)
      .post('/account/login')
      .json()
      .form(payload)
      .expect('Content-Type', /json/)
      .expect('Cache-Control', 'no-store') // turn off caching
      .expect(200)
      .end(async (err, res) => {
        if (err) {
          return console.log(err);
        }
        const jsonResponse = JSON.parse(res.body);

        expect(jsonResponse).to.have.own.property('uid');
      });
  });

  it('should not allow login with invalid email', async () => {
    const payload = {
      email: 'invalid@example.com',
      password: users[0].password,
    };

    return await request(server)
      .post('/account/login')
      .json()
      .form(payload)
      .expect('Content-Type', /json/)
      .expect('Cache-Control', 'no-store') // turn off caching
      .expect(404)
      .end(async (err, res) => {});
  });

  it('should not allow login with invalid password', async () => {
    const payload = {
      email: users[0].email,
      password: 'invalid',
    };

    return await request(server)
      .post('/account/login')
      .json()
      .form(payload)
      .expect('Content-Type', /json/)
      .expect('Cache-Control', 'no-store') // turn off caching
      .expect(401)
      .end(async (err, res) => {});
  });
});
