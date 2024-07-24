const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const User = require('../../models/User');
const app = express();
app.use(express.json());
app.use('/api/user', require('../../routes/userRoutes'));
const bcrypt = require('bcrypt');
require('dotenv').config();

const MONGO_URI = 'mongodb://localhost:27017/getAllUsers';

beforeAll(async () => {
    await mongoose.connect(MONGO_URI);
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
});

describe('Get All Users From Database', () => {

    test('Getting All Users From Database', async () => {
        await new User({
            _id: '66a07c401408461e3a0ba333',
            firstName: 'Shaan',
            lastName: 'Agarwal',
            email: 'shaanagarwalofficial@gmail.com',
            password: 'Password'
        }).save();
        await new User({
            _id: '66a07c401408461e3a0ba332',
            firstName: 'Shaan',
            lastName: 'Agarwal',
            email: 'shaanagarwalofficiall@gmail.com',
            password: 'Password'
        }).save();
        const response = await request(app)
            .get('/api/user/getAllUsers');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Successful in fetching all users from database');
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.users)).toBe(true);
        expect(response.body.users.length).toBe(2);
        expect(response.body.users).toEqual(expect.arrayContaining([
            expect.objectContaining({
                _id: '66a07c401408461e3a0ba333',
                firstName: 'Shaan',
                lastName: 'Agarwal',
                email: 'shaanagarwalofficial@gmail.com',
                password: 'Password'
            }),
            expect.objectContaining({
                _id: '66a07c401408461e3a0ba332',
                firstName: 'Shaan',
                lastName: 'Agarwal',
                email: 'shaanagarwalofficiall@gmail.com',
                password: 'Password'
            })
        ]));
    });

    test('Internal Server Error', async () => {
        jest.spyOn(User, 'find').mockImplementation(() => {
            throw new Error('Internal Server Error');
        });
        const response = await request(app)
            .get('/api/user/getAllUsers');
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Internal Server Error');
        expect(response.body.success).toBe(false);
        User.find.mockRestore();
    });

});