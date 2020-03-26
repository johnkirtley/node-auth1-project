const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = require('express').Router();

const Users = require('../users/model');
const { jwtSecret } = require('../config/secrets');

router.post('/register', (req, res) => {
	const userInfo = req.body;
	const rounds = process.env.HASHING_ROUNDS || 10;
	const hash = bcrypt.hashSync(userInfo.password, rounds);

	userInfo.password = hash;

	Users.add(userInfo)
		.then(user => {
			res.json(user);
		})
		.catch(err => {
			console.log(err);
		});
});

router.post('/login', (req, res) => {
	const { username, password } = req.body;

	Users.findBy({ username })
		.then(([user]) => {
			console.log(user);
			if (user && bcrypt.compareSync(password, user.password)) {
				const token = generateToken(user);

				req.session.user = {
					id: user.id,
					username: user.username
				};
				res.status(200).json({ message: 'logged in', token });
			} else {
				res.status(401).json({ message: 'Invalid credentials' });
			}
		})
		.catch(err => console.log(err));
});

function generateToken(user) {
	const payload = {
		username: user.username,
		role: user.role || 'user'
	};

	const options = {
		expiresIn: '1h'
	};
	return jwt.sign(payload, jwtSecret, options);
}

router.get('/logout', (req, res) => {
	if (req.session) {
		req.session.destroy();
	} else {
		res.status(200).json({ message: 'already logged out' });
	}
});

module.exports = router;
