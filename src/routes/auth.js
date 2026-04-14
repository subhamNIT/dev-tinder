const express = require('express')
const UserModel = require('../models/user')
const bycrypt = require('bcrypt')
const { validateSignUpData } = require('../utils/validation')


const authRouter = express.Router()

authRouter.post('/signup', async (req, res) => {
    try {
        validateSignUpData(req)
        const { firstName, lastName, email, password } = req.body
        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = await UserModel.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).send('Email already registered');
        }
        const passwordHash = await bycrypt.hash(password, 10)
        const user = new UserModel({
            firstName,
            lastName,
            email: normalizedEmail,
            password: passwordHash
        });
        const savedUser = await user.save();
        const token = await savedUser.getJWT()
        res.cookie('token', token, {
            expires: new Date(Date.now() + 8 * 3600000)
        })
        res.json({
            message: "User saved successfully",
            data: savedUser
        });
    }
    catch (err) {
        console.error('Error in saving user:', err.message);
        if (err.code === 11000) {
            return res.status(409).send('Email already registered');
        }
        res.status(400).send('Error in saving user: ' + err.message);
    }

});


authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await UserModel.findOne({ email: email })
        if (!user) {
            throw new Error('Invalid credentials')
        }
        const isPasswordValid = await user.verifyPassword(password)
        if (isPasswordValid) {
            const token = await user.getJWT()
            res.cookie('token', token, {
                expires: new Date(Date.now() + 8 * 3600000)
            })
            res.send(user)
        } else {
            throw new Error("Invalid credentials")
        }
    } catch (err) {
        res.status(400).send("Error: " + err.message)
    }
})

authRouter.post('/logout', async (req, res) => {
    try {
        res.cookie('token', null, {
            expires: new Date(Date.now())
        })
        res.send("User logged out successfully")
    } catch (err) {
        res.status(400).send("Error: " + err.message)
    }
})

module.exports = authRouter