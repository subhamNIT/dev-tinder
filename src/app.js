require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser')
const cors = require('cors')
const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestsRouter = require('./routes/requests');
const userRouter = require('./routes/user');

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true //require to save the token in the cookies
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestsRouter)
app.use("/", userRouter)

connectDB().then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT, () => {
        console.log('Server is running on port 3000');
    });
}).catch((error) => {
    console.error(error);
});