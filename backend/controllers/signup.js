const signupRouter = require('express').Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const User = require('../models/User');
const Verification = require('../models/Verification');
const helpers = require('../util/helpers');

const generateVerificationHash = async () => {
  const randomString = crypto.randomBytes(128).toString('hex');
  return await bcrypt.hash(randomString, 10);
}

signupRouter.post('/', async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) return res.status(400).json({ error: 'invalid credentials' });
  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    passwordHash,
  });

  const savedUser = await newUser.save();
  if (!savedUser) return res.status(400).json({ error: `couldn't create user` });
  const hash = await generateVerificationHash();
  const verification = new Verification({ hash, user: savedUser._id });
  await verification.save();

  // helpers.sendVerificationEmail(savedUser.email, hash);
  res.status(201).json(savedUser.toJSON());
});

module.exports = signupRouter;
