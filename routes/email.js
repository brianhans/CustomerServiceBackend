var mongoose = require('mongoose');
var Constants = require('../constants');
var Chat = mongoose.model('chat');
var Message = mongoose.model('message');
var User = mongoose.model('user');
var ChatUser = mongoose.model('chatUser');

module.exports = function attachHandlers(router, passport) {

	// get requests

	// post requests
	router.post('/incomingEmail', incomingMessage);
};

function incomingMessage(req, res, next) {
	var text = req.body['stripped-text'];
	var from = req.body.From;
	var to = req.body.To;

	Chat.findOne({
		'chatUser.email': from
	}).then(chat => {
		if (!chat) {
			//If the chat doesn't exist create one
			console.log('creating chat');
			return createChat(to);
		} else {
			console.log('found chat ' + chat);
			return Promise.resolve(chat);
		}
	}).then(chat => {
		//Create message object
		var message = new Message();
		message.fromUser = true;
		message.text = text;
		message.save();

		if (chat.messages === undefined) {
			chat.message = [message]
		} else {
			chat.messages.push(message);
		}

		chat.lastMessage = message.text;

		if (chat.chatUser === undefined || chat.chatUser === null) {
			var chatUser = new ChatUser();
			chatUser.email = from;

			if (name) {
				chatUser.name = name;
			} else {
				chatUser.name = from;
			}

			chat.chatUser = chatUser;
		}

		return chat.save();
	}).then(() => {
		return res.status(200).send();
	}).catch(error => {
		next(error);
	});
}

function createChat(email) {
	return User.findOne({
		email: email
	}).then(user => {
		if (!user) {
			const error = new Error('No use owns email: ' + email);
			return Promise.reject(error);
		}

		var chat = new Chat();
		chat.owner = user;
		chat.messages = [];
		chat.type = Constants.EMAIL;
		return Promise.resolve(chat);
	});
}
