const jwt = require('jsonwebtoken')
const UserModel = require('../models/user')

const userAuth = async (req, res, next) => {
    try {
        const cookies = req.cookies
        const { token } = cookies
        if (!token) {
            return res.status(401).send("Please login")
        }
        const decodedMessage = await jwt.verify(token, "DEV@tinder$1996")
        const { _id } = decodedMessage
        const user = await UserModel.findById(_id)
        if (!user) {
            throw new Error('User doesnot exist')
        }
        req.user = user
        next()
    } catch (err) {
        res.status(400).send('Error: ' + err.message)
    }

}

module.exports = {
    userAuth
}