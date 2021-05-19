const http = require('http');
const app = require('./app');

const server = http.createServer(app);
const PORT = process.env.PORT || 8081;

server.listen(PORT, () => {
  console.log(`Listening at: ${PORT}`);
});
