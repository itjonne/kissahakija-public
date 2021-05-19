const loginRouter = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const verifyPassword = async (password, passwordHash) => {
  const result = await bcrypt.compare(password, passwordHash);
  return result;
}

loginRouter.post('/', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({error: 'invalid credentials'});

  const user = await User.findOne({ email });
  if (!user || (! await verifyPassword(password, user.passwordHash))) return res.status(401).json({ error: 'invalid email or password' });

  const userForToken = {
    id: user._id,
    email,
  };

  const token = jwt.sign(userForToken, process.env.SECRET);
  
  await user.execPopulate('sites'); // Tällä saa ehkä populoituu?
  const jsonUser = user.toJSON();

  res.status(200).json({
    ...jsonUser,
    token,
  });
});

module.exports = loginRouter;
