const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(
        'mongodb+srv://subhamgupta:iWNJ4j3f8IIsOGdJ@mongonamastedev.whabfmw.mongodb.net/devTinder'
    );
}

module.exports = connectDB;