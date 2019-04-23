const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
    if (pathname.indexOf('/') > -1) {
      res.statusCode = 400;
      res.end('Nested folders not supported');
    }
    const rStream = fs.createReadStream(filepath);
    rStream.on('error', (err) => {
      if (err.code === 'ENOENT') {
        res.statusCode = 404;
        res.end('Page not found');
      } else {
        res.statusCode = 500;
        res.end('Server error');
      }
    })
    rStream.pipe(res);
    break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
