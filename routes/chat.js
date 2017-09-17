var mongoose = require('mongoose');
var nexmo = require('../helpers/nexmoClient');
var mailgun = require('../helpers/mailgun');
var Constants = require('../constants');
var Chat = mongoose.model('chat');
var User = mongoose.model('user');
var Message = mongoose.model('message');

module.exports = function attachHandlers(router, passport) {

	// get requests
	router.get('/chat', listChats);
	router.get('/chat/:id', getChat);

	// post requests
	router.post('/chat', createChat);
	router.post('/chat/:id/messages', addMessage);
	router.post('/messages/:id/read', readMessage);
};

function listChats(req, res, next) {
	Chat.find({

	}).lean().exec((err, chats) => {
		if (err) {
			return next(err);
		}

		return res.status(200).send(JSON.stringify(chats));
	});
}

function getChat(req, res, next) {
	var id = req.params.id;
	Chat.findOne({
		_id: id
	}).populate('messages').lean().exec((err, chats) => {
		if (err) {
			return next(err);
		}

		return res.status(200).send(JSON.stringify(chats));
	});
}

function addMessage(req, res, next) {
	var id = req.params.id;
	var text = req.body.text;
	var fromUser = req.body.fromUser;

	var message = new Message()
	message.text = text;
	message.fromUser = fromUser;
	var messageSave = message.save();

	var chatUpdate = Chat.findOneAndUpdate({
		_id: id
	}, {
		$push: {
			messages: message
		},
		$set: {
			lastMessage: message.text
		}
	}).then(chat => {
		if (!fromUser && chat.type == Constants.TEXT) {
			return sendSms(id, text);
		} else if (!fromUser && chat.type == Constants.EMAIL) {
			return sendEmail(id, text);
		} else {
			return Promise.resolve();
		}
	});

	Promise.all([chatUpdate, messageSave]).then(() => {
		res.status(200).send(JSON.stringify(message.toObject()));
	}).catch(err => {
		next(err);
	});
}

function readMessage(req, res, next) {
	var id = req.params.id;
	var fromUser = req.body.fromUser;
	var data;

	if (fromUser) {
		data = {
			seenByUser: true
		}
	} else {
		data = {
			seenByAgent: true
		}
	}

	Message.findOneAndUpdate({
		_id: id
	}, {
		$set: data
	}).then(message => {
		res.status(200).send(JSON.stringify(message.toObject()));
	}).catch(err => {
		next(err);
	});
}

function sendSms(chatId, message) {
	return Chat.findById(chatId).populate('owner').then(chat => {
		var from = chat.owner.phoneNumber;
		var to = chat.chatUser.phoneNumber;

		return nexmo.message.sendSms(from, to, message);
	});
}

function sendEmail(chatId, message) {
	return Chat.findById(chatId).populate('owner').then(chat => {
		var from = chat.owner.email;
		var to = chat.chatUser.email;

		return mailgun.sendMessage(to, from, message);
	});
}


function createChat(req, res, next) {

}
