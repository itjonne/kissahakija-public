const sitesRouter = require('express').Router();

const Cat = require('../models/Cat');
const Site = require('../models/Site');

// ============ ENDPOINTS FOR /api/sites/ ====================

// Get all sites
sitesRouter.get('/', async (req, res) => {
  const sites = await Site.find({});
  res.status(200).json(sites);
});

// Add new site
sitesRouter.post('/', async (req, res) => {
  const site = req.body;
  const newSite = new Site(site);
  const savedSite = await newSite.save();
  res.status(201).json(savedSite);
});

// ============ ENDPOINTS FOR /api/sites/:siteId ====================

// Get one site by id
sitesRouter.get('/:id', async (req, res) => {
  const site = await Site.findById(req.params.id);
  if (!site) res.status(404).json({ error: 'not found' });
  res.status(200).json(site);
})

// Update one site
sitesRouter.put('/:id', async (req, res) => {
  const site = req.body;
  const updatedSite = await Site.findByIdAndUpdate(req.params.id, site, { new: true });
  if (!updatedSite) res.status(400).json({ error: 'update failed' });
  res.status(200).json(updatedSite);
});

// Delete one site
sitesRouter.delete('/:id', async (req, res) => {
  const deletedSite = await Site.findByIdAndDelete(req.params.id);
  res.status(200).json(deletedSite);
});

// ======== ENDPOINTS FOR /api/:siteId/objects ===========

// Update one site's objects
sitesRouter.put('/:id/objects', async (req, res) => {
  const cats = req.body.objects; // [cat, cat, cat]

  if (!cats) return res.status(400).json({ error: 'invalid objects' });
  
  for (let cat of cats) {
    const keys = Object.keys(cat);
    const success = ["name", "url", "image"].every((key) => keys.includes(key));
    if (!success) return res.status(400).json({ error: 'invalid objects' });
  }
  
  const updatedSite = await Site.findByIdAndUpdate(req.params.id, { objects: { all: cats } }, { new: true });
  if (!updatedSite) return res.status(400).json({ error: 'problems updating objects' });
  res.status(200).json(updatedSite);
});

module.exports = sitesRouter;
