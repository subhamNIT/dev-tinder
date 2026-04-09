const express = require('express')
const { userAuth } = require('../middlewares/auth')
const ConnectionRequest = require("../models/connectionRequest")
const UserModel = require('../models/user')


const requestRouter = express.Router()

requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id
        const toUserId = req.params.toUserId
        const status = req.params.status

        const allowedStatus = ["ignored", "interested"]

        if (!allowedStatus.includes(status)) {
            return res.status(400).send({
                maessage: 'Invalid status type'
            })
        }

        const toUser = await UserModel.findById(toUserId)
        if (!toUser) {
            res.status(404).send({
                message: "User Not Found"
            })
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })

        if (existingConnectionRequest) {
            return res.status(400).send({
                message: "Connection Request Already Exists"
            })
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const data = await connectionRequest.save()

        res.json({
            message: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
            data
        })

    } catch (err) {
        res.status(400).send('Error: ' + err.message)
    }
})

module.exports = requestRouter