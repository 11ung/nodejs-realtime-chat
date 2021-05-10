const jwt = require('jsonwebtoken')
const User = require('../models/User')

const authSocket = async (socket, next) => {
    try {
        const { token } = socket.handshake.auth;
        const data = jwt.verify(token, process.env.JWT_KEY)
        const user = await User.findOne({ _id: data._id, 'tokens.token': token })
        if (!user) {
            throw new Error()
        }
        socket.user =  user
        socket.token = token
        next();
    } catch (error) {
        next(new Error('Authentication error'));
    }

}
module.exports = authSocket