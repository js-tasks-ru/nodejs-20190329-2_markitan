const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.currentSize = 0;
  }
  _transform(chunk, encoding, callback) {
    this.currentSize += chunk.length;
    if (this.currentSize >= this.limit) {
      callback(new LimitExceededError('Limit'), chunk);
    }
    callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
