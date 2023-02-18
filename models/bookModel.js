const mongoose = require('mongoose');
// const slugify = require('slugify');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'A book must have a title'],
      maxlength: [120, 'A book title must have atmost 120 characters'],
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
      minlength: [30, 'A book description must have atleast 30 characters'],
    },
    image: {
      path: {
        type: String,
        required: [true, 'A book must have a cover image'],
        default: '/img/books/book_img.jpg',
      },
      dimensions: {
        height: String,
        width: String,
      },
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
    createdAt: {
      type: Date,
      default: Date.now,
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
    select: 'name slug image',
  });
  next();
});

bookSchema.pre(/^findOne/, function (next) {
  this.populate({
    path: 'genres',
    select: 'title slug',
  });
  next();
});

bookSchema.pre(/^findOne/, function (next) {
  this.populate({
    path: 'formats',
    select: 'type pages',
  });
  next();
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
