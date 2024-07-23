const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const User = require('../../models/User');
const app = express();
app.use(express.json());
app.use('/api/user', require('../../routes/userRoutes'));

const MONGO_URI = 'mongodb://localhost:27017/testdb';

beforeAll(async () => {
    await mongoose.connect(MONGO_URI);
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
});

describe('Register User Tests', () => {

    test('Fields are missing Without Password', async () => {
        const response = await request(app)
            .post('/api/user/register')
            .send({
                firstName: 'Shaan',
                lastName: 'Agarwal',
                email: 'shaanagarwalofficial@gmail.com',
            });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('All fields are required');
        expect(response.body.success).toBe(false);
    });

    test('Fields are missing With Password', async () => {
        const response = await request(app)
            .post('/api/user/register')
            .send({
                firstName: 'Shaan',
                lastName: 'Agarwal',
                password: 'Password'
            });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('All fields are required');
        expect(response.body.success).toBe(false);
    });

    test('User already exists', async () => {
        await new User({
            firstName: 'Shaan',
            lastName: 'Agarwal',
            email: 'shaanagarwalofficial@gmail.com',
            password: 'Password'
        }).save();
        const response = await request(app)
            .post('/api/user/register')
            .send({
                firstName: 'Shaan',
                lastName: 'Agarwal',
                email: 'shaanagarwalofficial@gmail.com',
                password: 'Password'
            });
        expect(response.status).toBe(409);
        expect(response.body.message).toBe('User already exists with the given email');
        expect(response.body.success).toBe(false);
    });

    test('Successful user registration', async () => {
        const response = await request(app)
            .post('/api/user/register')
            .send({
                firstName: 'Shaan',
                lastName: 'Agarwal',
                email: 'shaan.agarwal@gmail.com',
                password: 'Password'
            });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User has been created successfully');
        expect(response.body.success).toBe(true);
        const user = await User.findOne({ email: 'shaan.agarwal@gmail.com' });
        expect(user).toBeTruthy();
        expect(user.firstName).toBe('Shaan');
        expect(user.lastName).toBe('Agarwal');
        expect(user.email).toBe('shaan.agarwal@gmail.com');
        expect(user.password).not.toBe('Password');
    });
});
