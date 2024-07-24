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

const MONGO_URI = 'mongodb://localhost:27017/getAllTasksForUser';

beforeAll(async () => {
    await mongoose.connect(MONGO_URI);
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
});

describe('Get All Tasks For User', () => {

    test('User Not Found With Given ID', async () => {
        const response = await request(app)
            .get('/api/task/getAllTasksForUser/66a07c401408461e3a0ba333');
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User not found with given id');
        expect(response.body.success).toBe(false);
    });

    test('Successful in retrieving all tasks', async () => {
        const user = new User({
            _id: '66a07c401408461e3a0ba333',
            firstName: 'Shaan',
            lastName: 'Agarwal',
            email: 'shaanagarwalofficial@gmail.com',
            password: 'Password'
        });
        await user.save();
        await new Task({
            userId: '66a07c401408461e3a0ba333',
            name: 'Task Name',
            description: 'Task Description',
            priority: 2,
            startTime: '2024-07-24T04:00:00.123Z',
            endTime: '2024-07-24T04:00:00.123Z',
            label: 'Urgent and Important',
            status: 'Pending'
        }).save();
        await new Task({
            userId: '66a07c401408461e3a0ba333',
            name: 'Task Name 2',
            description: 'Task Description',
            priority: 2,
            startTime: '2024-07-24T04:00:00.123Z',
            endTime: '2024-07-24T04:00:00.123Z',
            label: 'Urgent and Important',
            status: 'Pending'
        }).save();
        const response = await request(app)
            .get('/api/task/getAllTasksForUser/66a07c401408461e3a0ba333');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Successful in retrieving tasks for given user');
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.tasks)).toBe(true);
        expect(response.body.tasks.length).toBe(2);
        expect(response.body.tasks).toEqual(expect.arrayContaining([
            expect.objectContaining({
                userId: '66a07c401408461e3a0ba333',
                name: 'Task Name',
                description: 'Task Description',
                priority: 2,
                startTime: '2024-07-24T04:00:00.123Z',
                endTime: '2024-07-24T04:00:00.123Z',
                label: 'Urgent and Important',
                status: 'Pending'
            }),
            expect.objectContaining({
                userId: '66a07c401408461e3a0ba333',
                name: 'Task Name 2',
                description: 'Task Description',
                priority: 2,
                startTime: '2024-07-24T04:00:00.123Z',
                endTime: '2024-07-24T04:00:00.123Z',
                label: 'Urgent and Important',
                status: 'Pending'
            })
        ]));
    });

    test('Internal Server Error', async () => {
        jest.spyOn(Task, 'find').mockImplementation(() => {
            throw new Error('Internal Server Error');
        });
        const response = await request(app)
            .get('/api/task/getAllTasksForUser/66a07c401408461e3a0ba333');
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Internal Server Error');
        expect(response.body.success).toBe(false);
        Task.find.mockRestore();
    });

});