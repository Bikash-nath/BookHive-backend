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
  numReviews: {
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
  followerRank: {
    type: Number,
    default: 0, //based on fetched data
  },
  totalFollowers: {
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

authorSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'author', //in Review modal
  localField: '_id',
});

bookSchema.virtual('reviews', {
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
