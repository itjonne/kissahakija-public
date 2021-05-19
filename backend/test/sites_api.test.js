const mongoose = require('mongoose');
const supertest = require('supertest');

const app = require('../app');
const helpers = require('./helpers');
const Site = require('../models/Site');
const api = supertest(app);

describe('Tests for /api/sites', () => {
  describe('Tests for empty db', () => {
    beforeEach(async () => {
      await Site.deleteMany({});
    });

    test('Site can be added', async () => {
      const startSites = await helpers.sitesInDb();

      const site = {
        name: 'test site',
        url: 'http://example.com',
        address: 'helsinki',
        province: 'Uusimaa',
      };

      const response = await api.post('/api/sites')
        .send(site)
        .expect(201)
        .expect('Content-Type', 'application/json; charset=utf-8');

      const endSites = await helpers.sitesInDb();
      expect(endSites.length).toBe(startSites.length + 1);  
    });

  describe('Tests with one site in db', () => {
    beforeEach(async () => {
      await Site.deleteMany({});
      const rootSite = helpers.createRootSite();
      await rootSite.save();
    });

    test('Site can be removed', async () => {
      const startSites = await helpers.sitesInDb();

      const site = await Site.findOne({ name: helpers.ROOT_SITE.name });
      const response = await api.delete(`/api/sites/${site._id.toString()}`)
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8');

      const endSites = await helpers.sitesInDb();
      
      expect(endSites.length).toBe(startSites.length - 1);
      expect(response.body).toHaveProperty('id');
    });

    test('Site can update found cats', async () => {
      const startSites = await helpers.sitesInDb();
      const site = await Site.findOne({ name: helpers.ROOT_SITE.name });
      console.log(site);
      expect(site.objects.all.length).toBe(0);

      const response = await api.put(`/api/sites/${site._id.toString()}/objects`)
      .send({objects: helpers.newCats})
      .expect(200)
      .expect('Content-Type', "application/json; charset=utf-8")

      const endSite = await Site.findOne({ name: helpers.ROOT_SITE.name });
      console.log(endSite);
      expect(endSite.objects.all.length).toBe(helpers.newCats.length);
    });

    test('Falsy cats cant be added', async () => {
      const startSites = await helpers.sitesInDb();
      const site = await Site.findOne({ name: helpers.ROOT_SITE.name });

      expect(site.objects.all.length).toBe(0);

      const response = await api.put(`/api/sites/${site._id.toString()}/objects`)
      .send({objects: helpers.newFalseCats})
      .expect(400)
      .expect('Content-Type', "application/json; charset=utf-8")

      const endSite = await Site.findOne({ name: helpers.ROOT_SITE.name });
      expect(endSite.objects.all.length).toBe(0);
    });
  })  
  })
})

afterAll(() => {
  mongoose.connection.close();
});