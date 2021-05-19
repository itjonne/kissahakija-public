const usersRouter = require('express').Router();
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Site = require('../models/Site');

// ========== ENDPOINTS FOR / =================

// Gets all the users
usersRouter.get('/', async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// Adds one user.
usersRouter.post('/', async (req, res) => {
  const { name, email, passwordHash } = req.body;

  const newUser = new User({
    name,
    email,
    passwordHash,
  });

  const savedUser = await newUser.save();
  res.status(201).json(savedUser.toJSON());
});

// ============ ENDPOINTS FOR /:userId =============

// Get one user by id
usersRouter.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user.toJSON());
});


// Update user
usersRouter.put('/:id', async (req, res) => {
  const user = req.body;
  const updatedUser = await User.findByIdAndUpdate(req.params.id, user, { new: true });
  res.json(updatedUser);
});

// Delete user
usersRouter.delete('/:id', async (req, res) => {
  const deletedUser = await User.findByIdAndDelete(req.params.id);
  res.json(deletedUser.toJSON());
});

// ============ ENDPOINTS FOR /:userId/sites =================

// Get all the sites of a user
usersRouter.get('/:id/sites', async (req, res) => {
  const user = await User.findById(req.params.id).populate('sites');
  if (!user) res.status(404).json({ error: 'user not found' });
  res.json(user.sites);
})

// TODO: Tuliskohan tää nimen perusteella?
// Add one site to user site list.
usersRouter.post('/:id/sites', async (req, res) => {
  const token = req.token;
  if (!token) {
    return res.status(401).json({ error: 'no token found' });
  };

  const verifyToken = jwt.verify(token, process.env.SECRET);

  if (verifyToken.id !== req.params.id) {
    return res.status(401).json({ error: 'invalid token' });
  }
  
  const siteId = req.body.id;

  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: `user: ${req.params.id} not found` });

  const site = await Site.findById(siteId);
  if (!site) return res.status(404).json({ error: `site not found` });

  if (user.sites.includes(site._id.toString())) {
    return res.status(409).json(user);
  }

  user.sites.push(site._id.toString())
  await user.save();
  res.status(200).json(user);
});

// Delete site from users list
usersRouter.delete('/:id/sites/:siteId', async (req, res) => {
  const token = req.token;
  if (!token) {
    return res.status(401).json({ error: 'no token found' });
  };

  const verifyToken = jwt.verify(token, process.env.SECRET);

  if (verifyToken.id !== req.params.id) {
    return res.status(401).json({ error: 'invalid token' });
  }

  const siteId  = req.params.siteId;
  const user = await User.findById(req.params.id);
  if (!user.sites.includes(siteId.toString())) return res.status(404).json({ error: `site not found` });

  user.sites = user.sites.filter(usersite => usersite != siteId.toString());
  await user.save();
  res.status(200).json(user);
});

module.exports = usersRouter;
