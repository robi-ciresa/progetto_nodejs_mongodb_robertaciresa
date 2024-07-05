const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../models/users');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();
});

afterEach(async () => {
    await User.deleteMany({});
});

describe('Users Controller', () => {
    it('should create a user', async () => {
        const response = await request(app)
            .post('/users')
            .send({
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com'
            });

        expect(response.status).toBe(201);
        expect(response.body.firstName).toBe('Test');
        expect(response.body.lastName).toBe('User');
        expect(response.body.email).toBe('test@example.com');
    });

    it('should get all users', async () => {
        const user = new User({ firstName: 'Test', lastName: 'User', email: 'test@example.com' });
        await user.save();

        const response = await request(app).get('/users');

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].firstName).toBe('Test');
    });

    it('should get a user by ID', async () => {
        const user = new User({ firstName: 'Test', lastName: 'User', email: 'test@example.com' });
        await user.save();

        const response = await request(app).get(`/users/${user._id}`);

        expect(response.status).toBe(200);
        expect(response.body.firstName).toBe('Test');
    });

    it('should update a user', async () => {
        const user = new User({ firstName: 'Test', lastName: 'User', email: 'test@example.com' });
        await user.save();

        const response = await request(app)
            .put(`/users/${user._id}`)
            .send({ firstName: 'Updated' });

        expect(response.status).toBe(200);
        expect(response.body.firstName).toBe('Updated');
    });

    it('should delete a user', async () => {
        const user = new User({ firstName: 'Test', lastName: 'User', email: 'test@example.com' });
        await user.save();

        const response = await request(app).delete(`/users/${user._id}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User deleted successfully');
    });
});
