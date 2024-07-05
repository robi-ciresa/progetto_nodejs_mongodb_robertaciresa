const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const Article = require('../models/articles');

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
    await Article.deleteMany({});
});

describe('Articles Controller', () => {
    it('should create an article', async () => {
        const response = await request(app)
            .post('/articles')
            .send({
                title: 'Test Article',
                size: 'Large',
                images: [
                    { data: 'base64-encoded-image', contentType: 'image/jpeg', description: 'Test image' }
                ],
                isAvailable: true
            });

        expect(response.status).toBe(201);
        expect(response.body.title).toBe('Test Article');
        expect(response.body.size).toBe('Large');
        expect(response.body.images.length).toBe(1);
        expect(response.body.isAvailable).toBe(true);
    });

    it('should get all articles', async () => {
        const article = new Article({
            title: 'Test Article',
            size: 'Large',
            images: [
                { data: 'base64-encoded-image', contentType: 'image/jpeg', description: 'Test image' }
            ],
            isAvailable: true
        });
        await article.save();

        const response = await request(app).get('/articles');

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].title).toBe('Test Article');
    });

    it('should get an article by ID', async () => {
        const article = new Article({
            title: 'Test Article',
            size: 'Large',
            images: [
                { data: 'base64-encoded-image', contentType: 'image/jpeg', description: 'Test image' }
            ],
            isAvailable: true
        });
        await article.save();

        const response = await request(app).get(`/articles/${article._id}`);

        expect(response.status).toBe(200);
        expect(response.body.title).toBe('Test Article');
    });

    it('should update an article', async () => {
        const article = new Article({
            title: 'Test Article',
            size: 'Large',
            images: [
                { data: 'base64-encoded-image', contentType: 'image/jpeg', description: 'Test image' }
            ],
            isAvailable: true
        });
        await article.save();
    
        const response = await request(app)
            .put(`/articles/${article._id}`)
            .send({ title: 'Updated Article', 
                    size: 'Medium', 
                    images: [{ data: 'base64-encoded-image', 
                            contentType: 'image/jpeg', 
                            description: 'Test image' }],
                    });
    
        expect(response.status).toBe(200);
        expect(response.body.title).toBe('Updated Article');
        expect(response.body.size).toBe('Medium');
        expect(response.body.isAvailable).toBe(true);
    });
    

    it('should delete an article', async () => {
        const article = new Article({
            title: 'Test Article',
            size: 'Large',
            images: [
                { data: 'base64-encoded-image', contentType: 'image/jpeg', description: 'Test image' }
            ],
            isAvailable: true
        });
        await article.save();

        const response = await request(app).delete(`/articles/${article._id}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Article deleted successfully');
    });
});
