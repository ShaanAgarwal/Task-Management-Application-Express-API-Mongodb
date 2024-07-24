const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const User = require('../../models/User');
const app = express();
app.use(express.json());
app.use('/api/user', require('../../routes/userRoutes'));
const bcrypt = require('bcrypt');
require('dotenv').config();

const MONGO_URI = 'mongodb://localhost:27017/loginUser';

beforeAll(async () => {
    await mongoose.connect(MONGO_URI);
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
});

describe('Login User Tests', () => {

    test('Fields are missing Password Not Included', async () => {
        const response = await request(app)
            .post('/api/user/login')
            .send({
                email: 'shaan.agarwal@gmail.com'
            });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('All fields are required');
        expect(response.body.success).toBe(false);
    });

    test('Fields are missing Email Not Included', async () => {
        const response = await request(app)
            .post('/api/user/login')
            .send({
                password: 'Password'
            });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('All fields are required');
        expect(response.body.success).toBe(false);
    });

    test('User not found', async () => {
        const response = await request(app)
            .post('/api/user/login')
            .send({
                email: 'nonexistent.user@gmail.com',
                password: 'Password'
            });
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User not found with given email');
        expect(response.body.success).toBe(false);
    });

    test('Incorrect password', async () => {
        const hashedPassword = await bcrypt.hash('correctPassword', 10);
        await new User({
            firstName: 'Shaan',
            lastName: 'Agarwal',
            email: 'shaan.agarwal@gmail.com',
            password: hashedPassword
        }).save();
        const response = await request(app)
            .post('/api/user/login')
            .send({
                email: 'shaan.agarwal@gmail.com',
                password: 'wrongPassword'
            });
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Incorrect Password');
        expect(response.body.success).toBe(false);
    });

    test('Successful login', async () => {
        const hashedPassword = await bcrypt.hash('correctPassword', 10);
        await new User({
            firstName: 'Shaan',
            lastName: 'Agarwal',
            email: 'shaan@gmail.com',
            password: hashedPassword
        }).save();
        const response = await request(app)
            .post('/api/user/login')
            .send({
                email: 'shaan@gmail.com',
                password: 'correctPassword'
            });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login successful');
        expect(response.body.success).toBe(true);
        expect(response.body.token).toBeTruthy();
        const user = await User.findOne({ email: 'shaan@gmail.com' });
    });

    test('Internal Server Error', async () => {
        jest.spyOn(User, 'findOne').mockImplementation(() => {
            throw new Error('Internal Server Error');
        });
        const response = await request(app)
            .post('/api/user/login')
            .send({
                email: 'shaan.agarwal@gmail.com',
                password: 'Password'
            });
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Internal Server Error');
        expect(response.body.success).toBe(false);
        User.findOne.mockRestore();
    });

});
