const RegisterUser = require("../audit/registerUser");
const User = require("../models/User");
const bcrypt = require('bcrypt');

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

module.exports = { registerUser };