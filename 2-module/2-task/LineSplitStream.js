const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
  }
  
  _transform(chunk, encoding, next) {
    const lines = ((this.soFar != null ? this.soFar : "") + chunk.toString()).split(os.EOL);
    this.soFar = lines.pop();
    
    for (const line of lines){
      this.push(line);
    }
    next();
  }
  
  _flush(done) {
    this.push(this.soFar != null ? this.soFar:"");
    done();
  }
}

module.exports = LineSplitStream;
