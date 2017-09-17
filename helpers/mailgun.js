var api_key = 'key-8a569eb14f2dcaef9bbdc50c019b5665';
var domain = 'sandbox24044024808a4e40bc5d2f8e22dae53c.mailgun.org';
var mailgun = require('mailgun-js')({
	apiKey: api_key,
	domain: domain
});

exports.sendMessage = function sendMessage(to, from, message) {
	return new Promise(function(resolve, reject) {
		var data = {
			from: from,
			to: to,
			subject: 'Reply to you message',
			text: message
		};

		return mailgun.messages().send(data, function(error, body) {
			if (error) {
				return reject(error);
			}

			resolve(body);
		});
	});

}
