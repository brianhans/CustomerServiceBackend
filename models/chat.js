var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chatUserSchema = new Schema({
	name: String,
	profilePicture: String,
	type: String,
	phoneNumber: String,
	id: String,
	email: String
});

var chatSchema = new Schema({
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'user'
	},
	chatUser: chatUserSchema,
	messages: [{
		type: Schema.Types.ObjectId,
		ref: 'message'
	}]
}, {
	timestamps: true
});

mongoose.model('chat', chatSchema);
mongoose.model('chatUser', chatUserSchema);
