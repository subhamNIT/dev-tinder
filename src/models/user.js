const mongoose = require('mongoose');
const validator = require('validator')
const bycrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email address: ' + value)
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error('Enter a string password: ' + value)
            }
        }
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        enum: {
            values: ["male", "female", "others"],
            message: `{VALUE} is not valid`
        }
        // validate(value) {
        //     if (!["male", "female", "others"].includes(value)) {
        //         throw new Error("Gender data is not valid")
        //     }
        // }
    },
    photoUrl: {
        type: String,
        default: "https://www.shutterstock.com/image-vector/isolated-object-avatar-dummy-symbol-260nw-1290296656.jpg",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error('Invalid photo URL: ' + value)
            }
        }
    },
    about: {
        type: String,
        default: "This is the default bio for software developer"
    },
    skills: {
        type: [String],
        validate(value) {
            if (value.length > 10) {
                throw new Error("Skills cannot be more than 10")
            }
        }
    },
}, {
    timestamps: true
});

userSchema.methods.getJWT = async function () {
    const user = this

    const token = await jwt.sign({ _id: user._id }, "DEV@tinder$1996", {
        expiresIn: "1h"
    })

    return token
}

userSchema.methods.verifyPassword = async function (passwordInputByUser) {
    const user = this
    const passwordHash = user.password
    const isPasswordValid = await bycrypt.compare(passwordInputByUser, passwordHash)
    return isPasswordValid
}

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;