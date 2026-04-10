const express = require('express')
const { userAuth } = require('../middlewares/auth')
const connecttionRequest = require('../models/connectionRequest')
const UserModel = require('../models/user')
const userRouter = express.Router()

const POPULATE_FIELDS = ["firstName", "lastName", "photoUrl", "gender", "age", "about"]
userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user
        const connectionRequests = await connecttionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", POPULATE_FIELDS)

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
                {toUserId: loggedInUser._id, status: "accepted"},
                {fromUserId: loggedInUser._id, status: "accepted"}
            ]
        }).populate("fromUserId", POPULATE_FIELDS)
        .populate("toUserId", POPULATE_FIELDS)

        const data = connectionRequests.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId
            }
            return row.fromUserId
        })

        res.json({
            data
        })
    }  catch(err) {
        res.status(400).send('Error: ' + err.message)
    }
})

userRouter.get("/feed", userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user
        const page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) || 10
        limit  = limit > 50 ? 50 : limit
        const skip = (page - 1) * limit
        // User should see all the cards except:
        // 1. His own card
        // 2. his connections
        // 3. ignored people
        // 4. already sent the connection request
        const connectionRequests = await connecttionRequest.find({
            $or:[
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ]
        }).select(["fromUserId", "toUserId"])
        const hideUsersFromFeed = new Set()
        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString())
            hideUsersFromFeed.add(req.toUserId.toString())
        })

        const users = await UserModel.find({
            $and: [
                {_id: {$nin: Array.from(hideUsersFromFeed)}},
                {_id: {$ne: loggedInUser._id}}
            ]
        }).select(POPULATE_FIELDS).skip(skip).limit(limit)

        res.send(users)

    }  catch(err) {
        res.status(400).send('Error: ' + err.message)
    }
})

module.exports = userRouter
