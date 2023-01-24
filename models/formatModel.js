const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const formatSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: {
      values: ['Audiobook', 'EPUB', 'PDF'],
    },
  },
  length: {
    type: String,
    trim: true,
  },
  link: {
    type: String,
    trim: true,
  },
});

const Format = mongoose.model('Format', formatSchema);
module.exports = Format;
