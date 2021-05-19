const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: 'unknown endpoint' });
};

const errorHandler = (error, req, res, next) => {
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  }
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }
  return next(error);
};

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

const tokenExtractor = (request, response, next) => {
  const token = getTokenFrom(request);
  if (token) {
    request.token = token;
  }
  next();
};

const tokenAuth = (request, response, next) => {
  const jwt = require('jsonwebtoken');
  const token = request.token;
  if (!token) return response.status(401).json({ error: 'no access' });
  const verifiedToken = jwt.verify(token, process.env.secret);
  // TODO: Tähän vois tehdä oikean testin.
  if (!verifiedToken) return response.status(401).json({ error: 'no access' });
  next();
};

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  tokenAuth,
};
