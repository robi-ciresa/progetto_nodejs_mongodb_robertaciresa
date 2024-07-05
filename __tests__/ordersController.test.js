const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Order = require('../models/orders');
const Article = require('../models/articles');
const User = require('../models/users');

// Configurazione delle variabili d'ambiente per il test
//process.env.MONGODB_URI = 'mongodb://localhost:27017/testdb';
//process.env.PORT = 3000;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});

afterEach(async () => {
    await Order.deleteMany({});
    await Article.deleteMany({});
    await User.deleteMany({});
});

describe('Orders API', () => {
    it('should create a new order', async () => {
        const user = new User({ firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' });
        await user.save();

        const article = new Article({ title: 'Test Article', size: 'L', isAvailable: true });
        await article.save();

        const res = await request(app)
            .post('/orders')
            .send({
                user: user._id,
                articles: [article._id]
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('user', user._id.toString());
        expect(res.body.articles).toEqual([article._id.toString()]);
    });

    it('should get all orders', async () => {
        const user = new User({ firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' });
        await user.save();

        const article = new Article({ title: 'Test Article', size: 'L', isAvailable: true });
        await article.save();

        const order = new Order({ user: user._id, articles: [article._id] });
        await order.save();

        const res = await request(app).get('/orders');

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0]).toHaveProperty('_id');
        expect(res.body[0]).toHaveProperty('user');
        expect(res.body[0].articles[0]).toHaveProperty('_id', article._id.toString());
        expect(res.body[0].articles[0]).toHaveProperty('title', 'Test Article');
        expect(res.body[0].articles[0]).toHaveProperty('size', 'L');
    });

    it('should get an order by ID', async () => {
        const user = new User({ firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' });
        await user.save();

        const article = new Article({ title: 'Test Article', size: 'L', isAvailable: true });
        await article.save();

        const order = new Order({ user: user._id, articles: [article._id] });
        await order.save();

        const res = await request(app).get(`/orders/${order._id}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('_id', order._id.toString());
        expect(res.body).toHaveProperty('user');
        expect(res.body.articles[0]).toHaveProperty('_id', article._id.toString());
        expect(res.body.articles[0]).toHaveProperty('title', 'Test Article');
        expect(res.body.articles[0]).toHaveProperty('size', 'L');
    });

    it('should update an order', async () => {
        const user = new User({ firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' });
        await user.save();

        const article1 = new Article({ title: 'Test Article 1', size: 'L', isAvailable: true });
        await article1.save();

        const article2 = new Article({ title: 'Test Article 2', size: 'M', isAvailable: true });
        await article2.save();

        const order = new Order({ user: user._id, articles: [article1._id] });
        await order.save();

        const res = await request(app)
            .put(`/orders/${order._id}`)
            .send({
                articles: [article2._id]
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('_id', order._id.toString());
        expect(res.body.articles).toEqual([article2._id.toString()]);

        const updatedArticle1 = await Article.findById(article1._id);
        expect(updatedArticle1.isAvailable).toBe(true);

        const updatedArticle2 = await Article.findById(article2._id);
        expect(updatedArticle2.isAvailable).toBe(false);
    });

    it('should delete an order', async () => {
        const user = new User({ firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' });
        await user.save();

        const article = new Article({ title: 'Test Article', size: 'L', isAvailable: true });
        await article.save();

        const order = new Order({ user: user._id, articles: [article._id] });
        await order.save();

        const res = await request(app).delete(`/orders/${order._id}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Order deleted successfully');

        const deletedOrder = await Order.findById(order._id);
        expect(deletedOrder).toBeNull();

        const updatedArticle = await Article.findById(article._id);
        expect(updatedArticle.isAvailable).toBe(true);
    });
});
