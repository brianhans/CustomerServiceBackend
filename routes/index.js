exports.attachHandlers = function attachHandlers(server, passport) {

	require('./chat')(server, passport);
	require('./auth')(server, passport);
};