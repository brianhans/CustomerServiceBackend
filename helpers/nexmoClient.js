var Constants = require('../constants');
var Nexmo = require('nexmo');

var nexmo = new Nexmo({
	apiKey: Constants.NEXMO_KEY,
	apiSecret: Constants.NEXMO_SECRET
});

module.exports = nexmo;
