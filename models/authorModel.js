const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'A book must have a title'],
    maxlength: [80, 'A book title must have atmost 80 characters'],
    minlength: [10, 'A book title must have atleast 10 characters'],
  },
  slug: { type: String, trim: true },
  imageSm: {
    type: String,
    required: [true, 'A book must have a cover image'],
    default: 'author-sm.jpg',
  },
  imageLg: {
    type: String,
    required: [true, 'A book must have a cover image'],
    default: 'author-lg.jpg',
  },
  biography: {
    type: String,
    trim: true,
  },
  language: {
    type: String,
    default: 'English',
  },
  origin: {
    type: String,
    default: 'India',
  },
  dob: {
    type: String,
  },
  website: {
    type: String,
  },
  twitter: {
    type: String,
  },
  num_reviews: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 1,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
    set: (val) => Math.round(val * 10) / 10,
  },
  total_followers: {
    type: Number,
    default: 0,
  },
  genres: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Genre',
    },
  ],
});

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;
