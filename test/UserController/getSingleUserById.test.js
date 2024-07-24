const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const User = require('../../models/User');
const app = express();
app.use(express.json());
app.use('/api/user', require('../../routes/userRoutes'));
const bcrypt = require('bcrypt');
require('dotenv').config();

const MONGO_URI = 'mongodb://localhost:27017/getSingleUserById';

beforeAll(async () => {
    await mongoose.connect(MONGO_URI);
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
});

describe('Get A Single User From The Database By Id', () => {

    test('User With Given Id Does Not Exist', async () => {
        const response = await request(app)
            .get('/api/user/getUser/66a153b3ec224a93e7f6bccc');
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User with given id does not exist');
        expect(response.body.success).toBe(false);
    });

    test('Successful in retrieving the details of single user', async () => {
        await new User({
            _id: '66a07c401408461e3a0ba333',
            firstName: 'Shaan',
            lastName: 'Agarwal',
            email: 'shaanagarwalofficial@gmail.com',
            password: await bcrypt.hash('Password', 10),
            profilePicture: 'Empty'
        }).save();
        const response = await request(app)
            .get('/api/user/getUser/66a07c401408461e3a0ba333');
        const { user } = response.body;
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Successful in retrieving user');
        expect(response.body.success).toBe(true);
        expect(user).toEqual(expect.objectContaining({
            _id: '66a07c401408461e3a0ba333',
            firstName: 'Shaan',
            lastName: 'Agarwal',
            email: 'shaanagarwalofficial@gmail.com',
            profilePicture: 'Empty',
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            __v: expect.any(Number)
        }));
    });

    test('Internal Server Error', async () => {
        jest.spyOn(User, 'findById').mockImplementation(() => {
            throw new Error('Internal Server Error');
        });
        const response = await request(app)
            .get('/api/user/getUser/66a07c401408461e3a0ba333');
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Internal Server Error');
        expect(response.body.success).toBe(false);
        User.findById.mockRestore();
    });

});