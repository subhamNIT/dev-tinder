const express = require('express')
const { userAuth } = require('../middlewares/auth')
const connecttionRequest = require('../models/connectionRequest')
const userRouter = express.Router()

userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user
        const connectionRequests = await connecttionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "gender", "age", "about"])

        res.json({
            message: "Data fetched sucessfully",
            connectionRequests
        })
    } catch(err) {
        res.status(400).send('Error: ' + err.message)
    }
})

userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user
        const connectionRequests = await connecttionRequest.find({
            $or: [
                {toUserId: loggedInUser, status: "accepted"},
                {fromUserId: loggedInUser, status: "accepted"}
            ]
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "gender", "age", "about"])

        const data = connectionRequests.map((row) => row.fromUserId)

        res.json({
            data
        })
    }  catch(err) {
        res.status(400).send('Error: ' + err.message)
    }
})

module.exports = userRouter
