module.exports = {
  users: {
    email: {type: 'string', nullable: false, unique: true, validations: {isEmail: true}},
    firstname: {type: 'string', nullable: true},
    lastname: {type: 'string', nullable: true},
    lastname: {type: 'string', nullable: true},
    locale: {type: 'string', maxlength: 6, nullable: true},
    password: {type: 'string', maxlength: 128, nullable: false},
    phone: {type: 'string', nullable: true},
    status: {type: 'string', maxlength: 50, nullable: false, defaultTo: 'active'},
    uid: {type: 'string', nullable: false, primary: true},
    updated_at: {type: 'dateTime', nullable: true},
    created_at: {type: 'dateTime', nullable: false},
  }
}
