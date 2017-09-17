var mongoose = require('mongoose');
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
};

function listChats(req, res, next) {
	Chat.find({

	}).populate('chatUser').lean().exec((err, chats) => {
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
	}).populate('chatUser messages').lean().exec((err, chats) => {
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
	});

	Promise.all([chatUpdate, messageSave]).then(() => {
		res.status(200).send(JSON.stringify(message.toObject()));
	}).catch(err => {
		next(err);
	});
}

function createChat(req, res, next) {

}
