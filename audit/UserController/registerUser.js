const mongoose = require('mongoose');

const registerUserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        default: 'Null'
    },
    lastName: {
        type: String,
        default: 'Null'
    },
    email: {
        type: String,
        default: 'Null'
    },
    password: {
        type: String,
        default: 'Null'
    },
    time: {
        type: Date,
        required: true
    },
    response: {
        type: String,
        required: true
    },
    success: {
        type: Boolean,
        required: true
    }
});

const RegisterUser = new mongoose.model('RegisterUser', registerUserSchema);
module.exports = RegisterUser;