const express = require('express');
const cors = require('cors');
const session = require('express-session');

const userRouter = require('../users/user_router');
const authRouter = require('../auth/auth_router');

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

server.use('/api/users', userRouter);
server.use('/api/auth', authRouter);

server.get('/', (req, res) => {
	res.json({ api: 'server running' });
});

module.exports = server;
