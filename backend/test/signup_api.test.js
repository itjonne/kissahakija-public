const mongoose = require('mongoose');
const supertest = require('supertest');

const app = require('../app');
const helpers = require('./helpers');
const User = require('../models/User');
const api = supertest(app);

describe('Tests for /api/signup', () => {
  describe('Tests for empty db', () => {
    // Tyhjennetään kaikki.
    beforeEach(async () => {
      await User.deleteMany({});
    });

    test('User can register', async () => {
      const startUsers = await helpers.usersInDb();

      const user = helpers.ROOT_USER;
      const response = await api.post('/api/signup')
        .send(user)
        .expect(201)
        .expect('Content-Type', 'application/json; charset=utf-8');

      const endUsers = await helpers.usersInDb();
      expect(endUsers.length).toBe(startUsers.length + 1);  
    });

    test('Same user cant register twice', async () => {
      const startUsers = await helpers.usersInDb();

      const user = helpers.ROOT_USER;
      const response = await api.post('/api/signup')
        .send(user)
        .expect(201)
        .expect('Content-Type', 'application/json; charset=utf-8');

      const endUsers = await helpers.usersInDb();
      expect(endUsers.length).toBe(startUsers.length + 1);

      const response2 = await api.post('/api/signup')
      .send(user)
      .expect(400)
      .expect('Content-Type', 'application/json; charset=utf-8');
    });

    test('Cant register with invalid credentials', async () => {
      const startUsers = await helpers.usersInDb();

      const user = {"name": "virhe", "password": "salasana"};
      const response = await api.post('/api/signup')
        .send(user)
        .expect(400)
        .expect('Content-Type', 'application/json; charset=utf-8');

      const endUsers = await helpers.usersInDb();
      expect(endUsers.length).toBe(startUsers.length);  
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
