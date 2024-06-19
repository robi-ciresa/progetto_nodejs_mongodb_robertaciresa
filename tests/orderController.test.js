const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../server');
const Order = require('../models/order');
const User = require('../models/user');
const Article = require('../models/article');

const request = supertest(app);

describe('Order Controller Tests', () => {
  let user;
  let articleIds;

  beforeAll(async () => {
    user = await User.create({ firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' });

    const article1 = await Article.create({ title: 'Article 1', size: 'M', images: [{ url: '/uploads/1a75785c-275e-4737-ab55-f8472783d0ba.jpg' }] });

    articleIds = [article1._id];
  });

  afterAll(async () => {
    await User.deleteMany();
    await Article.deleteMany();
    await Order.deleteMany();
  });

  it('should create a new order', async () => {
    const res = await request
      .post('/orders')
      .send({
        userId: user._id,
        articleIds: articleIds
      });

    expect(res.status).toBe(302); 
  });

  it('should update an existing order', async () => {
    const order = await Order.create({ user: user._id, articles: articleIds });

    const newArticle = await Article.create({ title: 'New Article', size: 'L', images: [{ url: '/uploads/new-article.jpg' }] });

    const res = await request
      .put(`/orders/${order._id}`)
      .send({
        articleIds: [...articleIds, newArticle._id]
      });

    expect(res.status).toBe(302);
  });

  it('should delete an existing order', async () => {
    const order = await Order.create({ user: user._id, articles: articleIds });

    const res = await request.delete(`/orders/${order._id}`);
    expect(res.status).toBe(302);
  });
});
