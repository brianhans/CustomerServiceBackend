var mongoose = require('mongoose');
var Chat = mongoose.model('chat');
var User = mongoose.model('user');

module.exports = function attachHandlers(router, passport) {

	// get requests
	router.get('/chat', listChats);

	// post requests
	router.post('/chat', createChat);
};

function listChats(req, res, next) {
	Chat.findOne({

	}).populate('chatUser').lean().exec((err, chats) => {
		if (err) {
			return next(err);
		}

		return res.status(200).send(JSON.stringify(chats));
	});
}

function createChat(req, res, next) {

}
