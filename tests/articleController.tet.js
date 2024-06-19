const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../server');
const Article = require('../models/article');

const request = supertest(app);

describe('Article Controller Tests', () => {
  beforeEach(async () => {
    
    const articles = [
      {
        title: 'Test Article 1',
        size: 'Medium',
        images: [{ url: '/uploads/1a75785c-275e-4737-ab55-f8472783d0ba.jpg', description: '' }],
      },
      {
        title: 'Test Article 2',
        size: 'Large',
        images: [{ url: '/uploads/1a75785c-275e-4737-ab55-f8472783d0ba.jpg', description: '' }],
      },
    ];
    await Article.insertMany(articles);
  });

  afterEach(async () => {
    await Article.deleteMany();
  });

  it('should create a new article', async () => {
    const res = await request
      .post('/articles')
      .field('title', 'New Article')
      .field('size', 'Small')
      .attach('image1', 'public/uploads/1a75785c-275e-4737-ab55-f8472783d0ba.jpg');

    expect(res.status).toBe(302);
  });

  it('should update an existing article', async () => {
    const existingArticle = await Article.findOne({ title: 'Test Article 1' });
    const res = await request
      .put(`/articles/${existingArticle._id}`)
      .field('title', 'Updated Article')
      .field('size', 'Large')
      .attach('image1', 'public/uploads/1a75785c-275e-4737-ab55-f8472783d0ba.jpg');

    expect(res.status).toBe(302);
  });

  it('should delete an existing article', async () => {
    const existingArticle = await Article.findOne({ title: 'Test Article 1' });
    const res = await request.delete(`/articles/${existingArticle._id}`);
    expect(res.status).toBe(302);
  });
});
