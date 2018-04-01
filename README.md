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

- Authenticating an user

Method:

`POST`

Endpoint:

`/account/login`

Body:

`
{
  username='demo',
  password='demo'
}
`

Reponse:

`
{
  isAuthorized: <boolean>,
  uid: <number>
}
`

- Authenticating an user against app named `demo`

Method:

`POST`

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

Reponse:

`
{
  expiration: <seconds>,
  token: <jwt_token>
}
`

### authorization

TODO

### Docker

#### Build image

`$ docker build -t <image_name>:<tag_name> <context>`

eg:

`$ docker build -t ubuntu-node:0.1 .`

#### Run container

`$ docker run -d -p 8000:8000 ubuntu-node:0.1 `

#### Misc

See running container

`$ docker ps`

Check logs

`$ docker logs <container_id>`

Stop container

`$ docker stop <container_id>`

### TODO

- [x] Add jwt support
- [x] Logging
- [x] Register users per app
- [ ] Add tests
- [ ] Add githooks
