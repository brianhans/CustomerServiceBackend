var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
	fromUser: Boolean,
	text: String,
	read: Boolean
}, {
	timestamps: true
});

mongoose.model('message', messageSchema);
