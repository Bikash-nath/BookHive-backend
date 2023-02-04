const Book = require('../models/BookModel');
const factory = require('./handlerFactory');
// const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllBooks = factory.getAll(Book);
exports.getBook = factory.getOne(Book, { path: 'reviews' });
// exports.createBook = factory.createOne(Book);
// exports.updateBook = factory.updateOne(Book);
// exports.deleteBook = factory.deleteOne(Book);

exports.getSimilarBooks = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  const similarBooks = await Book.find({ genres: book.genres });
  res.status(200).json({
    status: 'success',
    results: similarBooks.length,
    data: {
      data: similarBooks,
    },
  });
});

exports.updateTopBooks = catchAsync(async (req, res, next) => {
  const books = await Book.find().sort('ratingsAverage').sort('ratingsQuantity').sort('totalFavourites');

  books.forEach(async (book, order) => {
    await book.updateOne({ bestsellerRank: order + 1 });
  });

  res.status(200).json({
    status: 'success',
    results: books.length,
    data: {
      data: books,
    },
  });
});

exports.getTopBooks = catchAsync(async (req, res, next) => {
  // const features = new APIFeatures(Book.find(), { ...req.query, ...req.docFilter }).filter().sort().limitFields();
  const books = await Book.find().sort('bestsellerRank');

  res.status(200).json({
    status: 'success',
    results: books.length,
    data: {
      data: books,
    },
  });
});
