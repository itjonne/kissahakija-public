const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Site = require('../models/Site');

const ROOT_USER = {
  name: "root",
  email: 'root@email.com',
  password: 'password',
};

const ROOT_SITE = {
  name: 'root site',
  url: 'http://example.com',
  address: 'Helsinki 1',
  province: 'Uusimaa'
};

const newCats = [
  {"name": "kissa1", "url": "https://www.hesy.fi/portfolio/jiro/", "image": "https://www.hesy.fi/wp-content/uploads/2020/07/Jiro_thumbnail_IMG_20201002_200928_resized_20201005_102010803.jpg" },
  {"name": "kissa2", "url": "https://www.hesy.fi/portfolio/gengi/", "image": "https://www.hesy.fi/wp-content/uploads/2020/07/Gengi_thumbnail_IMG_20200922_134346_resized_20200923_074944429.jpg"}
];

const newFalseCats = [
  {"name": "kissa1", "image": "https://www.hesy.fi/wp-content/uploads/2020/07/Jiro_thumbnail_IMG_20201002_200928_resized_20201005_102010803.jpg" },
  {"name": "kissa2", "url": "https://www.hesy.fi/portfolio/gengi/", "image": "https://www.hesy.fi/wp-content/uploads/2020/07/Gengi_thumbnail_IMG_20200922_134346_resized_20200923_074944429.jpg"}
];

const generateUserToken = (user) => {
  const userForToken = {
    id: user._id,
    email: user.email,
  };

  const token = jwt.sign(userForToken, process.env.SECRET);
  return token;
}

const usersInDb = async () => {
  const users = await User.find({});
  return users;
};

const sitesInDb = async () => {
  const sites = await Site.find({});
  return sites;
};

const createRootUser = () => {
  const passwordHash = bcrypt.hashSync(ROOT_USER.password, 10);
  const user = new User({
    name: ROOT_USER.name,
    email: ROOT_USER.email,
    passwordHash,
  });
  return user;
};

const createRootSite = () => {
  const site = new Site({
    name: ROOT_SITE.name,
    url: ROOT_SITE.url,
    address: ROOT_SITE.address,
    province: ROOT_SITE.province
  });
  return site;
}

module.exports = {
  ROOT_USER,
  ROOT_SITE,
  newCats,
  newFalseCats,
  usersInDb,
  createRootUser,
  createRootSite,
  sitesInDb,
  generateUserToken,
};
