var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// var UserSchema = new Schema({
//     firstName: {type: String},
//     lastName: {type: String},
//     email: {type: String},
//     password: {type: String},
//     member: {type: String},
//     admin: {type: String}
// });

const UserSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
});

module.exports = mongoose.model('User', UserSchema);