const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

var emailRegex = '/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/';

module.exports = function setupAuth(passport) {

	passport.use('local-signup', new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true
		},
		function(username, password, done) {
			User.findOne({
				email: username
			}, function(err, user) {
				if (err) {
					return done(err);
				}
				if (user) {
					return done(null, false, {
						message: 'This email is already in use.'
					});
				} else if (!emailRegex.test(username)) {
					return done(null, false, {
						message: 'Invalid email.'
					});
				} else {
					var newUser = new User();
					newUser.email = username;
					newUser.password = newUser.generateHash(password);
					newUser.companyName = req.body.companyName;
					newUser.phoneNumber = '12016728599';

					//save user
					newUser.save(function(err) {
						if (err)
							throw err;
						return done(null, newUser);
					});
				}
			});
		}
	));

	passport.use('local-login', new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true
		},
		function(username, password, done) {
			User.findOne({
				email: username
			}, function(err, user) {
				if (err) {
					return done(err);
				}
				if (!user) {
					return done(null, false, {
						message: 'Incorrect email.'
					});
				}
				if (!user.validPassword(password)) {
					return done(null, false, {
						message: 'Incorrect password.'
					});
				}
				return done(null, user);
			});
		}
	));
}
