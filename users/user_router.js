const router = require('express').Router();
const Users = require('./model');

router.get('/', (req, res) => {
	Users.find()
		.then(users => {
			res.json(users);
		})
		.catch(err => {
			console.log(err);
		});
});

module.exports = router;
