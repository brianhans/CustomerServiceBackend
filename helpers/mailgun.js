var MailGun = require('mailgun-es6');
var mailGun = new MailGun({
	privateApi: 'key-8a569eb14f2dcaef9bbdc50c019b5665',
	publicApi: 'pubkey-ccbda0bbab946e4265b30d58c06e5f57',
	domainName: 'sandbox24044024808a4e40bc5d2f8e22dae53c.mailgun.org'
});

exports.sendMessage = function sendMessage(to, from, message) {
	return mailGun.sendEmail({
		to: [to],
		from: from,
		subject: 'Reply to you message',
		text: message,
		attachments: {}
	}['sandbox24044024808a4e40bc5d2f8e22dae53c.mailgun.org']);
}
