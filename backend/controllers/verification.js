const User = require('../models/User');
const Verification = require('../models/Verification');

const verificationRouter = require('express').Router();

verificationRouter.get('/', async (req, res) => {
  const hash = req.query.user;
  if (!hash) return res.status(404).json({ error: 'invalid hash' });

  const verification = await Verification.findOne({ hash });
  if (!verification) return res.status(404).json({ error: 'invalid hash' });

  const user = await User.findById(verification.user);
  if (!user) return res.status(404).json({ error: 'no user found with that hash' });

  user.active = true;
  await user.save();

  res.status(200).json(user);
});

module.exports = verificationRouter;
