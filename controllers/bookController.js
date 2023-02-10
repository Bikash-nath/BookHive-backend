const Book = require('../models/bookModel');
const factory = require('./handlerFactory');
// const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllBooks = factory.getAll(Book, 'title image author slug'); //{_id:0} - fields without _id
exports.getBook = factory.getOne(Book, { path: 'reviews' });
exports.createBook = factory.createOne(Book);
exports.updateBook = factory.updateOne(Book);
exports.deleteBook = factory.deleteOne(Book);

exports.getSimilarBooks = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  const similarBooks = [];
  console.log(similarBooks, '\n');

  book.genres.forEach(async (genre) => {
    const similarBook = await Book.find({ genres: genre });
    console.log('\n\n---->\n');
    similarBook.forEach((book) => similarBooks.push(book));
    console.log(similarBook.length, '\n');
  });
  console.log('\n\n---->\n');
  console.log(similarBooks, '\n');

  res.status(200).json({
    status: 'success',
    results: similarBooks.length,
    data: {
      data: similarBooks,
    },
  });
});

/*
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
});*/
