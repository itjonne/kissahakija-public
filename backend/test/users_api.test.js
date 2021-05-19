const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');

const app = require('../app');
const helpers = require('./helpers');
const User = require('../models/User');
const Site = require('../models/Site');

const api = supertest(app);

describe('Tests for /api/users/', () => {
  describe('Tests for empty db', () => {
    beforeEach(async () => {
      await User.deleteMany({}); // Poista kaikki
      await Site.deleteMany({});
    });

    test('User can be added', async () => {
      const startUsers = await helpers.usersInDb();

      const passwordHash = await bcrypt.hash('salasana', 10);
      const user = {
        name: 'testaaja',
        email: 'testaaja@email.com',
        passwordHash,
      };

      const token = helpers.generateUserToken(user);
      
      const response = await api.post('/api/users/')
        .set('Authorization', `Bearer ${token}`)
        .send(user)
        .expect(201)
        .expect('Content-Type', 'application/json; charset=utf-8');

      const endUsers = await helpers.usersInDb();
      expect(response.body).toHaveProperty('id');
      expect(endUsers.length).toBe(startUsers.length + 1);
    });
  });

  describe('Tests with one user in db', () => {
    beforeEach(async () => {
      await User.deleteMany({});
      await Site.deleteMany({});
      const rootUser = helpers.createRootUser();
      await rootUser.save();
    });

    test('User can be deleted', async () => {
      const startUsers = await helpers.usersInDb();

      const user = await User.findOne({ email: helpers.ROOT_USER.email });

      const token = helpers.generateUserToken(user);

      const response = await api.delete(`/api/users/${user._id.toString()}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8');

      const endUsers = await helpers.usersInDb();
      expect(endUsers.length).toBe(startUsers.length - 1);
      expect(response.body.id).toMatch(user._id.toString());
    });
  });

  describe('Test with one site in db', () => {
    beforeEach(async () => {
      await User.deleteMany({});
      await Site.deleteMany({});
      const rootSite = helpers.createRootSite();
      const rootUser = helpers.createRootUser();
      await rootSite.save();
      await rootUser.save();
    });

    test('User can add a site to sites-list', async () => {
      const rootSite = helpers.ROOT_SITE;
      const rootUser = helpers.ROOT_USER;

      const user = await User.findOne({ name: rootUser.name });
      const site = await Site.findOne({ name: rootSite.name });

      const sitesAtStart = user.sites;

      const token = helpers.generateUserToken(user);

      const response = await api.post(`/api/users/${user._id}/sites`)
        .set('Authorization', `Bearer ${token}`)
        .send({ id: site._id })
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8');

      const userAtEnd = await User.findOne({ name: user.name });
      const sitesAtEnd = userAtEnd.sites;

      expect(sitesAtEnd.length).toBe(sitesAtStart.length + 1);
      expect(sitesAtEnd).toContainEqual(site._id);
    });

    test('Site can be removed', async () => {
      const rootSite = helpers.ROOT_SITE;
      const rootUser = helpers.ROOT_USER;

      const user = await User.findOne({ name: rootUser.name });
      const site = await Site.findOne({ name: rootSite.name });

      const sitesAtStart = user.sites;

      const token = helpers.generateUserToken(user);

      await api.post(`/api/users/${user._id}/sites/`)
      .set('Authorization', `Bearer ${token}`)
      .send({ id: site._id })
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8');

      const userAtMiddle = await User.findOne({ name: user.name });
      const sitesAtMiddle = userAtMiddle.sites;

      expect(sitesAtMiddle.length).toBe(sitesAtStart.length + 1);
      expect(sitesAtMiddle).toContainEqual(site._id);  

      const response = await api.delete(`/api/users/${user._id}/sites/${site._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      const endUser = await User.findOne({ name: user.name });
      expect(endUser.sites.length).toBe(0);

      expect(response.body.sites.length).toBe(0);
    });

    test('False site cant be added', async () => {
      const rootSite = helpers.ROOT_SITE;
      const rootUser = helpers.ROOT_USER;

      const user = await User.findOne({ name: rootUser.name });
      const token = helpers.generateUserToken(user);
      const site = {
        name: 'eilöydy',
        url: 'http://eitatakaa.com',
        address: "eilöydyhelsinki",
        province: "Uusimaa"
      };

      const sitesAtStart = user.sites;

      const response = await api.post(`/api/users/${user._id}/sites`)
        .set('Authorization', `Bearer ${token}`)
        .send({ id: 'jf324ndsl' })
        .expect(400)
        .expect('Content-Type', 'application/json; charset=utf-8');
          
      expect(response.body.error).toContain('malformatted id');

      const userAtEnd = await User.findOne({ name: user.name });
      const sitesAtEnd = userAtEnd.sites;

      expect(sitesAtEnd.length).toBe(sitesAtStart.length);
      expect(sitesAtEnd).not.toContainEqual(site._id);      
    });
  })
});

afterAll(() => {
  mongoose.connection.close();
});
