const User = require("../models/User")

exports.createUser = async (req, res) => {
	// Create a new user
	try {
		const user = new User(req.body)
		await user.save()
		res.status(201).send({ status: 201 })
	} catch (error) {
		res.status(400).send({ message: error.message })
	}
}

exports.getAllUser = async (req, res) => {
	User.find().then(users => {
		res.status(200).send(users);
	}).catch(err => {
		res.status(500).send({
			message: err.message
		})
	});
}

exports.login = async (req, res) => {
	//Login a registered user
	try {
		const { email, password } = req.body
		const user = await User.findByCredentials(email, password)
		if (!user) {
			return res.status(401).send({ error: 'Login failed! Check authentication credentials' })
		}
		const token = await user.generateAuthToken()
		res.send({ user, token })
	} catch (error) {
		res.status(400).send({ message: error })
	}
}

exports.logout = async (req, res) => {
	// Log user out of the application
	try {
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token != req.token
		})
		await req.user.save()
		res.send()
	} catch (error) {
		res.status(500).send({ message: error.message })
	}
}

exports.getInfo = async (req, res) => {
	// View logged in user profile
	res.send(req.user)
}

// logout all
exports.logoutAll = async (req, res) => {
	// Log user out of all devices
	try {
		req.user.tokens.splice(0, req.user.tokens.length)
		await req.user.save()
		res.send()
	} catch (error) {
		res.status(500).send({ message: error.message })
	}
}

