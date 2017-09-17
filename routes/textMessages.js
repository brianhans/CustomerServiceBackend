var mongoose = require('mongoose');
var Chat = mongoose.model('chat');
var Message = mongoose.model('message');
var User = mongoose.model('user');
var ChatUser = mongoose.model('chatUser');

module.exports = function attachHandlers(router, passport) {

	// get requests

	// post requests
	router.post('/incomingMessage', incomingMessage);
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
	}, {
		'chatUser.$': 1
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

		var chatUser = new ChatUser();
		chatUser.phoneNumber = from;

		chat.chatUser = chatUser;
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
			return Promise.reject(error);
		}

		var chat = new Chat();
		chat.owner = user;
		chat.messages = [];
		return Promise.resolve(chat);
	});
}
