const validator = require('validator')


const validateSignUpData = (req) => {
    const {
        firstName,
        lastName,
        email,
        password
    } = req.body

    if (!firstName || !lastName) {
        throw new Error('Invalid Name')
    } else if (!validator.isEmail(email)) {
        throw new Error('Invalid Email')
    } else if (!validator.isStrongPassword(password)) {
        throw new Error('Not strong password')
    }
}

const validateEditProfileData = async (req) => {
    const allowedEditFields = [
        "skills",
        "firstName",
        "lastName",
        "skills",
        "gender",
        "age",
        "photoUrl",
        "about"
    ]
    const isAllowedUpdate = Object.keys(req.body).every(K => allowedEditFields.includes(K))
    return isAllowedUpdate
}

module.exports = {
    validateSignUpData,
    validateEditProfileData
}