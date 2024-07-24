const CreateTask = require("../audit/TaskController/createTask");
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
        if (!userId) {
            await new CreateTask({ name, description, priority, startTime, endTime, label, response: 'User id not present in the parameters', success: false }).save();
            return res.status(400).json({ message: "User id is not present in the parameters", success: false });
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

module.exports = { createTask };