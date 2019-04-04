## authentication

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

## authorization

TODO
