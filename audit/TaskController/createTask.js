const mongoose = require('mongoose');

const createTaskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    name: {
        type: String,
        default: null
    },
    description: {
        type: String,
        default: null
    },
    priority: {
        type: Number,
        default: 0
    },
    startTime: {
        type: Date,
        default: null
    },
    endTime: {
        type: Date,
        default: null
    },
    label: {
        type: String,
        enum: ['Urgent and Important', 'Urgent and Not Important', 'Important But Not Urgent', 'Not Important and Not Urgent'],
    },
    status: {
        type: String,
        enum: ['Pending', 'Ongoing', 'Completed'],
        default: 'Pending',
    },
    response: {
        type: String,
        required: true
    },
    success: {
        type: Boolean,
        required: true
    }
}, {timestamps: true});

const CreateTask = new mongoose.model('CreateTask', createTaskSchema);
module.exports = CreateTask;