const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  email: {
    type: String,
    index: true,
    required: true,
    unique: true,
    validate: [
      {validator: function(v) {
        return /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(v);
      }},
    ],
    lowercase: true,
    trim: true,
  },
  displayName: {
    type: String,
    index: true,
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model('User', schema);
