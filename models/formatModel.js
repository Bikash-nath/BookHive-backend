const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const formatSchema = new mongoose.Schema({
  bookType: {
    type: String, //'audiobook', 'epub', 'pdf', 'ebook'
  },
  pages: {
    count: Number,
    link: {
      type: String,
      trim: true,
    },
  },
  chapters: [
    {
      count: Number,
      title: String,
      length: {
        type: Number,
        trim: true,
      },
      link: {
        type: String,
        trim: true,
      },
    },
  ],
  book: {
    type: mongoose.Schema.ObjectId,
    ref: 'Book',
  },
});

const Format = mongoose.model('Format', formatSchema);
module.exports = Format;
