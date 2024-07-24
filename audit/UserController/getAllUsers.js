const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: "Empty"
    }
}, { timestamps: true });

const getAllUsersSchema = new mongoose.Schema({
    users: [userSchema],
    response: {
        type: String,
        required: true
    },
    success: {
        type: Boolean,
        required: true
    }
}, {timestamps: true});

const GetAllUsers = new mongoose.model('GetAllUsers', getAllUsersSchema);
module.exports = GetAllUsers;