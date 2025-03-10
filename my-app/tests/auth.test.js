// tests/auth.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const { generateAccessToken } = require('../utils/authUtils');

describe('Authentication Endpoints', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.TEST_MONGODB_URI);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await User.deleteMany({});
    });

    test('Register new user', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('accessToken');
        expect(response.body).toHaveProperty('refreshToken');
    });

    test('Login existing user', async () => {
        // Create a user first
        const user = new User({
            name: 'Test User',
            email: 'test@example.com',
            password: await bcrypt.hash('password123', 10)
        });
        await user.save();

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('accessToken');
        expect(response.body).toHaveProperty('refreshToken');
    });
});

// tests/authorization.test.js
describe('Authorization Middleware', () => {
    let adminToken, userToken;

    beforeAll(async () => {
        const admin = new User({
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'admin',
            password: await bcrypt.hash('password123', 10)
        });
        await admin.save();

        const regularUser = new User({
            name: 'Regular User',
            email: 'user@example.com',
            role: 'citizen',
            password: await bcrypt.hash('password123', 10)
        });
        await regularUser.save();

        adminToken = generateAccessToken(admin);
        userToken = generateAccessToken(regularUser);
    });

    test('Admin can access all routes', async () => {
        const response = await request(app)
            .get('/api/admin/dashboard')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(200);
    });

    test('Regular user cannot access admin routes', async () => {
        const response = await request(app)
            .get('/api/admin/dashboard')
            .set('Authorization', `Bearer ${userToken}`);

        expect(response.statusCode).toBe(403);
    });
});