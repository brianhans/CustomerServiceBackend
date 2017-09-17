var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var path = require('path');

mongoose.Promise = Promise;
var MONGO_URL = 'ds139984.mlab.com:39984/heroku_j85p60mk';
var options = {
	user: 'root',
	pass: 'password'
};
mongoose.connect(MONGO_URL, options);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log("database up");
});

//Load the models
fs.readdirSync(__dirname)
	.filter(function(file) {
		return (file.indexOf(".") !== 0) && (file !== "index.js");
	}).forEach(function(filename) {
		require(path.join(__dirname, filename));
	});

module.exports = db;
