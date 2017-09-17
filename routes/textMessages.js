var mongoose = require('mongoose');
var Constants = require('../constants');
var Chat = mongoose.model('chat');
var Message = mongoose.model('message');
var User = mongoose.model('user');
var ChatUser = mongoose.model('chatUser');
var io;

var phoneNumberNames = {
	'19545361522': 'Brian Hans',
	'16505750337': 'Nick Swift'
}

module.exports = function attachHandlers(router, passport, socket) {
	io = socket;

	// get requests

	// post requests
	router.post('/incomingMessage', incomingMessage);
};

function incomingMessage(req, res, next) {
	const type = req.body.type;
	const from = req.body.msisdn;
	const to = req.body.to;
	var message = new Message();


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
		message.fromUser = true;
		message.text = req.body.text;
		message.save();

		if (chat.messages === undefined) {
			chat.message = [message]
		} else {
			chat.messages.push(message);
		}

		chat.lastMessage = message.text;

		if (chat.chatUser === undefined || chat.chatUser === null) {
			var chatUser = new ChatUser();
			chatUser.phoneNumber = from;

			var name = phoneNumberNames[from];
			if (name) {
				chatUser.name = name;
			} else {
				chatUser.name = from;
			}

			chat.chatUser = chatUser;
		}

		return chat.save();
	}).then((chat) => {
		console.log('newMessage' + chat.id);
		io.emit('newMessage' + chat.id, {
			message: message.toObject()
		});
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
		chat.type = Constants.TEXT;
		return Promise.resolve(chat);
	});
}
