# micro-auth
Authentication microservice

### run
`$ npm run start:dev`

The above command will start the server in watch mode.

### lint
`$ npm run lint`

The above command will run `eslint`.

### migrate
`$ npm run migrate-db`

The above command will create all tables with proper schemas.

### seed data
`$ npm run seed-db`

The above command will populate all tables with sample data.

### setup
Create database `microauth` if not exists

`mysql> create database microauth`

```
$ npm install
$ npm run migrate-db
$ npm run seed-db
$ npm run start:dev
```

### logging

All messages are logged in `combine.log` file.

Error messages are logged in `error.log` file.

### authentication

Authenticating an user

Method: `POST`

Endpoint:

`/account/login`

Body:

`
{
  username='demo',
  password='demo'
}
`

Authenticate an user for an app name `demo`

Method: `POST`

Endpoint:

`/account/applogin`

Body:

`
{
  username='demo',
  password='demo',
  appname='demo'
}
`

### authorization

TODO

### TODO

- [x] Add jwt support
- [x] Logging
- [x] Register users per app
- [ ] Add tests
- [ ] Add githooks
