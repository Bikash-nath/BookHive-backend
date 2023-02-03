const mongoose = require('mongoose');
// const validator = require('validator');

const userLibrarySchema = new mongoose.Schema({
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
  books: [
    {
      type: mongoose.Schema.ObjectId,
      ref: '',
    },
  ],
});

const UserLibrary = mongoose.model('UserLibrary', userLibrarySchema);
module.exports = UserLibrary;

/*
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
*/
