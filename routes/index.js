exports.attachHandlers = function attachHandlers(server, passport, io) {

	require('./chat')(server, passport, io);
	require('./auth')(server, passport);
	require('./textMessages')(server, passport, io);
	require('./email')(server, passport, io);
};
