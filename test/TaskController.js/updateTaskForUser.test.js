const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Task = require('../../models/Task');
const User = require('../../models/User');
const app = express();
app.use(express.json());
app.use('/api/task', require('../../routes/taskRoutes'));
require('dotenv').config();
const bcrypt = require('bcrypt');

const MONGO_URI = 'mongodb://localhost:27017/updateTaskForUser';

beforeAll(async () => {
    await mongoose.connect(MONGO_URI);
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
});

describe('Update Task For User', () => {

    test('Fields missing', async () => {
        const response = await request(app)
            .put('/api/task/updateTaskForUser/66a153b3ec224a93e7f6bccc/66a343c41270bc06c6fb9366')
            .send({
                description: "Updated Task Description",
                priority: 4,
                startTime: "2025-07-24T04:00:00.123+00:00",
                endTime: "2025-07-24T04:00:00.123+00:00",
                label: "Urgent and Not Important",
                status: "Ongoing"
            });
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('All fields are required');
        expect(response.body.success).toBe(false);
    });

    test('User not found', async () => {
        const response = await request(app)
            .put('/api/task/updateTaskForUser/66a153b3ec224a93e7f6bccc/66a343c41270bc06c6fb9366')
            .send({
                name: "Updated Task Name",
                description: "Updated Task Description",
                priority: 4,
                startTime: "2025-07-24TO4:00:00.123+00:00",
                endTime: "2025-07-24TO4:00:00.123+00:00",
                label: "Urgent and Not Important",
                status: "Ongoing"
            });
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User not found with given id');
        expect(response.body.success).toBe(false);
    });

    test('Task not found', async () => {
        await new User({
            _id: '66a153b3ec224a93e7f6bccc',
            firstName: "Shaan",
            lastName: "Agarwal",
            email: "shaanagarwalofficial@gmail.com",
            password: "Password"
        }).save();
        const response = await request(app)
            .put('/api/task/updateTaskForUser/66a153b3ec224a93e7f6bccc/66a343c41270bc06c6fb9366')
            .send({
                name: "Updated Task Name",
                description: "Updated Task Description",
                priority: 4,
                startTime: "2025-07-24TO4:00:00.123+00:00",
                endTime: "2025-07-24TO4:00:00.123+00:00",
                label: "Urgent and Not Important",
                status: "Ongoing"
            });
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Task not found with given id');
        expect(response.body.success).toBe(false);
    });

    test('Not authorized to access task', async () => {
        await new User({
            _id: '66a153b3ec224a93e7f6bccd',
            firstName: "First Name",
            lastName: "Last Name",
            email: "email@gmail.com",
            password: "Not Password"
        }).save();
        await new Task({
            _id: '66a343c41270bc06c6fb9366',
            userId: '66a153b3ec224a93e7f6bccc',
            name: "Task Name",
            description: "Task Description",
            priority: 1,
            startTime: "2025-07-24T04:00:00.123+00:00",
            endTime: "2025-07-24T04:00:00.123+00:00",
            label: "Urgent and Important",
            status: "Pending"
        }).save();
        const response = await request(app)
            .put('/api/task/updateTaskForUser/66a153b3ec224a93e7f6bccd/66a343c41270bc06c6fb9366')
            .send({
                name: "Updated Task Name",
                description: "Updated Task Description",
                priority: 4,
                startTime: "2025-07-24TO4:00:00.123+00:00",
                endTime: "2025-07-24TO4:00:00.123+00:00",
                label: "Urgent and Not Important",
                status: "Ongoing"
            });
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('You are not authorized to access this task');
        expect(response.body.success).toBe(false);
    });

    test('Task updated successfully', async () => {
        const response = await request(app)
            .put('/api/task/updateTaskForUser/66a153b3ec224a93e7f6bccc/66a343c41270bc06c6fb9366')
            .send({
                name: "Updated Task Name",
                description: "Updated Task Description",
                priority: 4,
                startTime: "2025-07-24T04:00:00.123+00:00",
                endTime: "2025-07-24T04:00:00.123+00:00",
                label: "Urgent and Not Important",
                status: "Ongoing"
            });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Task has been updated successfully');
        expect(response.body.success).toBe(true);
    });

});