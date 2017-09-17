const express = require('express');
const passport = require('passport');
const database = require('./models');
const bodyParser = require('body-parser')
const morgan = require('morgan')
require('./services/auth')(passport);

function createServer() {
	var server = express();

	// specify middleware
	server.use(morgan('dev'));
	server.use(bodyParser.urlencoded());
	server.use(bodyParser.json());
	server.use(handleError);
	server.use(passport.initialize());
	server.use(function(req, res, next) {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Content-Type", "application/json");
		return next();
	});

	// attach router handlers
	require('./routes').attachHandlers(server, passport);


	//Get port from environment and store in Express.
	var port = normalizePort(process.env.PORT || '3000');
	server.set('port', port);

	server.listen(port, function() {
		console.log('now listening on ' + port);
	});

	return server;
}

function handleError(err, request, response, next) {
	// log the error, for now just console.log
	console.log(err);
	response.status(500).send('This wouldn\'t\'ve happended if you didn\'t' +
		'call this route');
}

function normalizePort(val) {
	var port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}

createServer();
