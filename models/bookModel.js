const mongoose = require('mongoose');
const slugify = require('slugify');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'A book must have a title'],
      maxlength: [80, 'A book title must have atmost 80 characters'],
    },
    slug: { type: String, trim: true },
    ISBN_10: {
      type: Number,
      default: 0,
    },
    ISBN_13: {
      type: Number,
      default: 0,
    },
    language: {
      type: String,
      trim: true,
      default: 'English',
    },
    publisher: {
      type: String,
      trim: true,
    },
    publicationDate: {
      type: String,
      trim: true,
    },
    origin: {
      type: String,
      trim: true,
    },
    ageGroup: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      minlength: [40, 'A book description must have atleast 40 characters'],
    },
    imageSm: {
      type: String,
      required: [true, 'A book must have a cover image'],
      default: '/img/books/book_img.jpg',
    },
    imageLg: {
      type: String,
      default: '/img/books/book_img-lg.jpg',
    },
    addedOn: {
      type: Date,
      default: Date.now,
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
    totalFavourites: {
      type: Number,
      default: 0,
    },
    bestsellerRank: {
      type: Number, //calculated
      default: 0,
      select: false,
    },
    ratingsRank: {
      type: Number,
      default: 0, //fetched data
      select: false,
    },
    ratingsTotal: {
      type: Number,
      default: 0, //fetched data
      select: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    formats: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Format',
      },
    ],
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'Author',
    },
    series: {
      type: mongoose.Schema.ObjectId,
      ref: 'Series',
    },
    genres: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Genre',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate - parent to child reference
bookSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'book', //in Review modal
  localField: '_id',
});

// QUERY MIDDLEWARE - child populate
bookSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'author',
    select: 'name slug imageSm',
  });
  next();
});

/*
bookSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'formats',
    select: 'type length link',
  });
  next();
});

bookSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'genres',
    select: 'title slug',
  });
  next();
});*/

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
