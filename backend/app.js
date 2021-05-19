const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
require('express-async-errors');

const usersRouter = require('./controllers/users');

const middleware = require('./util/middleware');
const config = require('./util/config');
const loginRouter = require('./controllers/login');
const signupRouter = require('./controllers/signup');
const sitesRouter = require('./controllers/sites');
const verificationRouter = require('./controllers/verification');
const app = express();

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('error connection to MongoDB:');
});

app.use(express.json());
app.use(morgan('common'));
app.use(cors());
app.use(middleware.tokenExtractor);

app.use('/api/signup', signupRouter);
app.use('/api/login', loginRouter);
app.use('/api/verification', verificationRouter);
app.use('/api/sites', sitesRouter); // middleware.tokenAuth,
app.use('/api/users', middleware.tokenAuth, usersRouter); // middleware.tokenAuth,

app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);

module.exports = app;
