const LoginUser = require("../audit/UserController/loginUser");
const RegisterUser = require("../audit/UserController/registerUser");
const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!firstName || !lastName || !email || !password) {
            await new RegisterUser({ firstName, lastName, email, password: password ? await bcrypt.hash(password, 10) : null, time: Date.now(), response: 'Fields were missing', success: false }).save();
            return res.status(400).json({ message: "All fields are required", success: false });
        };
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            await new RegisterUser({ firstName, lastName, email, password: await bcrypt.hash(password, 10), time: Date.now(), response: 'User already exists with the given email', success: false }).save();
            return res.status(409).json({ message: "User already exists with the given email", success: false });
        };
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ firstName, lastName, email, password: hashedPassword });
        await newUser.save(newUser);
        await new RegisterUser({ firstName, lastName, email, password: hashedPassword, time: Date.now(), response: 'User has been created successfully', success: true }).save();
        return res.status(201).json({ message: "User has been created successfully", user: newUser, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            await new LoginUser({ email, password: password ? await bcrypt.hash(password, 10) : null, time: Date.now(), response: 'All fields are required', success: false }).save();
            return res.status(400).json({ message: "All fields are required", success: false });
        };
        const user = await User.findOne({ email: email });
        if (!user) {
            await new LoginUser({ email, password: await bcrypt.hash(password, 10), time: Date.now(), response: 'User not found with given email', success: false }).save();
            return res.status(404).json({ message: "User not found with given email", success: false });
        };
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            await new LoginUser({ email, password: await bcrypt.hash(password, 10), time: Date.now(), response: 'Incorrect Password', success: false }).save();
            return res.status(401).json({ message: "Incorrect Password", success: false });
        };
        const jwtSecret = process.env.JWT_SECRET;
        const token = jwt.sign({ userId: user._id }, jwtSecret, {
            expiresIn: '1h'
        });
        await new LoginUser({ email, password: await bcrypt.hash(password, 10), time: Date.now(), response: 'Login successful', success: true }).save();
        return res.status(200).json({ message: "Login successful", user, token, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    };
};

module.exports = { registerUser, loginUser };