var mongoose = require('mongoose');
var nexmo = require('../helpers/nexmoClient');
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
	message.fromUser = req.body.fromUser;
	var messageSave = message.save();

	var chatUpdate = Chat.findOneAndUpdate({
		_id: id
	}, {
		$push: {
			messages: message
		}
	}).then(chat => {
		if (!fromUser && chat.type == Constants.TEXT) {
			return sendSms(id, text);
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

	Message.findOneAndUpdate({
		_id: id
	}, {
		$set: {
			read: true
		}
	}).then(message => {
		res.status(200).send(JSON.stringify(message.toObject()));
	}).catch(err => {
		next(err);
	});
}

function sendSms(chatId, message) {
	return Chat.findById(chatId).populate('owner').then(chat => {
		var from = chat.owner.phoneNUmber;
		var to = chat.chatUser.phoneNumber;

		return nexmoCLient.message.sendSms(from, to, message);
	})
}


function createChat(req, res, next) {

}
