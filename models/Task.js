const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        default: 'Null'
    },
    priority: {
        type: Number,
        required: true,
        default: 1
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    label: {
        type: String,
        enum: ['Urgent and Important', 'Urgent and Not Important', 'Important But Not Urgent', 'Not Important and Not Urgent'],
        required: true
    },
}, { timestamps: true });

const Task = new mongoose.model('Task', taskSchema);
module.exports = Task;