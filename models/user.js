var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	name: String,
	companyName: String,
	phoneNumber: String,
	email: String,
	password: String
});

mongoose.model('user', userSchema);
