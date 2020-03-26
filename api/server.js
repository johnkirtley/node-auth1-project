const express = require('express');
const cors = require('cors');
const session = require('express-session');

const userRouter = require('../users/user_router');
const authRouter = require('../auth/auth_router');
const restricted = require('../auth/restricted');

const server = express();

const sessionConfig = {
	name: 'Authentication Project',
	secret: 'Secrets',
	cookie: {
		maxAge: 1000 * 60 * 60,
		secure: false,
		httpOnly: true
	},
	resave: false,
	saveUninitialized: true
};

server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use('/api/users', restricted, checkRole('user'), userRouter);
server.use('/api/auth', restricted, authRouter);

server.get('/', (req, res) => {
	res.json({ api: 'server running' });
});

module.exports = server;

function checkRole(role) {
	return (req, res, next) => {
		if (
			req.decodedToken &&
			req.decodedToken.role === role &&
			req.decodedToken.role.toLowerCase() === role
		) {
			next();
		} else {
			res.status(403).json({ message: 'unauthorized user' });
		}
	};
}
