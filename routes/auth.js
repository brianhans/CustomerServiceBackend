var passport;

module.exports = function attachHandlers(router, configuredPassport) {
	passport = configuredPassport;

	// get requests

	// post requests
	router.post('/login', login);
	router.post('/signup', signup);
};

function signup(req, res, next) {
	passport.authenticate('local-signup', function(err, user, info) {
		if (err) {
			return next(err);
		}

		if (!user) {
			return res.send({
				success: false,
				message: 'authentication failed'
			});
		}

		req.login(user, loginErr => {
			if (loginErr) {
				return next(loginErr);
			}
			return res.send({
				success: true,
				message: 'authentication succeeded'
			});
		});
	})(req, res, next);
}

function login(req, res) {

	passport.authenticate('local-login', function(err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.send({
				success: false,
				message: 'No account associated with email'
			});
		}
		req.logIn(user, function(err) {
			if (err) {
				return next(err);
			}
			return res.send({
				success: true,
				message: 'authentication succeeded'
			});
		});
	})(req, res, next);
}
