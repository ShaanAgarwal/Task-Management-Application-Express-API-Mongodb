const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Task = require('../../models/Task');
const app = express();
app.use(express.json());
app.use('/api/task', require('../../routes/taskRoutes'));
const bcrypt = require('bcrypt');
const User = require('../../models/User');
require('dotenv').config();

const MONGO_URI = 'mongodb://localhost:27017/createTask';

beforeAll(async () => {
    await mongoose.connect(MONGO_URI);
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
});

describe('Create Task Tests', () => {

    test('Fields are missing', async () => {
        const response = await request(app)
            .post('/api/task/createTask/66a07c401408461e3a0ba212')
            .send({
                "description": "This is the task description",
                "priority": 2,
                "label": "Urgent and Important"
            });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('All fields are required');
        expect(response.body.success).toBe(false);
    });

    test('User Not Found With Given ID', async () => {
        const hashedPassword = await bcrypt.hash('Password', 10);
        await new User({
            firstName: 'Shaan',
            lastName: 'Agarwal',
            email: 'shaanagarwal@gmail.com',
            password: hashedPassword
        }).save();
        const response = await request(app)
            .post('/api/task/createTask/66a07c401408461e3a0ba333')
            .send({
                "name": "Task Name",
                "description": "This is the task description",
                "priority": 2,
                "startTime": "2024-07-24T04:00:00.123+00:00",
                "endTime": "2024-07-24T04:00:00.123+00:00",
                "label": "Urgent and Important"
            });
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User not found with given id');
        expect(response.body.success).toBe(false);
    });

});