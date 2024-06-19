const request = require('supertest');
const app = require('../server');
const User = require('../models/user');
const Order = require('../models/order');
const Article = require('../models/article');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

describe('JSON Controller Tests', () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await Order.deleteMany({});
        await Article.deleteMany({});

        const userData = [
            { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
            { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com' }
        ];
        await User.insertMany(userData);

        const validUserId = new ObjectId();
        const validArticleId1 = new ObjectId();
        const validArticleId2 = new ObjectId();

        const orderData = [
            { 
                user: validUserId, 
                articles: [validArticleId1, validArticleId2],
                orderDate: new Date() 
            }
        ];
        await Order.insertMany(orderData);

        const articleData = [
            { _id: validArticleId1, title: 'Article 1', size: 'M' },
            { _id: validArticleId2, title: 'Article 2', size: 'L' }
        ];
        await Article.insertMany(articleData);
    });

    describe('GET /json/users', () => {
        it('should return all users', async () => {
            const res = await request(app).get('/json/users');
            expect(res.status).toEqual(200);
            expect(res.body.length).toBeGreaterThan(0);
        });

        it('should handle errors when fetching users', async () => {
            jest.spyOn(User, 'find').mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/json/users');
            expect(res.status).toEqual(500);
            expect(res.body).toEqual({ error: 'Database error' });

            jest.restoreAllMocks();
        });
    });

    describe('GET /json/orders', () => {
        it('should return all orders', async () => {
            const res = await request(app).get('/json/orders');
            expect(res.status).toEqual(200);
            expect(res.body.length).toBeGreaterThan(0);
        });

        it('should handle errors when fetching orders', async () => {
            jest.spyOn(Order, 'find').mockImplementation(() => ({
                populate: jest.fn().mockImplementation(() => ({
                    populate: jest.fn().mockRejectedValue(new Error('Database error'))
                }))
            }));

            const res = await request(app).get('/json/orders');
            expect(res.status).toEqual(500);
            expect(res.body).toEqual({ error: 'Database error' });

            jest.restoreAllMocks();
        });
    });

    describe('GET /json/articles', () => {
        it('should return all articles', async () => {
            const res = await request(app).get('/json/articles');
            expect(res.status).toEqual(200);
            expect(res.body.length).toBeGreaterThan(0);
        });

        it('should handle errors when fetching articles', async () => {
            jest.spyOn(Article, 'find').mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/json/articles');
            expect(res.status).toEqual(500);
            expect(res.body).toEqual({ error: 'Database error' });

            jest.restoreAllMocks();
        });
    });

    describe('GET /json/orders/filter', () => {
        it('should filter orders by articleId and date', async () => {
            const validArticleId = new ObjectId();
            const res = await request(app)
                .get('/json/orders/filter')
                .query({ articleId: validArticleId.toString(), date: '2024-06-20' });

            expect(res.status).toEqual(200);
        });

        it('should handle errors when filtering orders', async () => {
            jest.spyOn(Order, 'find').mockImplementation(() => ({
                populate: jest.fn().mockImplementation(() => ({
                    populate: jest.fn().mockRejectedValue(new Error('Database error'))
                }))
            }));

            const res = await request(app).get('/json/orders/filter');
            expect(res.status).toEqual(500);
            expect(res.body).toEqual({ error: 'Database error' });

            jest.restoreAllMocks();
        });
    });

    describe('GET /json/users/filter', () => {
        it('should filter users by firstName, lastName, and email', async () => {
            const res = await request(app)
                .get('/json/users/filter')
                .query({ firstName: 'John' });

            expect(res.status).toEqual(200);
        });

        it('should handle errors when filtering users', async () => {
            jest.spyOn(User, 'find').mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/json/users/filter');
            expect(res.status).toEqual(500);
            expect(res.body).toEqual({ error: 'Database error' });

            jest.restoreAllMocks();
        });
    });

    describe('GET /json/articles/filter', () => {
        it('should filter articles by title and size', async () => {
            const res = await request(app)
                .get('/json/articles/filter')
                .query({ title: 'Article 1' });

            expect(res.status).toEqual(200);
        });

        it('should handle errors when filtering articles', async () => {
            jest.spyOn(Article, 'find').mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/json/articles/filter');
            expect(res.status).toEqual(500);
            expect(res.body).toEqual({ error: 'Database error' });

            jest.restoreAllMocks();
        });
    });
});