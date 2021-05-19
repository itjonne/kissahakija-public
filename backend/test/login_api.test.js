const mongoose = require('mongoose');
const supertest = require('supertest');

const app = require('../app');
const helpers = require('./helpers');
const User = require('../models/User');
const api = supertest(app);

describe('Tests for /api/login', () => {
  describe('Tests for empty db', () => {
    // Tyhjennetään kaikki.
    beforeEach(async () => {
      await User.deleteMany({});
    });

    test('User can register/login', async () => {
      const startUsers = await helpers.usersInDb();

      const user = helpers.ROOT_USER;
      const response = await api.post('/api/signup')
        .send(user)
        .expect(201)
        .expect('Content-Type', 'application/json; charset=utf-8');

      const endUsers = await helpers.usersInDb();
      expect(endUsers.length).toBe(startUsers.length + 1);
      
      const responseLogin = await api.post('/api/login')
        .send({"email": user.email, "password": user.password })
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8');

      expect(responseLogin.body.token).toBeTruthy();  
    });

    test('wrong password doesnt work', async () => {
      const startUsers = await helpers.usersInDb();

      const user = helpers.ROOT_USER;
      const response = await api.post('/api/signup')
        .send(user)
        .expect(201)
        .expect('Content-Type', 'application/json; charset=utf-8');

      const endUsers = await helpers.usersInDb();
      expect(endUsers.length).toBe(startUsers.length + 1);

      const responseLogin = await api.post('/api/login')
      .send({"email": user.email, "password": "wrongpassword" })
      .expect(401)
      .expect('Content-Type', 'application/json; charset=utf-8');

    });

    test('invalid credentials dont work', async () => {
      const startUsers = await helpers.usersInDb();

      const user = helpers.ROOT_USER;
      const response = await api.post('/api/signup')
        .send(user)
        .expect(201)
        .expect('Content-Type', 'application/json; charset=utf-8');

      const loginResponse = await api.post('/api/login')
        .send({})
        .expect(400)

      const endUsers = await helpers.usersInDb();
      expect(endUsers.length).toBe(startUsers.length + 1);  
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});