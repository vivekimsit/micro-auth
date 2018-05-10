'use strict';

const apps = [
  {
    uid: '1',
    name: 'demo',
    secret: 'demo',
    slug: 'demo-app',
    status: 'enabled'
  },
  {
    uid: '2',
    name: 'demo',
    secret: 'bar',
    slug: 'demo-app',
    status: 'enabled'
  }
];

const users = [
  {
    uid: '1',
    email: 'admin@example.com',
    firstname: 'admin',
    status: 'active',
    locale: 'en_US',
    password: 'admin'
  },
  {
    uid: '2',
    email: 'demo@example.com',
    firstname: 'demo',
    status: 'active',
    locale: 'en_US',
    password: 'demo'
  },
  {
    uid: '3',
    email: 'employee@example.com',
    firstname: 'employee',
    status: 'active',
    locale: 'en_US',
    password: 'employee'
  },
  {
    uid: '4',
    email: 'owner@example.com',
    firstname: 'owner',
    status: 'active',
    locale: 'en_US',
    password: 'owner'
  }
];

const roles = [
  {
    name: 'Administrator',
    description: 'Hotel Administrator',
  },
  {
    name: 'Owner',
    description: 'Hotel Owner',
  },
  {
    name: 'Employee',
    description: 'Hotel Employee',
  }
];

const permissions = [
  {
    name: 'Browse hotel',
    action: 'browse',
    object: 'hotel'
  },
  {
    name: 'Read hotel',
    action: 'read',
    object: 'hotel'
  },
  {
    name: 'Edit hotel',
    action: 'edit',
    object: 'hotel'
  },
  {
    name: 'Add hotel',
    action: 'add',
    object: 'hotel'
  },
  {
    name: 'Delete hotel',
    action: 'destroy',
    object: 'hotel'
  }
];

module.exports = {
  apps, users, roles, permissions
};
