const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const limitSizeStream = require('./LimitSizeStream');
const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  if (pathname.indexOf('/') > -1) {
    res.statusCode = 400;
    res.end('Nested folders not supported');
  }

  switch (req.method) {
    case 'POST':
    
    const writeStream = fs.createWriteStream(filepath, {flags: 'wx'});
    const limitStream = new limitSizeStream({limit: 1e6});
    
    if (req.headers['content-length'] === 0){
      res.statusCode = 409;
      res.end('Request body is empty');
    }

    req 
    .pipe(limitStream)
    .on('error', (err) => {
      if (err.code === 'LIMIT_EXCEEDED'){
        res.statusCode = 413;
        res.setHeader('Connection', 'close');
        res.end('File limit exceeded');
        fs.unlink(filepath, (err) => {});
      }
    })
    .pipe(writeStream)
    .on('error', (err) => {
      if (err.code === 'EEXIST') {
        res.statusCode = 409;
        res.end('File already exist');
      }
    })
    .on('close', () => {
      res.statusCode = 201;
      res.end('file uploaded');
    });
    
    res.on('close', () => {
      if (res.finished) return;
      fs.unlink(filepath, (err) => {});
    });
      
    break;

    default:
      res.statusCode = 500;
      res.end('Not implemented');
    }
});

module.exports = server;
