const mongoose = require('mongoose');

const updateTaskForUserSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
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
        type: String,
        default: null
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
        default: null
    },
    status: {
        type: String,
        enum: ['Pending', 'Ongoing', 'Completed'],
        default: 'Pending',
        default: null
    },
    response: {
        type: String,
        required: true
    },
    success: {
        type: Boolean,
        required: false
    }
}, { timestamps: true });

const UpdateTaskForUser = new mongoose.model('UpdateTaskForUser', updateTaskForUserSchema);
module.exports = UpdateTaskForUser;