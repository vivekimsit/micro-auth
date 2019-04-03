## Setup
1. Create database `microauth` (or any name you like) if not exists
`mysql> create database microauth`


2. Install dependencies:
```
$ npm install
```

3. Create .env file from .env.example file and fill required values.

4. Generate tables from DB schema:
```
$ npm run migrate-db
```
The above command will create all tables with proper schemas.

5. Generate sample data for testing:
```
$ npm run seed-db
``` 
The above command will populate all tables with sample data.

6. Run local server:
```
$ npm run start:dev
```
The above command will start the server in watch mode.

# Other important commands:
## lint
`$ npm run lint`
The above command will run `eslint`.

## logging
All messages are logged in `combine.log` file.
Error messages are logged in `error.log` file.
