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

const getSingleUserByIdSchema = new mongoose.Schema({
    user: userSchema,
    response: {
        type: String,
        required: true
    },
    success: {
        type: Boolean,
        required: true
    }
}, {timestamps: true});

const GetSingleUserById = mongoose.model('GetSingleUserById', getSingleUserByIdSchema);
module.exports = GetSingleUserById;