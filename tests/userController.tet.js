const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../server');
const User = require('../models/user');

const request = supertest(app);

describe('User Controller Tests', () => {
  beforeEach(async () => {
    const users = [
      { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
      { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com' }
    ];
    await User.insertMany(users);
  });

  afterEach(async () => {
    await User.deleteMany();
  });

  it('should create a new user', async () => {
    const res = await request.post('/users').send({
      firstName: 'Alice',
      lastName: 'Wonderland',
      email: 'alice@example.com'
    });
    expect(res.status).toBe(302);
  });

  it('should update an existing user', async () => {
    const existingUser = await User.findOne({ firstName: 'John' });
    const res = await request.put(`/users/${existingUser._id}`).send({
      firstName: 'Johnny',
      lastName: 'Doe',
      email: 'johnny.doe@example.com'
    });
    expect(res.status).toBe(302);
  });

  it('should delete an existing user', async () => {
    const existingUser = await User.findOne({ firstName: 'John' });
    const res = await request.delete(`/users/${existingUser._id}`);
    expect(res.status).toBe(302);
  });
});
