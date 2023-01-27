const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const formatSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: {
      values: ['Audiobook', 'EPUB', 'PDF', 'Ebook'],
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
  book: {
    type: mongoose.Schema.ObjectId,
    ref: 'Book',
  },
});

const Format = mongoose.model('Format', formatSchema);
module.exports = Format;
