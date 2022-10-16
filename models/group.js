var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var groupSchema = new Schema({
    name: {type: String},
    password: {type: String}
});

module.exports = mongoose.model("group", groupSchema)