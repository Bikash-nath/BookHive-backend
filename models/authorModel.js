const mongoose = require('mongoose');
const slugify = require('slugify');

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'A book must have a title'],
    maxlength: [80, 'A book title must have atmost 80 characters'],
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
  ratingAverage: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  ratingsCount: {
    type: Number,
    default: 0,
  },
  followersCount: {
    type: Number,
    default: 0,
  },
  ratingsRank: {
    type: Number,
    default: 0, //fetched data
    select: false,
  },
  totalFollowers: {
    type: Number,
    default: 0, //fetched data
    select: false,
  },
  topBook: {
    type: String,
    trim: true, //fetched data
  },
  genres: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Genre',
    },
  ],
});

authorSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'author', //in Review modal
  localField: '_id',
});

authorSchema.virtual('books', {
  ref: 'Book',
  foreignField: 'author', //in Book modal
  localField: '_id',
});

authorSchema.pre('save', function (next) {
  this.slug = slugify(this.name + '-' + this._id, { lower: true });
  next();
});

const Author = mongoose.model('Author', authorSchema);
module.exports = Author;
