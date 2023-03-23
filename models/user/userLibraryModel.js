const mongoose = require('mongoose');
// const validator = require('validator');

const userLibrarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'UserProfile',
  },
  books: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Book',
    },
  ],
  authors: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Author',
    },
  ],
  genres: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Genre',
    },
  ],
});

userLibrarySchema.pre(/^find/, function (next) {
  this.populate({
    path: 'books',
    select: 'title image author slug',
  });
  next();
});

userLibrarySchema.pre(/^find/, function (next) {
  this.populate({
    path: 'authors',
    select: 'name image author slug',
  });
  next();
});

userLibrarySchema.pre(/^find/, function (next) {
  this.populate({
    path: 'genres',
    select: 'title slug',
  });
  next();
});

const UserLibrary = mongoose.model('UserLibrary', userLibrarySchema);
module.exports = UserLibrary;

/*
  title: {
    type: String,
    trim: true,
    required: [true, 'A collection must have a title'],
    maxlength: [80, 'A collection title must have atmost 80 characters'],
  },
  description: {
    type: String,
    trim: true,
  },
*/
