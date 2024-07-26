const CreateTask = require("../audit/TaskController/createTask");
const GetAllTasksForUser = require("../audit/TaskController/getAllTasksForUser");
const Task = require("../models/Task");
const User = require("../models/User");

const createTask = async (req, res) => {
    try {
        const { name, description, priority, startTime, endTime, label } = req.body;
        const userId = req.params.userId;
        if (!name || !description || !priority || !startTime || !endTime || !label) {
            await new CreateTask({ userId, name, description, priority, startTime, endTime, label, response: 'All fields are required', success: false }).save();
            return res.status(400).json({ message: "All fields are required", success: false });
        };
        const user = await User.findById(userId);
        if (!user) {
            await new CreateTask({ userId, name, description, priority, startTime, endTime, label, response: 'User not found with given id', success: false }).save();
            return res.status(404).json({ message: "User not found with given id", success: false });
        };
        const task = new Task({ userId: userId, name, description, priority, startTime, endTime, label });
        await task.save();
        await new CreateTask({ userId, name, description, priority, startTime, endTime, label, response: 'Task has been created successfully', success: true }).save();
        return res.status(201).json({ message: "Task has been created successfully", task, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    };
};

const getAllTasksForUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) {
            await GetAllTasksForUser({ userId, response: 'User not found with given id', success: false }).save();
            return res.status(404).json({ message: "User not found with given id", success: false });
        };
        const tasks = await Task.find({ userId: userId });
        await GetAllTasksForUser({ userId, tasks, response: 'Successful in retrieving tasks for given user', success: true }).save();
        return res.status(200).json({ message: "Successful in retrieving tasks for given user", success: true, tasks });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

const updateTaskForUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { name, description, priority, startTime, endTime, label, status } = req.body;
        if (!name || !description || !priority || !startTime || !endTime || !label || !status) {
            return res.status(404).json({ message: "All fields are required", success: false });
        };
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found with given id", success: false });
        };
        const taskId = req.params.taskId;
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found with given id", success: false });
        };
        if (task.userId != userId) {
            return res.status(401).json({ message: "You are not authorized to access this task", success: false });
        };
        const updatedTask = await Task.findByIdAndUpdate(taskId, {
            name: name,
            description: description,
            priority: priority,
            startTime: startTime,
            endTime: endTime,
            label: label,
            status: status
        });
        return res.status(200).json({ message: "Task has been updated successfully", success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

module.exports = { createTask, getAllTasksForUser, updateTaskForUser };