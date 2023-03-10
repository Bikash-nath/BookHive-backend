const mongoose = require('mongoose');
// const slugify = require('slugify');

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'Author must have a name'],
      maxlength: [80, 'Author name must have atmost 80 characters'],
    },
    slug: { type: String, trim: true, unique: true },
    image: {
      type: String,
      required: [true, 'Author must have a cover image'],
      default: '/img/authors/author_img.jpg',
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
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      select: false,
    },
    ratingsCount: {
      type: Number,
      default: 0,
      select: false,
    },
    followersCount: {
      type: Number,
      default: 0,
    },
    ratingsAvg: {
      type: Number,
      default: 0, //fetched data
    },
    totalFollowers: {
      type: Number,
      default: 0, //fetched data
      select: false,
    },
    topBook: {
      title: {
        type: String,
        trim: true, //fetched data
      },
      book: {
        type: mongoose.Schema.ObjectId,
        ref: 'Book',
      },
    },
    genres: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Genre',
      },
    ],
    books: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Book',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

authorSchema.index({ slug: 1 });
authorSchema.index({ ratingsAvg: -1, totalFollowers: -1 });

authorSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'author', //in Review modal
  localField: '_id',
});

authorSchema.pre('findOne', function (next) {
  this.populate({
    path: 'genres',
    select: 'name title slug',
  });
  next();
});

authorSchema.pre('findOne', function (next) {
  this.populate({
    path: 'books',
    select: 'title image author slug',
  });
  next();
});

const Author = mongoose.model('Author', authorSchema);
module.exports = Author;
