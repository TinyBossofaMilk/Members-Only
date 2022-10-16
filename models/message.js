var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    text: {type: String},
    date: {type: Date},
    user: {type: Schema.ObjectId, ref:"user"}
});

module.exports = mongoose.model('Message', messageSchema);