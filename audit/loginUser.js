const mongoose = require('mongoose');

const loginUserSchema = new mongoose.Schema({
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

const LoginUser = new mongoose.model('LoginUser', loginUserSchema);
module.exports = LoginUser;