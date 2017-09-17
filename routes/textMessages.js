var mongoose = require('mongoose');
var Chat = mongoose.model('chat');
var Message = mongoose.model('message');
var User = mongoose.model('user');

module.exports = function attachHandlers(router, passport) {

	// get requests
	router.get('/incomingMessage', incomingMessage);

	// post requests
};

function incomingMessage(req, res, next) {
	const type = req.body.type;
	const from = req.body.msisdn;
	const to = req.body.to;

	if (type != 'text') {
		return res.status(200).send();
	}

	Chat.findOne({
		'chatUser.phoneNumber': from
	}).then(chat => {
		if (!chat) {
			//If the chat doesn't exist create one
			return createChat(to);
		} else {
			return Promise.resolve(chat);
		}
	}).then(chat => {
		//Create message object
		var message = new Message();
		message.fromUser = true;
		message.text = req.body.text;

		chat.messages.push(message);
		return chat.save();
	}).then(() => {
		return res.status(200).send();
	}).catch(error => {
		next(error);
	});
}

function createChat(phoneNumber) {
	return User.findOne({
		phoneNumber: phoneNumber
	}).then(user => {
		if (!user) {
			const error = new Error('No use owns phone number: ' + phoneNumber);
			reject(error);
		}
		var chat = new Chat();
		chat.owner = user;
		chat.messages = [];
		resolve(chat);
	});
}
