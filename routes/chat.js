var mongoose = require('mongoose');
var Chat = mongoose.model('chat');
var User = mongoose.model('user');

module.exports = function attachHandlers(router, passport) {

	// get requests
	router.get('/chat', passport.authenticate('local-login'), listChats);

	// post requests
	router.post('/chat', passport.authenticate('local-login'), createChat);
};

function listChats(req, res, next) {
	Chat.find({
		owner: req.user
	}).populate('chatUser').lean().exec(err, chats => {
		if (err) {
			return next(err);
		}

		return res.status(200).send(JSON.stringify(chats));
	});
}

function createChat(req, res, next) {

}
